import axios from "axios";

async function printPrice() {
    try {
        const symbols = `["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","AVAXUSDT"]`
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbols=${symbols}`);
        const data = response.data;
        var str = ""
        data.forEach(entry => {
            const symbol = entry.symbol;
            const price = entry.price;
            str += `Symbol: ${symbol}, Price: ${parseFloat(price).toFixed(2)} \n`;
        });
        return str;
    } catch (error) {
        return `Erro => ${error.message}`;
    }
}
async function getPrice() {
    try {
        const symbols = `["BTCUSDT","ETHUSDT","SOLUSDT","BNBUSDT","AVAXUSDT"]`
        const response = await axios.get(`https://api.binance.com/api/v3/ticker/price?symbols=${symbols}`);
        return response.data;
    } catch (error) {
        return [];
    }
}

export async function getBinancePrice() {
    return await getPrice();
}
export async function printBinancePrice() {
    return await printPrice();
}