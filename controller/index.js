import { handleMessage, sendMessage } from "./lib/telegram.js";

export async function handler(req) {
    const { body } = req;
    if (body) {
        const messageObj = body.message;
        await handleMessage(messageObj);
    }
    return;
}

export async function send(req) {
    const msg = req.body.msg
    if (msg) {
        sendMessage('YOUR_CHAT_ID', msg);
    }
    return;
}