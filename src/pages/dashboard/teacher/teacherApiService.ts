import { apiClient } from "../../../services/apiService";

interface Certification {
  name: string;
  file: string;
  is_verified: boolean;
  certFile: File | null;
}

export default class TeacherApiService {

    static getBatchList = async () => {
        try{
            const response = await apiClient.get(`/teacher/batch/`);

            return {...response.data, status: response.status}
        } catch (error) {
            console.log("getBatchList error", error);
            return {};
        }
    }

    static getClassList = async () => {
        try{
            const response = await apiClient.get(`/batch/class/`);

            return {...response.data, status: response.status}
        } catch (error) {
            console.log("getClassList error", error);
            return {};
        }
    }

    static updateCreateBatch = async (batchData: FormData) => {
        try{
            const response = await apiClient.post("/batch/update-batch/", batchData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                });

            return {...response.data, status: response.status}
        } catch (error) {
            console.log("getClassList error", error);
            return {};
        }
    }

    static addCertificate = async (ceritificateData: FormData) => {
        try{
            const response = await apiClient.post("/teacher/add-certificate/", ceritificateData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                });

            return {...response.data, status: response.status}
        } catch (error) {
            console.log("addCertificate error", error);
            return {};
        }
    }

    static deleteCertificationService = async (ceritificateData: Certification) => {
        try{
            const response = await apiClient.post("/teacher/delete-certificate/", ceritificateData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                });

            return {...response.data, status: response.status}
        } catch (error) {
            console.log("addCertificate error", error);
            return {};
        }
    }

    static getMeetingToken = async () => {
        try{
            const response = await apiClient.get(`/batch/token/`);

            return {...response.data, status: response.status}
        } catch (error) {
            console.log("getClassList error", error);
            return {};
        }
    }
}