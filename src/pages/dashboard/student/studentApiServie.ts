import { apiClient } from "../../../services/apiService";


export default class StudentApiService {

    static getAnalytics = async () => {
        try {
            const response = await apiClient.get(`/student/analytics/`);

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("getAnalytics error", error);
            return {};
        }
    };

    static getEnrolledBatches = async () => {
        try {
            const response = await apiClient.get(`/student/batch/`);

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("getEnrolledBatches error", error);
            return {};
        }
    };

    static getStoreBatches = async () => {
        try {
            const response = await apiClient.get(`/student/store/`);

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("getStoreBatches error", error);
            return {};
        }
    };

    static updateStudentProfile = async (formData: FormData) => {
        try {
            const response = await apiClient.post(`/student/profile-update/`, formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                });

            return { ...response.data, status: response.status }
        } catch (error) {
            console.log("updateStudentProfile error", error);
            return {};
        }
    }
}