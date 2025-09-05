import { apiClient } from "../../services/apiService";


export default class PaymentApiService {

    static createCheckoutSession = async (batchId: string, price: Number) => {
        try{
            const response = await apiClient.post(`/enrollment/create-checkout-session/`,
                {
                    "batch_id": batchId,
                    "amount": price
                }
            );

            return {...response.data, status: response.status}
        } catch (error) {
            console.log("getLevelList error", error);
            return {};
        }
    }

    static confirmPayment = async (paymentId: string) => {
        try{
            const response = await apiClient.post(`/enrollment/payment-success/`,
                {
                    "payment_id": paymentId
                }
            );

            return {...response.data, status: response.status}
        } catch (error) {
            console.log("getLevelList error", error);
            return {};
        }
    }

    static enrollForFreeTrial = async (batchId: string) => {
        try{
            const response = await apiClient.post(`/enrollment/free-trial-enrollment/`,
                {
                    "batch_id": batchId
                }
            );

            return {...response.data, status: response.status}
        } catch (error) {
            console.log("getLevelList error", error);
            return {};
        }
    }
}