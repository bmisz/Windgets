import './SettingsPage.css';
import { useState, useEffect, useRef } from 'react';
import { load } from '@tauri-apps/plugin-store';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';

export default function WindowSelect({
	updateWindowPosition,
}: {
	updateWindowPosition: () => Promise<void>;
}) {
	const [selectedWindows, setSelectedWindows] = useState<string[]>([]);
	const [isInitialized, setIsInitialized] = useState(false);

	interface WidgetParameter {
		url: string;
		label: string;
		title: string;
		width: number;
		height: number;
		transparent: boolean;
	}

	const windowParameters: WidgetParameter[] = [];

	const weatherWidgetParameters: WidgetParameter = {
		label: 'weather',
		url: '/weather',
		title: 'Weather',
		width: 400,
		height: 180,
		transparent: true,
	};
	windowParameters.push(weatherWidgetParameters);

	const spotifyWidgetParameters: WidgetParameter = {
		label: 'spotify',
		url: '/spotify',
		title: 'Spotify',
		width: 400,
		height: 180,
		transparent: true,
	};
	windowParameters.push(spotifyWidgetParameters);
	// add other widget params so indexes match checkboxes...

	// Track labels currently being created to prevent duplicates
	const creating = useRef<Set<string>>(new Set());

	useEffect(() => {
		const loadSavedWindows = async () => {
			try {
				const store = await load('settings.json');
				const val = await store.get<string[]>('selectedWindows');
				if (val) {
					setSelectedWindows(val);
				}
				setIsInitialized(true);
			} catch (error) {
				console.error('Failed to load settings:', error);
			}
		};

		loadSavedWindows();
	}, []);

	// Persist selectedWindows and sync actual windows
	useEffect(() => {
		if (!isInitialized) return;

		console.log('Running selectedWindows useEffect');
		(async () => {
			const store = await load('settings.json');
			await store.set('selectedWindows', selectedWindows);
			const windowsSelected = await store.get('selectedWindows');
			console.log(windowsSelected);
			await store.save();
			console.log('Store saved selectedWindows');
		})();

		(async () => {
			for (const windowId of selectedWindows) {
				const widgetIndex = parseInt(windowId, 10);
				const params = windowParameters[widgetIndex];
				if (!params) {
					console.warn(
						`No parameters for widget index ${widgetIndex}`
					);
					continue;
				}

				// Prevent duplicate creation
				if (creating.current.has(params.label)) {
					console.log(`Skipping '${params.label}', already creating`);
					continue;
				}
				creating.current.add(params.label);

				try {
					// check if a webview with this label already exists
					const existing = await WebviewWindow.getByLabel(
						params.label
					);
					if (!existing) {
						await createNewWidget(params);
					} else {
						console.log(`Window '${params.label}' already exists`);
					}
				} catch (err) {
					console.error('Error creating window', err);
				} finally {
					creating.current.delete(params.label);
				}
			}
		})();
	}, [selectedWindows]);

	async function handleSelect(id: number, label: string) {
		const idStr = id.toString();

		setSelectedWindows((prev) => {
			if (prev.includes(idStr)) {
				(async () => {
					try {
						const win = await WebviewWindow.getByLabel(label);
						await win?.close();
					} catch (error) {
						console.log('Error closing window', error);
					}
				})();
				return prev.filter((win) => win !== idStr);
			} else {
				return [...prev, idStr];
			}
		});
	}

	async function createNewWidget(WidgetParameters: WidgetParameter) {
		// double-check before creating
		try {
			const existing = await WebviewWindow.getByLabel(
				WidgetParameters.label
			);
			if (existing) return existing;
		} catch {
			// not found — safe to create
		}

		const webview = new WebviewWindow(WidgetParameters.label, {
			url: WidgetParameters.url,
			title: WidgetParameters.title,
			width: WidgetParameters.width,
			height: WidgetParameters.height,
			resizable: false,
			decorations: false,
			focusable: false,
			transparent: WidgetParameters.transparent,
			alwaysOnBottom: true,
			skipTaskbar: true,
		});

		await new Promise<void>((resolve, reject) => {
			webview.once('tauri://created', () => {
				updateWindowPosition();
				console.log(
					`Window '${WidgetParameters.label}' created successfully`
				);
				resolve();
			});

			webview.once('tauri://error', (e) => {
				console.error(
					`Error creating window '${WidgetParameters.label}':`,
					e
				);
				reject(e);
			});
		});

		return webview;
	}

	return (
		<div>
			<a>Widget Select:</a>
			<ul className="widget-select-list">
				<li>
					<input
						type="checkbox"
						checked={selectedWindows.includes('0')}
						onChange={() => handleSelect(0, 'weather')}
					/>
					<label>Weather</label>
				</li>
				<li>
					<input
						type="checkbox"
						checked={selectedWindows.includes('1')}
						onChange={() => handleSelect(1, 'spotify')}
					/>
					<label>Spotify</label>
				</li>
			</ul>
		</div>
	);
}
