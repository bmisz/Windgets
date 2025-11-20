import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Weather from "./Weather";
import SettingsPage from "./SettingsPage/SettingsPage";
import Redirect from "./Redirect";
import Spotify from "./Spotify";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SettingsPage />} />
        <Route path="/weather" element={<Weather />} />
        <Route path='/redirect' element={<Redirect />} />
        <Route path="/spotify" element={<Spotify />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
