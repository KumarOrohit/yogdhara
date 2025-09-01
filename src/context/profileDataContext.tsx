'use client';

import { createContext, useContext, useEffect, useState } from "react";
import HomeApiService from "../pages/home/homeService";
import { useAuth } from "./authContext";

type ProfileDataContextType = {
    name: string | undefined;
    userType: string | undefined;
    email: string | undefined;
    profileImage: string | undefined;
}

const ProfileDataContext = createContext<ProfileDataContextType | undefined>(undefined);

export const ProfileDataProvider = ({ children }: { children: React.ReactNode }) => {
    const { authToken } = useAuth();
    const [name, setName] = useState(undefined);
    const [userType, setUserType] = useState(undefined);
    const [email, setEmail] = useState(undefined);
    const [profileImage, setProfileImage] = useState(undefined);

    useEffect(() => {
        const handleAccessTokenChange = async () => {
            if (!email && authToken) {
                const response = await HomeApiService.getUserBasicInfoService();
                setEmail(response.email);
                setName(response.name);
                setProfileImage(response.profile_image);
                setUserType(response.user_type);
            }
        }

        window.addEventListener('localStorageAccesChange', handleAccessTokenChange);

        if (authToken) {
            handleAccessTokenChange();
        }

        return () => {
            window.removeEventListener('localStorageAccesChange', handleAccessTokenChange)
        }
    }, [authToken])

    return (
        <ProfileDataContext.Provider value={{ name, userType, email, profileImage }}>
            {children}
        </ProfileDataContext.Provider>
    );
};

export const useProfileData = () => {
    const context = useContext(ProfileDataContext);
    if (!context) throw new Error('useProfileData must be used within an ProfileDataProvider');
    return context
}