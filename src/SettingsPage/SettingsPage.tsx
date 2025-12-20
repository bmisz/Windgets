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

export default function SettingsPage() {
	const defaultSettings: UserSettings = {
		location: 'Boston',
		units: 'imperial',
		x: 100,
		y: 100,
	};
	const [settings, setSettings] = useState<UserSettings>(defaultSettings);
	const [isInitialized, setIsInitialized] = useState(false);

	useEffect(() => {
		const loadSettings = async () => {
			const store = await load('settings.json');
			const val = await store.get<UserSettings>('userSettings');
			if (val) {
				setSettings(val);
			} else {
				console.log('No settings found, initializing defaults.');

				await store.set('userSettings', defaultSettings);
				await store.save();
			}
			setIsInitialized(true);
		};
		loadSettings();
	}, []);

	useEffect(() => {
		if (!isInitialized) return;

		const saveSettings = async () => {
			const store = await load('settings.json');
			await store.set('userSettings', settings);
			await store.save();
			console.log('Settings saved to disk');
			updateWindowPosition();
		};

		saveSettings();
	}, [settings, isInitialized]);

	const updateWindowPosition = useCallback(async () => {
		let win = await WebviewWindow.getByLabel('weather');
		if ((settings?.x ?? 0) === 0) {
			console.log('X is 0');
		}
		let realX = (screen.width * (settings?.x ?? 0)) / 100;
		let realY = (screen.height * (settings?.y ?? 0)) / 100;
		console.log('real x and y: ', realX, realY);
		win?.setPosition(new LogicalPosition(realX, realY)).catch((error) =>
			console.log(error)
		);
	}, [settings?.x, settings?.y]);

	return (
		<div className="mainpage">
			<h3>Windgets Settings</h3>
			<a>Enter City:</a>
			<input
				type="text"
				value={settings?.location ?? ''}
				onChange={(e) => {
					const newVal = e.target.value;
					setSettings((prev) => ({
						...prev,
						location: newVal,
					}));
				}}
			/>
			<a className="example">Format:</a>
			<a className="example">Boston, US</a>
			<a className="example">Boston, MA, US</a>

			<a>Window Position</a>
			<WindowSliders settings={settings} setSettings={setSettings} />
			<WindowSelect updateWindowPosition={updateWindowPosition} />
		</div>
	);
}
