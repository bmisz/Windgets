import { useState, useEffect } from 'react';
import {weatherIcons} from './assets';
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
		return `${hours > 12 ? hours - 12 : hours}:${minutes < 10 ? '0' + minutes : minutes}${
			hours >= 12 ? 'PM' : 'AM'
		}`;
	}

	return (
		<div className="weather-widget">
			<div className="top-container">
				<div className="weather">
					<div className='city-container'>
						<h3 className="city">West Newbury</h3>
						<img className='nav-icon' src={nav} />
					</div>
					<h3 className="temp">
						{Math.round(weather?.main?.temp) || 'Loading...'}°
					</h3>
				</div>
				<div className="condition-icon">
					<img className="icon" src={icon} alt='Weather Icon' />
				</div>
			</div>
			<div className="bottom-container">
				<a>{Math.round(weather?.main?.humidity)}%</a>
				<a>{weather?.sys?.sunrise && formatTime(weather.sys.sunrise)}</a>
				<a>{weather?.sys?.sunset && formatTime(weather.sys.sunset)}</a>
				<a>{Math.round(weather?.wind?.speed)} mph</a>
			</div>
		</div>
	);
}