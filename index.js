const express = require('express');
const WebSocketServer = require('websocket').server;
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

wsServer = new WebSocketServer({
    httpServer: httpServer,
    autoAcceptConnections: false,
});

function originIsAllowed(origin) {
    return true;
}

wsServer.on('request', function (request) {

    if (!originIsAllowed(request.origin)) {
        request.reject();
        return;
    }

    var connection = request.accept();
    console.log((new Date()) + ' Connection accepted.');

    connection.on('message', async (data) => {
        const message = JSON.parse(data.utf8Data);

        console.log(message);

        connection.send(JSON.stringify({message :message}));

        // axios.post(`${apiUrl}/chats/send-message`, {message: message}).then(res => {
        //     responseMessage = res.data;
        //     console.log(res);
        //     connection.send(JSON.stringify({message :responseMessage}));
        // });
    });

    connection.on('close', function (reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

app.get('/', function (req, res) {
    res.send('Brandon\'s Chat WebSocket is online');
})

httpServer.listen(port, () => {
    console.log(`Socket listening on port ${port}`);
});