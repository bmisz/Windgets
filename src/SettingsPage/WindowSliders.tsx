import { Dispatch, SetStateAction } from "react";
import type { UserSettings } from "./SettingsPage";
import "./WindowSliders.css";

type WindowSliderProps = {
    settings: UserSettings;
    setSettings: Dispatch<SetStateAction<UserSettings>>;
}

export default function WindowSliders({ settings, setSettings }: WindowSliderProps) {
    return (
        <div>
            <div className="win-setting">
				<a>X: </a>
				<input
					id="xSlider"
					className="slider"
					type="range"
					min={0}
					max={100}
					step={1}
					value={settings?.x}
					onChange={(e) => {
						const newVal = Number(e.target.value);
						setSettings((prev) => ({
							...prev,
							x: newVal,
						}));
					}}
				/>
				<a>{settings?.x ?? 0}%</a>
			</div>
			<div className="win-setting">
				<a>Y: </a>
				<input
					id="ySlider"
					className="slider"
					type="range"
					min={0}
					max={100}
					step={1}
					value={settings?.y}
					onChange={(e) => {
						const newVal = Number(e.target.value);
						setSettings((prev) => ({
							...prev,
							y: newVal,
						}));
					}}
				/>
				<a>{settings?.y ?? 0}%</a>
			</div>
        </div>
    );
}