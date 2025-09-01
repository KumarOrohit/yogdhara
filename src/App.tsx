import { BrowserRouter } from 'react-router-dom'
import './App.css'
import AppRoutes from './router'
import { ThemeProvider } from "@mui/material/styles";
import { lightTheme } from './theme';
import { AuthProvider } from './context/authContext';
import { ProfileDataProvider } from './context/profileDataContext';

function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserRouter>
        <AuthProvider>
          <ProfileDataProvider>
            <AppRoutes />
          </ProfileDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
