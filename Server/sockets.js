const WebSocket = require('ws');
var uuid = require('uuid-random');

var playersData = {
	"type" : "playerData"
}

//=====WEBSOCKET FUNCTIONS======
function initializeSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', handleConnection);
}

function handleConnection(ws) {
    ws.id = uuid();
    console.log('Client connected');

    var currentClient = playersData[""+ws.id]
    ws.send(`{"id": "${ws.id}"}`)

    ws.on('message', handleMessage);

    ws.on('close', () => {
        console.log('Client disconnected');
    });
}

function handleMessage(message) {
    
    try {
        const data = JSON.parse(message);
        console.log(data);
        switch (data.type) {
            case 'join':
                break;
            case 'movement':
                handleMovement(data);
                break;
            case 'action':
                handleAction(data);
                break;
            // Add more cases for different message types
            default:
                console.log('Unknown message type');
        }
    } catch (error) {
        console.error('Error parsing message:', error);
    }
}

function handleMovement(data) {
    // Implement logic to handle player movement
}

function handleAction(data) {
    // Implement logic to handle player actions
}

module.exports = { initializeSocket };