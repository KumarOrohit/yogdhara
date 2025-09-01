import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Add auth token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (!config.headers["Content-Type"]) {
      config.headers["Content-Type"] = "application/json"; // fallback
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        // If already refreshing, add to queue
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');

        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Call refresh token API
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/account/op/refresh-token/`,
          {
            refresh_token: refreshToken,
            client_id: import.meta.env.VITE_CLIENT_ID,
            client_secret: import.meta.env.VITE_CLIENT_SECRET,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Store new tokens
        localStorage.setItem('auth_token', access_token);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }

        // Update authorization header
        apiClient.defaults.headers.Authorization = `Bearer ${access_token}`;
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Process queued requests
        processQueue(null, access_token);

        // Retry original request
        return apiClient(originalRequest);

      } catch (refreshError) {
        // Refresh failed - logout user
        processQueue(refreshError, null);
        logoutUser();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Logout function
const logoutUser = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  // Redirect to login page or perform other logout actions
  window.location.href = '/';
};

// // Optional: Add function to check token validity before requests
// export const checkTokenValidity = async (): Promise<boolean> => {
//   try {
//     await apiClient.get('/account/auth-check/');
//     return true;
//   } catch (error: any) {
//     if (error.response?.status === 401) {
//       return false;
//     }
//     throw error;
//   }
// };

// // Optional: Pre-request token check interceptor (if you want to check before each request)
// apiClient.interceptors.request.use(
//   async (config) => {
//     // Skip token check for auth endpoints to avoid infinite loops
//     if (config.url?.includes('/op/')) {
//       return config;
//     }

//     try {
//       await checkTokenValidity();
//     } catch (error: any) {
//       if (error.response?.status === 401) {
//         // Token is invalid, will be handled by response interceptor
//         console.log('Token is invalid, proceeding with request to trigger refresh');
//       }
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );