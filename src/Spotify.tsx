import './Spotify.css';
import skip from './assets/skip-button.svg';
import spotify from './assets/spotify-logo.svg';
import pause from './assets/pause.svg';

//TODO do this idk if i ever wanna make a spotify one.
export default function Spotify() {

	
	return (
		<div className="spotify-widget">
			<div className="album-cover">Not implemented</div>
			<div className="album-info">
				<a>Track Name</a>
				<a>Album Name</a>
				<a>Artist Name</a>
				<div className="media-controls">
					<img className="media media--left" src={skip} />
					<img
						className="media media--pause"
						src={pause}
						// onClick={togglePlay}
					/>
					<img className="media media--right" src={skip} />
				</div>
				<img className="spotify-logo" src={spotify} />
			</div>
		</div>
	);
}
