import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss';
import App from './App.tsx'

import { lightTheme } from "./theme";
import { applyTheme } from "./applyTheme";

applyTheme(lightTheme); // ✅ injects beige bg + theme colors

createRoot(document.getElementById('root')!).render(

    <App />

)
