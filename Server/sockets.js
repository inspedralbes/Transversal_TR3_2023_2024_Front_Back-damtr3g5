const WebSocket = require('ws');
let uuid = require('uuid-random');
let Server = require('./Classes/Server.js');

console.log("Sockets.js loaded");

let server = new Server();

setInterval(() => {
    server.onUpdate();
},100,0);

function initializeSocket(serverinf) {
    const wss = new WebSocket.Server({ server:serverinf });

    wss.on('connection', function(ws) {
        let connection = server.onConnected(ws);
        connection.createEvents();
        connection.ws.send(JSON.stringify({ event: 'register', data: {id: connection.player.id} }));
        //handleConnection(ws, broadcastExceptSender);
    });
}

function interval(func, wait, times) {
    var interv = function(w,t) {
        return function() {
            if(typeof t === "undefined" || t-- > 0) {
                setTimeout(interv, w);
                try {
                    func.call(null);
                } catch(e) {
                    t = 0;
                    throw e.toString();
                }
            }
        };
    }(wait,times);
    setTimeout(interv, wait);
}

module.exports = {initializeSocket};
