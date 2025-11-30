import clear from './clear.svg';
import partlycloudy from './partlycloudy.svg';
import cloudy from './cloudy.svg';
import lightsnow from './light-snow.svg';
import snow from './snow.svg';
import heavysnow from './heavy-snow.svg';
import lightrain from './light-rain.svg';
import rain from './rain.svg';
import heavyrain from './heavy-rain.svg';
import extremerain from './extreme-rain.svg';
import sleet from './sleet.svg';
import clearnight from './clear-night.svg';
import partlycloudynight from './partlycloudy-night.svg';

export const weatherIcons: Record<number, string> = {
	300: lightrain,
	301: lightrain,
	302: lightrain,
	310: lightrain,
	311: lightrain,
	312: lightrain,
	313: lightrain,
	314: lightrain,
	321: lightrain,
	500: lightrain,
	501: rain,
	502: heavyrain,
	503: heavyrain,
	504: extremerain,
	600: lightsnow,
	601: snow,
	602: heavysnow,
	611: sleet,
	620: lightsnow,
	621: snow,
	622: heavysnow,
	800: clear,
	801: partlycloudy,
	802: partlycloudy,
	803: cloudy,
	804: cloudy,
};

export const nightWeatherIcons: Record<number, string> = {
	300: lightrain,
	301: lightrain,
	302: lightrain,
	310: lightrain,
	311: lightrain,
	312: lightrain,
	313: lightrain,
	314: lightrain,
	321: lightrain,
	500: lightrain,
	501: rain,
	502: heavyrain,
	503: heavyrain,
	504: extremerain,
	600: lightsnow,
	601: snow,
	602: heavysnow,
	611: sleet,
	620: lightsnow, 
	621: snow,
	622: heavysnow,
	800: clearnight,
	802: partlycloudynight,
	801: partlycloudynight,
	803: cloudy,
	804: cloudy,
};
