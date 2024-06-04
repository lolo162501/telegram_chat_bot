import { config } from 'dotenv';
import axios from "axios";
config();

const BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}`;
export function getAxiosInstance() {
    return {
        get(method, params) {
            return axios.get(`/${method}`, {
                baseURL: BASE_URL,
                params,
            });
        },
        post(method, data) {
            return axios({
                method: "post",
                baseURL: BASE_URL,
                url: `/${method}`,
                data
            });
        },
    };
}