import { useState, useEffect } from 'react';
import { LogicalPosition } from '@tauri-apps/api/window';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import './SettingsPage.css';

export default function SettingsPage() {
	type UserSettings = {
		location: string;
		units: 'imperial' | 'metric';
		x: number;
		y: number;
	};
	const [settings, setSettings] = useState<UserSettings>();

	useEffect(() => {
		const saved = localStorage.getItem('userSettings');
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				setSettings(parsed);
				console.log('Loaded user settings', parsed);
			} catch {
				console.log('Error parsing user settings');
				const defaultSettings: UserSettings = {
					location: 'Boston',
					units: 'imperial',
					x: 0,
					y: 0,
				};
				setSettings(defaultSettings);
				localStorage.setItem(
					'userSettings',
					JSON.stringify(defaultSettings)
				);
			}
		} else {
			const defaultSettings: UserSettings = {
				location: 'Boston',
				units: 'imperial',
				x: 0,
				y: 0,
			};
			setSettings(defaultSettings);
			localStorage.setItem(
				'userSettings',
				JSON.stringify(defaultSettings)
			);
			console.log('Created user settings');
		}
	}, []);

	useEffect(() => {
		if (settings) {
			localStorage.setItem('userSettings', JSON.stringify(settings));
			updateWindowPosition();
		}
	}, [settings]);

	async function updateWindowPosition() {
		let win = await WebviewWindow.getByLabel('weather');
		let realX = (screen.width * (settings?.x ?? 0)) / 100;
		let realY = (screen.height * (settings?.y ?? 0)) / 100;
		console.log("real x and y: ", realX, realY);
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
				onChange={(e) => //TODO get widget to auto update on settigns change
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
			 {/* FIXME Weird visual bug where slider is in the middle on reopen of settings regardless of position. */}
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
						updateWindowPosition();
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
						updateWindowPosition();
					}}
				/>
				<a>{settings?.y ?? 0}%</a>
			</div>
		</div>
	);
}
