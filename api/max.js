import axios from 'axios';

export async function getMaxPrice() {
    const apiUrl = 'https://max-api.maicoin.com/api/v2/summary';
    try {
        const response = await axios.get(apiUrl);
        const parsedData = response.data;
        return parsedData.tickers;
    } catch (error) {
        return {};
    }
}

export async function printMaxPrice() {
    const apiUrl = 'https://max-api.maicoin.com/api/v2/summary';
    try {
        const response = await axios.get(apiUrl);
        const parsedData = response.data;
        const str =
            formatPoint(parsedData.tickers, 'btc', 'twd') +
            formatPoint(parsedData.tickers, 'eth', 'twd') +
            formatPoint(parsedData.tickers, 'sol', 'twd');
        return str;
    } catch (error) {
        return 'Error making API request: ' + error.message;
    }
}

function formatPoint(tickers, market, coin) {
    const info = tickers[market + coin];
    const open = parseFloat(info.open);
    const low = parseFloat(info.low);
    const high = parseFloat(info.high);
    const last = parseFloat(info.last);
    const buy = parseFloat(info.buy);
    const sell = parseFloat(info.sell);
    const volume = parseFloat(info.volume);
    const trend = last > open ? 'UP' : last < open ? 'DOWN' : 'UNCHANGED';
    const amplitude = (((high - low) / open) * 100).toFixed(2) + '%';

    const resultString = `
    ${market.toUpperCase()}/${coin.toUpperCase()} :
    現價: ${last}
    買價: ${buy}
    賣價: ${sell}
    開盤: ${open}
    高點: ${high}
    低點: ${low}
    震幅: ${amplitude}
    成交量: ${volume}
    趨勢: ${trend}
    ${calculateResult(last, market, coin)}
    ==============================`;
    return resultString;
}

function calculateResult(sellAmount, market, coin) {
    if (market != 'btc' && market != 'eth') {
        return "";
    }

    const holdingQuantity = market == 'btc' ?
        0.15816559 :
        0.43280447;
    const purchaseAmount = market == 'btc' ?
        (coin == 'usdt' ? 43253.88 : 1353826) :
        (coin == 'usdt' ? 2214.89 : 69317.2);
    const feeRate = 0.00045;
    const feePurchase = (purchaseAmount * holdingQuantity) * feeRate;
    const feeSell = (sellAmount * holdingQuantity) * feeRate;
    const earn = ((sellAmount - purchaseAmount) * holdingQuantity) - feePurchase - feeSell;
    const roi = (((sellAmount - purchaseAmount) / purchaseAmount) * 100).toFixed(2) + '%';
    const resultString = `損益: ${earn}
    手續費(買): ${feePurchase}
    手續費(賣): ${feeSell}
    報酬率: ${roi}`;
    return resultString;
}
