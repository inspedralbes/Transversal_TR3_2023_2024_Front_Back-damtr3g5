const WebSocket = require('ws');


function initializeSocket(server, cors) {
    const wss = new WebSocket.Server({ server});
    wss.on('listening', ()=> {
        console.log("Server is listening on port "+8080)
    })
    wss.on('connection', (ws) => {
        ws.on('message', (data)=> {
            console.log('data received %o'+data)
            ws.send(data);
        })
        ws.on('close', () => {
            console.log('Client disconnected');
        });
    });
    

    
}

module.exports = { initializeSocket};