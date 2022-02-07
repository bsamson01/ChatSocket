const express = require('express');
const { Server } = require('ws');
const cors = require('cors');
const { createServer } = require("http");
const axios = require('axios');
require("dotenv").config();

const port = process.env.PORT || 4000;
const apiUrl =  'https://chatserver-bsam.herokuapp.com/api';

const app = express();
app.use(cors());
app.use(express.json());

const httpServer = createServer(app);

const wss = new Server({ server: httpServer });
const clients = new Set();

wss.on('connection', (ws) => {
    console.log((new Date()) + ' Connection accepted.');
    clients.add(ws);

    ws.on('message', (data) => {
        const message = JSON.parse(data);

        axios.post(`${apiUrl}/chats/send-message`, {message: message}).then(res => {
            responseMessage = res.data;

            clients.forEach(client => {
                client.send(JSON.stringify({message: responseMessage}));
            })
        });
    });

    ws.on('close', () =>{
        console.log('Client disconnected');
        clients.delete(ws);
    });
});

app.get('/', function (req, res) {
    res.send('Brandon\'s Chat WebSocket is online');
})

httpServer.listen(port, () => {
    console.log(`Socket listening on port ${port}`);
});