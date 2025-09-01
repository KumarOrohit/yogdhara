import { apiClient } from "../../../../services/apiService";

export default class AnalyticsApiService {

    static getAnalyticsService = async () => {
        try{
            const response = await apiClient.get(`/teacher/analytics/`);

            return {...response.data, status: response.status}
        } catch (error) {
            console.log("getAnalyticsService error", error);
            return {};
        }
    }
}