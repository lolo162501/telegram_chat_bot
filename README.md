# Telegram Chat Bot Deployment

這個項目是一個 Telegram Chat Bot，可以實現 LLM 對話，並且可以在 Binance 和 Max 平台查詢幣價。這份文件將指導你如何透過 Docker 部署到 Google Cloud Run。

## 建立 Docker 鏡像

首先，你需要在你的項目根目錄下建立一個 `Dockerfile`。以下是一個基本的 `Dockerfile` 範例：

```Dockerfile
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]

```

可以使用以下命令來建立你的 Docker 鏡像：

```sh
docker build -t gcr.io/PROJECT_ID/telegram_chat_bot .
```

請記住將 `PROJECT_ID` 替換為你的 Google Cloud 項目 ID。

## 推送 Docker 鏡像到 Google Artifact Registry

接下來，你需要將你的 Docker 鏡像推送到 Google Artifact Registry：

```sh
docker push gcr.io/PROJECT_ID/telegram_chat_bot
```

請記住將 `PROJECT_ID` 替換為你的 Google Cloud 項目 ID。

## 部署到 Google Cloud Run

最後，你可以部署你的服務到 Google Cloud Run：

```sh
gcloud run deploy telegram-chat-bot --image gcr.io/PROJECT_ID/telegram_chat_bot --region asia-northeast1
```

請記住將 `PROJECT_ID` 替換為你的 Google Cloud 項目 ID。

現在，你的 Telegram Chat Bot 已經部署到 Google Cloud Run，並可以接收來自 Telegram 的訊息。