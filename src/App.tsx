import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import Weather from "./Weather";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mainpage" element={<MainPage />} />
        <Route path="/" element={<Weather />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
