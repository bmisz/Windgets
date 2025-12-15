import { useState, useEffect } from 'react';
import { LogicalPosition,  } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { load } from '@tauri-apps/plugin-store'; //TODO Implement this bitch
import './SettingsPage.css';
import WindowSelect from './WindowSelect';


export default function SettingsPage() {
	type UserSettings = {
		location: string;
		units: 'imperial' | 'metric';
		x: number;
		y: number;
	};
	const [settings, setSettings] = useState<UserSettings>(() => {
		const saved = localStorage.getItem('userSettings');
		if (saved) {
			try {
				console.log('settings loaded');
				return JSON.parse(saved);
			} catch {
				console.error('failed to load settings');
				return { location: 'Boston', units: 'imperial', x: 0, y: 0 };
			}
		}
		console.log('no settings found');
		return { location: 'Boston', units: 'imperial', x: 0, y: 0 };
	});

	useEffect(() => {
		if (settings) {
			localStorage.setItem('userSettings', JSON.stringify(settings));
			console.log('settings updated');
			updateWindowPosition();
		}
	}, [settings]);

	async function updateWindowPosition() {
		let win = await WebviewWindow.getByLabel('weather');
		let realX = (screen.width * (settings?.x ?? 0)) / 100;
		let realY = (screen.height * (settings?.y ?? 0)) / 100;
		console.log('real x and y: ', realX, realY);
		win?.setPosition(new LogicalPosition(realX, realY)).catch((error) =>
			console.log(error)
		);
	}


	return (
		<div className="mainpage">
			<h3>Windgets Settings</h3>
			<a>Enter City:</a>
			<input
				type="text"
				value={settings?.location ?? ''}
				onChange={(
					e //TODO get widget to auto update on settigns change
				) =>
					
					setSettings({
						location: e.target.value,
						units: settings?.units ?? 'imperial',
						x: settings?.x ?? 0,
						y: settings?.y ?? 0,
					})
				}
			/>
			<a className="example">Format:</a>
			<a className="example">Boston, US</a>
			<a className="example">Boston, MA, US</a>

			<a>Window Position</a>
			<div className="win-setting">
				<a>X: </a>
				<input
					id="xSlider"
					className="slider"
					type="range"
					min={0}
					max={100}
					step={1}
					value={settings?.x ?? 0}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setSettings({
							location: settings?.location ?? '',
							units: settings?.units ?? 'imperial',
							x: Number(e.target.value),
							y: settings?.y ?? 0,
						});
					}}
				/>
				<a>{settings?.x ?? 0}%</a>
			</div>
			<div className="win-setting">
				<a>Y: </a>
				<input
					className="slider"
					type="range"
					min={0}
					max={100}
					step={1}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setSettings({
							location: settings?.location ?? '',
							units: settings?.units ?? 'imperial',
							x: settings?.x ?? 0,
							y: Number(e.target.value),
						});
					}}
				/>
				<a>{settings?.y ?? 0}%</a>
			</div>
			<WindowSelect updateWindowPosition={updateWindowPosition}/>
		</div>
	);
}


