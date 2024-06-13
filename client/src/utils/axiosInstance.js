import axios from "axios";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode"

import { baseUrl } from "./baseUrl";


const setAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
});

const axiosInstance = axios.create({
    baseURL: baseUrl,
    headers: setAuthHeader(),
});

axiosInstance.interceptors.request.use(async (req) => {
  
    req.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;

    const checkRefreshToken = jwtDecode(localStorage.getItem('refreshToken'))
    const isExpiredRefreshToken = dayjs().isAfter(dayjs.unix(checkRefreshToken.exp)); // Check if token is expired

    if(isExpiredRefreshToken){
        throw new Error('Refresh token expired');
    }

    const user = jwtDecode(localStorage.getItem('accessToken'));
    const isExpired = dayjs().isAfter(dayjs.unix(user.exp)); // Check if token is expired

    if (isExpired) {
        try {
            const response = await axios.post(`${baseUrl}/token/refresh`, {
                refresh: localStorage.getItem('refreshToken'),
            });

            localStorage.removeItem('accessToken')

            localStorage.setItem('accessToken', response.data.accessToken)

            req.headers.Authorization = `Bearer ${response.data.accessToken}`;

        } catch (error) {
            console.error("Token refresh failed:", error.message);
            // Optionally, you can throw an error here to handle it elsewhere
        }
    }

    return req;
});

export default axiosInstance;
