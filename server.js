import express from "express";
import { handler, send } from "./controller/index.js";

const PORT = process.env.PORT || 4040;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/sendMsg", async (req, res) => {
    res.send(await send(req));
});

app.post("*", async (req, res) => {
    console.log("Post => ", req.body);
    res.send(await handler(req));
});

app.get("*", async (req, res) => {
    console.log("Get => ", req.body);
    res.send(await handler(req));
});

app.listen(PORT, function (err) {
    if (err) console.error(err);
    console.log("Server listening on PORT", PORT);
});