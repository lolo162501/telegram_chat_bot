import axios from "axios";

const TOKEN = "YOUR_TELEGRAM_BOT_TOKEN";
const BASE_URL = `https://api.telegram.org/bot${TOKEN}`;
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