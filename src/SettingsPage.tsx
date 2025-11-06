import { useState, useEffect } from 'react'
import './SettingsPage.css'
export default function SettingsPage() {
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
            <h1>Windgets Settings</h1>
            
            
        </div>
    )
}