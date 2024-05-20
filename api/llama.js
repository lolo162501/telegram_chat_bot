import http from 'http';

export async function sendLLM(msg) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({
            model: "gemma",
            messages: [{ role: "user", content: msg }]
        });

        const options = {
            hostname: 'localhost',
            port: 11434,
            path: '/api/chat',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        let responseContent = '';

        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

            // Handle the stream of data
            res.on('data', (chunk) => {
                const data = JSON.parse(chunk.toString());
                if (data.message) {
                    responseContent += data.message.content; // Append each piece of content
                }
                if (data.done) {
                    resolve(responseContent); // Resolve the promise with the final content
                }
            });
        });

        req.on('error', (e) => {
            reject(`problem with request: ${e.message}`);
        });

        req.write(postData);
        req.end();
    });
}