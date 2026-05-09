import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import "./App.css";
export default function App() {
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}