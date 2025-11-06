import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Weather from "./Weather";
import SettingsPage from "./SettingsPage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/" element={<Weather />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
