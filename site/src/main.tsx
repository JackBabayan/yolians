import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router-dom"
import "@fontsource-variable/outfit"
import "@fontsource-variable/eb-garamond/wght.css"
import "./index.css"
import "./components/icons"
import App from "./App.tsx"
import { StoreProvider } from "./store.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <StoreProvider>
        <App />
      </StoreProvider>
    </BrowserRouter>
  </StrictMode>,
)
