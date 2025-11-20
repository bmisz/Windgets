import './Spotify.css';
import skip from './assets/skip-button.svg';
import spotify from './assets/spotify-logo.svg';
import pause from './assets/pause.svg';
import { useEffect, useRef } from 'react';
export default function Spotify() {
	const playerRef = useRef<any>(null);
	//FIXME I dont actually need any of this i was using sdk instead of web api
	function addSpotifyListeners(player: any) {
		// Ready
		player.addListener('ready', ({ device_id }: { device_id: string }) => {
			console.log('Ready with Device ID', device_id);
		});

		// Not Ready
		player.addListener(
			'not_ready',
			({ device_id }: { device_id: string }) => {
				console.log('Device ID has gone offline', device_id);
			}
		);
		player.addListener(
			'initialization_error',
			({ message }: { message: any }) => {
				console.error(message);
			}
		);

		player.addListener(
			'authentication_error',
			({ message }: { message: any }) => {
				console.error(message);
			}
		);

		player.addListener('account_error', ({ message }: { message: any }) => {
			console.error(message);
		});
	}
	useEffect(() => {
		console.log('mount');
		(window as any).onSpotifyWebPlaybackSDKReady = () => {
			console.log('Spotify SDK is ready');
			const token = `${import.meta.env.VITE_SPOTIFY_ACCESS_TOKEN}`;

			if (!token) {
				console.error('No Spotify token found');
				return;
			}

			const player = new (window as any).Spotify.Player({
				name: 'Web Playback SDK Quick Start Player',
				getOAuthToken: (cb: any) => {
					cb(token);
				},
				volume: 0.5,
			});

			playerRef.current = player;
			addSpotifyListeners(player);

			player.connect().then((success: boolean) => {
				if (success) {
					console.log('Player connected successfully');
				} else {
					console.error('Player connection failed');
				}
			});
		};

		// Check if SDK already loaded
		if ((window as any).Spotify) {
			console.log('Spotify SDK already loaded, initializing...');
			(window as any).onSpotifyWebPlaybackSDKReady();
		}

		return () => {
			if (playerRef.current) {
				playerRef.current.disconnect();
			}
		};
	}, []);

	function togglePlay() {
		if (playerRef.current) {
			playerRef.current.togglePlay();
			console.log('Toggle play clicked.');
		} else {
			console.log('Player not initialized.');
		}
	}

	return (
		<div className="spotify-widget">
			<div className="album-cover">Album Cover</div>
			<div className="album-info">
				<a>Track Name</a>
				<a>Album Name</a>
				<a>Artist Name</a>
				<div className="media-controls">
					<img className="media media--left" src={skip} />
					<img
						className="media media--pause"
						src={pause}
						onClick={togglePlay}
					/>
					<img className="media media--right" src={skip} />
				</div>
				<img className="spotify-logo" src={spotify} />
			</div>
		</div>
	);
}
