import { getAxiosInstance } from "./axios.js";
import { printBinancePrice, getBinancePrice } from "../../api/binance.js";
import { printMaxPrice, getMaxPrice } from "../../api/max.js";
import { sendLLM } from "../../api/llm.js";
const binanceTargets = [];
const maxTargets = [];
let binanceTimer;
let maxTimer;

export async function handleMessage(messageObj) {
    if (typeof messageObj !== 'undefined') {
        const message = String(messageObj.text || "");
        if (message.charAt(0) === "/") {
            const command = message.substring(1);
            switch (command) {
                case "start":
                    return sendMessage(messageObj.chat.id, "Hi~ I'm a chat bot. Can I help you?");
                case "binance":
                    const b = await printBinancePrice() || "binance api empty";
                    return sendMessage(messageObj.chat.id, b);
                case "max":
                    const m = await printMaxPrice() || "max api empty";
                    return sendMessage(messageObj.chat.id, m);
                default:
                    return sendMessage(messageObj.chat.id, "Sorry, I don't understand.");
            }
        } else {
            try {
                const r = await sendLLM(message);
                return sendMessage(messageObj.chat.id, r);
            } catch (error) {
                return sendMessage(messageObj.chat.id, error);
            }
        }
    }
}

export function sendMessage(chatId, message) {
    console.log('sendMessage => ', chatId, message);
    const [symbol, price] = message.split('_');
    if (symbol && price && !isNaN(parseFloat(price)) && /^\d+$/.test(price)) {
        if (symbol.includes('TWD')) {
            startMaxMonitoring(chatId, message);
        } else {
            startBinanceMonitoring(chatId, message);
        }
    } else {
        sendNotification(chatId, message);
    }
}

async function startMaxMonitoring(chatId, message) {
    if (!maxTimer) {
        maxTimer = setInterval(async () => {
            const maxs = await getMaxPrice();
            maxTargets.forEach(it => {
                const item = maxs[symbol.toLowerCase()];
                if (item) {
                    if (it.direct === 'up' && item.last >= it.price) { // 高於目標價
                        sendNotification(chatId, `MAX到價通知: ${it.symbol} 高於 ${it.price}, 現價: ${parseFloat(item.last).toFixed(2)}`);
                        const indexToRemove = maxTargets.indexOf(it);
                        if (indexToRemove !== -1) {
                            maxTargets.splice(indexToRemove, 1);
                        }
                    } else if (it.direct === 'down' && item.last <= it.price) { // 低於目標價
                        sendNotification(chatId, `MAX到價通知: ${it.symbol} 低於 ${it.price}, 現價: ${parseFloat(item.last).toFixed(2)}`);
                        const indexToRemove = maxTargets.indexOf(it);
                        if (indexToRemove !== -1) {
                            maxTargets.splice(indexToRemove, 1);
                        }
                    }
                }
            })
        }, 800);
    }
    const [symbol, price] = message.split('_');
    if (!maxTargets.find(it => it.uuid === `${symbol}_${price}`)) {
        const maxs = await getMaxPrice();
        const item = maxs[symbol.toLowerCase()];
        if (item) {
            maxTargets.push({
                uuid: `${symbol}_${price}`,
                symbol: symbol,
                price: price,
                direct: item.last <= price ? 'up' : 'down'
            });
            sendNotification(chatId, '已新增到價通知');
        }
    } else {
        sendNotification(chatId, '已有的到價通知');
    }
}

async function startBinanceMonitoring(chatId, message) {
    if (!binanceTimer) {
        binanceTimer = setInterval(async () => {
            const binances = await getBinancePrice();
            binanceTargets.forEach(it => {
                const item = binances.find(item => item.symbol === it.symbol);
                if (item) {
                    if (it.direct === 'up' && item.price >= it.price) { // 高於目標價
                        sendNotification(chatId, `幣安到價通知: ${it.symbol} 高於 ${it.price}, 現價: ${parseFloat(item.price).toFixed(2)}`);
                        const indexToRemove = binanceTargets.indexOf(it);
                        if (indexToRemove !== -1) {
                            binanceTargets.splice(indexToRemove, 1);
                        }
                    } else if (it.direct === 'down' && item.price <= it.price) { // 低於目標價
                        sendNotification(chatId, `幣安到價通知: ${it.symbol} 低於 ${it.price}, 現價: ${parseFloat(item.price).toFixed(2)}`);
                        const indexToRemove = binanceTargets.indexOf(it);
                        if (indexToRemove !== -1) {
                            binanceTargets.splice(indexToRemove, 1);
                        }
                    }
                }
            })
        }, 800);
    }
    const [symbol, price] = message.split('_');
    if (!binanceTargets.find(it => it.uuid === `${symbol}_${price}`)) {
        const binances = await getBinancePrice();
        const item = binances.find(item => item.symbol === symbol);
        if (item) {
            binanceTargets.push({
                uuid: `${symbol}_${price}`,
                symbol: symbol,
                price: price,
                direct: item.price <= price ? 'up' : 'down'
            });
            sendNotification(chatId, '已新增到價通知');
        }
    } else {
        sendNotification(chatId, '已有的到價通知');
    }
}

function sendNotification(chatId, message) {
    return getAxiosInstance().get("sendMessage", {
        chat_id: chatId,
        text: message,
    });
}