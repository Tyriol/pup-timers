import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DogsProvider } from "./context/Providers/Dogs/DogsContextProvider.tsx";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DogsProvider>
      <App />
    </DogsProvider>
  </StrictMode>,
);
