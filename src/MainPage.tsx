import { useState, useEffect } from 'react'
import './MainPage.css'
export default function MainPage() {
    type UserSettings = {
        location: string,
        units: "imperial" | "metric"
    }
    const [settings, setSettings] = useState<UserSettings>(
        {
            location: "Boston",
            units: "imperial"
        }
    )
    
    useEffect(() => {
        const saved = localStorage.getItem("userSettings");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setSettings(parsed);
                console.log("Loaded user settings", parsed);
            } catch (error) {
                console.log("Error parsing user settings", error);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("userSettings", JSON.stringify(settings));
    }, [settings]);

    return (
        <div className="mainpage">
            <h1>Windgets</h1>
            <ul>
                <li>TIME WIDGET</li>
                <li>WEATHER WIDGET</li>
            </ul>
        </div>
    )
}