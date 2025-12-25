import { useState, useEffect, useCallback } from 'react';
import { LogicalPosition } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { load } from '@tauri-apps/plugin-store';
import WindowSelect from './WindowSelect';
import WindowSliders from './WindowSliders';

export type UserSettings = {
	location: string;
	units: 'imperial' | 'metric';
	x: number;
	y: number;
};
// TODO, clean up the 1 Million console.logs in this function.
export default function SettingsPage() {
	const defaultSettings: UserSettings = {
		location: 'Boston',
		units: 'imperial',
		x: 100,
		y: 100,
	};
	const [weatherSettings, setWeatherSettings] =
		useState<UserSettings>(defaultSettings);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		const loadSettings = async () => {
			const store = await load('settings.json');
			const val = await store.get<UserSettings>('userSettings');
			if (val) {
				setWeatherSettings(val);
			} else {
				console.log('No weatherSettings found, initializing defaults.');

				await store.set('userSettings', defaultSettings);
				await store.save();
			}
			setIsInitialized(true);
		};
		loadSettings();
		console.log(weatherSettings);
	}, []);

	useEffect(() => {
		if (!isInitialized) return;

		const saveSettings = async () => {
			const store = await load('settings.json');
			await store.set('userSettings', weatherSettings);
			await store.save();
			updateWindowPosition(weatherSettings);
		};

		saveSettings();
	}, [weatherSettings, isInitialized]);

	const updateWindowPosition = useCallback(
		async (settings: UserSettings) => {
			let win = await WebviewWindow.getByLabel('weather');
			if ((settings?.x ?? 0) === 0) {
				console.log('X is 0');
			}
			let realX = (screen.width * (settings?.x ?? 0)) / 100;
			let realY = (screen.height * (settings?.y ?? 0)) / 100;
			win?.setPosition(new LogicalPosition(realX, realY)).catch((error) =>
				console.log(error)
			);
		},
		[weatherSettings?.x, weatherSettings?.y]
	);

	return (
		<div className="mainpage">
			<h3>Windgets Settings</h3>
			<a>Enter City:</a>
			<input
				type="text"
				value={weatherSettings?.location ?? ''}
				onChange={(e) => {
					const newVal = e.target.value;
					setWeatherSettings((prev) => ({
						...prev,
						location: newVal,
					}));
				}}
			/>
			<a className="example">Format:</a>
			<a className="example">Boston, US</a>
			<a className="example">Boston, MA, US</a>

			<WindowSelect
				updateWindowPosition={() =>
					updateWindowPosition(weatherSettings)
				}
			/>
			<WindowSliders
				settings={weatherSettings}
				setSettings={setWeatherSettings}
			/>
		</div>
	);
}
