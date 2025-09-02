import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    authToken: string | null;
    isAuthenticated: boolean;
    login: (token: string, refresh_token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [authToken, setAuthToken] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for existing token on mount
        const token = localStorage.getItem('auth_token');
        if (token) {
            setAuthToken(token);
            window.dispatchEvent(new Event('localStorageAccesChange'));
        }
    }, []);

    const login = (token: string, refresh_token: string) => {
        setAuthToken(token);
        localStorage.setItem('auth_token', token);
        localStorage.setItem("refresh_token", refresh_token);
        window.dispatchEvent(new Event('localStorageAccesChange'));
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{
            authToken,
            isAuthenticated: !!authToken,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};