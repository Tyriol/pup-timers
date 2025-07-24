import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DogsProvider } from "./context/Providers/Dogs/DogsContextProvider.tsx";
import { TimersProvider } from "./context/Providers/Timers/TimersContextProvider.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DogsProvider>
      <TimersProvider>
        <App />
      </TimersProvider>
    </DogsProvider>
  </StrictMode>,
);
