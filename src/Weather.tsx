import { useState, useEffect } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { UserSettings } from './SettingsPage/SettingsPage';
import { weatherIcons, nightWeatherIcons } from './assets';
import nav from './assets/nav.svg';
import humidity from './assets/humidity.svg';
import sunrise from './assets/sunrise.svg';
import sunset from './assets/sunset.svg';
import wind from './assets/wind.png';
import './Weather.css';

export default function Weather() {
	const [weather, setWeather] = useState<any>(null);
	const [userLocation, setUserLocation] = useState<any>('Loading...');
	const [icon, setIcon] = useState<string | undefined>(undefined);
	const [descriptor, setDescriptor] = useState<string | undefined>(undefined);

	useEffect(() => {
		const userLoc = getUserLocation();
		setUserLocation(userLoc);
		fetchWeather();

		const interval = setInterval(
			() => {
				fetchWeather();
			},
			1000 * 60 * 20
		);

		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if (weather) {
			setDescriptor(computeWeatherTraits(weather));
		}
	}, [weather]);

	async function getUserSettings() {
		const store = await load('settings.json');
		const settingsPromise = store.get<UserSettings>('userSettings');
		const settings = await settingsPromise;
		console.log(settings);
		return settings;
	}

	async function fetchWeather() {
		try {
			const userSettings = await getUserSettings();

			let userLocation = 'No location found';
			if (userSettings) {
				userLocation = userSettings.location.replace(/,(\s*)/g, ',');
				console.log(userLocation);
			} else {
				console.log(userLocation);
			}

			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${userLocation}&units=imperial&appid=${
					import.meta.env.VITE_OPEN_WEATHER_KEY
				}`
			);
			console.log(response);
			const data = await response.json();
			setWeather(data);

			const iconCode = data.weather[0].id;

			const unixEpochTime = Date.now();

			if (unixEpochTime <= data.sys.sunset * 1000) {
				const iconPath = weatherIcons[iconCode];
				if (iconPath) {
					setIcon(iconPath);
				}
			} else {
				const iconPath = nightWeatherIcons[iconCode];
				if (iconPath) {
					setIcon(iconPath);
				}
			}
		} catch (error) {
			console.log(error);
		}
	}

	function formatTime(timestamp: number) {
		const date = new Date(timestamp * 1000);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		return `${hours > 12 ? hours - 12 : hours}:${
			minutes < 10 ? '0' + minutes : minutes
		}${hours >= 12 ? 'PM' : 'AM'}`;
	}

	function computeWeatherTraits(weather: any) {
		// This might be the most shit function i've ever written.

		// Moisture trait
		const humidity = weather?.main?.humidity;
		let humidityWord: string | undefined;
		if (humidity >= 80) {
			humidityWord = 'Humid';
		} else if (humidity <= 30) {
			humidityWord = 'Dry';
		}

		// Temperature trait
		const temperature = weather?.main?.temp;
		let tempWord: string | undefined;
		if (temperature >= 85) {
			tempWord = 'Hot';
		} else if (temperature >= 70) {
			tempWord = 'Warm';
		} else if (temperature >= 60) {
			tempWord = 'Mild';
		} else if (temperature >= 40) {
			tempWord = 'Chilly';
		} else if (temperature >= 30) {
			tempWord = 'Cold';
		} else {
			tempWord = 'Freezing';
		}

		// Wind trait
		const wind = weather?.wind?.speed;
		let windWord: string | undefined;
		if (wind < 7) {
			windWord = 'Calm';
		} else if (wind < 15) {
			windWord = 'Breezy';
		} else if (wind > 15 && wind < 40) {
			windWord = 'Windy';
		} else {
			return 'Extreme Winds';
		}

		// Two word computation
		if (humidityWord === undefined) {
			return tempWord + ' and ' + windWord;
		} else if (
			humidityWord === 'Humid' &&
			temperature >= 60 &&
			temperature <= 70
		) {
			return 'Mild and Humid';
		} else if (
			humidityWord === 'Humid' &&
			temperature >= 70 &&
			temperature <= 80
		) {
			return 'Warm and Humid';
		} else if (humidityWord === 'Humid' && temperature >= 80) {
			return 'Hot and Humid';
		} else if (humidityWord === 'Dry' && !(wind > 15)) {
			return `${tempWord} and Dry`;
		} else {
			return `${tempWord} and ${windWord}`;
		}
	}

	async function getUserLocation() {
		const userSettings = await getUserSettings();

		if (userSettings !== undefined) {
			const rawLocation: string = userSettings.location;
			const commaLocation: number = rawLocation.indexOf(',');
			const pureLocation: string = rawLocation.substring(0, commaLocation);
			return pureLocation;
		}
		return 'Loading...';
	}

	return (
		<div className="weather-widget">
			<div className="top-container">
				<div className="weather">
					<div className="city-container">
						<h3 className="city">{userLocation}</h3>
						<img className="nav-icon" src={nav} />
					</div>
					<h3 className="temp">
						{Math.round(weather?.main?.temp) || 'Loading...'}°
					</h3>
					<a className="two-word">
						{descriptor === undefined ? 'Undefined' : descriptor}
					</a>{' '}
				</div>
				<div className="condition-icon">
					<img className="icon" src={icon} alt="Weather Icon" />
				</div>
			</div>

			<div className="bottom-container">
				<div className="additional-weather-element">
					<img className="humidity-icon" src={humidity} />
					<a>{Math.round(weather?.main?.humidity)}%</a>
				</div>
				<div className="additional-weather-element">
					<img className="sunrise-icon" src={sunrise} />
					<a>
						{weather?.sys?.sunrise &&
							formatTime(weather.sys.sunrise)}
					</a>
				</div>
				<div className="additional-weather-element">
					<img className="sunset-icon" src={sunset} />
					<a>
						{weather?.sys?.sunset && formatTime(weather.sys.sunset)}
					</a>
				</div>
				<div className="additional-weather-element">
					<img className="wind-icon" src={wind} />
					<a>{Math.round(weather?.wind?.speed)} mph</a>
				</div>
			</div>
		</div>
	);
}
