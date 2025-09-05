import "./global.css";
import { createRoot } from "react-dom/client";
import "./polyfills/resizeObserverErrorFix";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
