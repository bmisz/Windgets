import { useState, useEffect } from 'react';
import { weatherIcons } from './assets';
import nav from './assets/nav.svg';
import './Weather.css';

//TODO get users location automatically.
export default function Weather() {
	const [weather, setWeather] = useState<any>(null);
	const [icon, setIcon] = useState<string | undefined>(undefined);

	useEffect(() => {
		fetchWeather();

		const interval = setInterval(() => {
			fetchWeather();
		}, 1000 * 60 * 20);

		return () => clearInterval(interval);
	}, []);

	async function fetchWeather() {
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=42.773792292381984&lon=-70.94802658781295&units=imperial&appid=${
					import.meta.env.VITE_OPEN_WEATHER_KEY
				}`
			);
			console.log(response);
			const data = await response.json();
			setWeather(data);

			const iconCode = data.weather[0].id;
			console.log(iconCode);
			const iconPath = weatherIcons[iconCode];
			if (iconPath) {
				setIcon(iconPath);
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
		//TODO figure out best way to do this
		// Moisture trait
		const humidity = weather?.main?.humidity;
		let humidityWord: string | undefined;
		if (humidity >= 80) {
			humidityWord = 'Humid';
		}
		else if (humidity <= 30) {
			humidityWord = 'Dry';
		}

		// Temperature trait
		const temperature = weather?.main?.temp;
		let tempWord: string | undefined;
		if (temperature >= 85) {
			tempWord = 'Hot';
		}
		else if (temperature >= 70) {
			tempWord = 'Warm';
		}
		else if (temperature >= 60) {
			tempWord = 'Mild';
		}
		else if (temperature >= 40) {
			tempWord = 'Chilly';
		}
		else if (temperature >= 30) {
			tempWord = 'Cold';
		}
		else {
			tempWord = 'Freezing';
		}

		// Wind trait
		const wind = weather?.wind?.speed;
		let windWord: string | undefined;
		if (wind < 7) {
			windWord = 'Calm';
		}
		else if (wind < 15) {
			windWord = 'Breezy';
		}
		else if (wind > 15 && wind < 40) {
			windWord = 'Windy';
		}
		else {
			return 'Extreme Winds';
		}


		// Two word computation
		if (humidityWord === undefined) {
			return tempWord + ' and ' + windWord;
		}
		else if (humidityWord === 'Humid' && temperature >= 60 && temperature <= 70) {
			return 'Mild and Humid';
		}
		else if (humidityWord === 'Humid' && temperature >= 70 && temperature <= 80) {
			return 'Warm and Humid';
		}
		else if (humidityWord === 'Humid' && temperature >= 80) {
			return 'Hot and Humid';
		}
		else if (humidityWord === 'Dry' && !(wind > 15)) {
			return `${tempWord} and Dry`
		}
		else {
			return `${tempWord} and ${windWord}`
		}
	}

	return (
		<div className="weather-widget">
			<div className="top-container">
				<div className="weather">
					<div className="city-container">
						<h3 className="city">West Newbury</h3>
						<img className="nav-icon" src={nav} />
					</div>
					<h3 className="temp">
						{Math.round(weather?.main?.temp) || 'Loading...'}°
					</h3>
					<a className="two-word">{computeWeatherTraits(weather)}</a>{' '}
					{/* TODO: add 2 word description functionality. */}
				</div>
				<div className="condition-icon">
					<img className="icon" src={icon} alt="Weather Icon" />
					{/* TODO: fix weird positioning of icon. Square it in corner. */}
				</div>
			</div>
			<div className="bottom-container">
				<a>{Math.round(weather?.main?.humidity)}%</a>
				<a>
					{weather?.sys?.sunrise && formatTime(weather.sys.sunrise)}
				</a>
				<a>{weather?.sys?.sunset && formatTime(weather.sys.sunset)}</a>
				<a>{Math.round(weather?.wind?.speed)} mph</a>
			</div>
		</div>
	);
}
