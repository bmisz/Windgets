import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Weather from "./Weather";
import SettingsPage from "./SettingsPage/SettingsPage";
import Redirect from "./Redirect";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SettingsPage />} />
        <Route path="/weather" element={<Weather />} />
        <Route path='/redirect' element={<Redirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
