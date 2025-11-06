import { useState, useEffect } from 'react';
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
			// only run after settings is loaded
			localStorage.setItem('userSettings', JSON.stringify(settings));
			console.log('Changed user settings', settings);
		}
	}, [settings]);

	function handleLocationChange() {
		//TODO get users location
	}

	return (
		<div className="mainpage">
			<h3>Windgets Settings</h3>
			<a>Enter City:</a>
			<input
				type="text"
				value={settings?.location ?? ''}
				onChange={(e) =>
					setSettings({
						location: e.target.value,
						units: settings?.units ?? 'imperial',
					})
				}
			/>
			<a className="example">Format:</a>
			<a className="example">Boston, US</a>
			<a className="example">Boston, MA, US</a>

			<a>Window Position</a>
			<div className="win-setting">
				<a>X: </a>
				<input className='slider' type="range" min={0} max={100} step={1}></input>
				<a>PLACEHOLDER</a>
			</div>
			<div className="win-setting">
				<a>Y: </a>
				<input className='slider' type="range" min={0} max={100} step={1}></input>
				<a>PLACEHOLDER</a>
			</div>
		</div>
	);
}
