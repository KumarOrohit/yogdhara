import { apiClient } from "../../services/apiService";

interface SupportFormData {
  email: string;
  query: string;
  priority: 'low' | 'medium' | 'high';
}

export default class HomeApiService {

    static getLevelList = async () => {
        try {
            const response = await apiClient.get(`/batch/op/level/`);

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("getLevelList error", error);
            return {};
        }
    }

    static getLearningList = async () => {
        try {
            const response = await apiClient.get(`/batch/op/learning/`);

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("getLearningList error", error);
            return {};
        }
    }

    static getBatchList = async () => {
        try {
            const response = await apiClient.get(`/batch/op/`);

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("getBatchList error", error);
            return {};
        }
    }

    static getInstructorList = async () => {
        try {
            const response = await apiClient.get(`/teacher/op/`);

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("getInstructorList error", error);
            return {};
        }
    }

    static getOtpService = async (email: string, userType: string | null) => {
        try {
            const response = await apiClient.post(`/account/op/get-otp/`, {
                "email": email,
                "user_type": userType
            });

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("getOtpService error", error);
            return {};
        }
    }

    static verifyOtpService = async (email: string, otp: string) => {
        try {
            const response = await apiClient.post(`/account/op/verify-otp/`, {
                "username": email,
                "password": otp,
                "client_id": import.meta.env.VITE_CLIENT_ID,
                "client_secret": import.meta.env.VITE_CLIENT_SECRET,
                "grant_type": "password"
            });

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("getOtpService error", error);
            return {};
        }
    }

    static getUserBasicInfoService = async () => {
        try {
            const response = await apiClient.get(`/account/basic-info/`);

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("getUserBasicInfoService error", error);
            return {};
        }
    }

    static updateUserProfileService = async (formData: FormData) => {
        try {
            const response = await apiClient.post("/teacher/update-Profile/", formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                }
            );
            return { ...response.data, status: response.status }

        } catch (error) {
            console.log("updateUserProfileService error", error);
            return {};
        }

    }

    static sendCustomerSupportQuery = async (formData: SupportFormData) => {
        try {
            const response = await apiClient.post("/account/op/customer-support/", formData);
            return { ...response.data, status: response.status }

        } catch (error) {
            console.log("updateUserProfileService error", error);
            return {};
        }

    }
}