const WebSocket = require('ws');
var uuid = require('uuid-random');

//Custom - Classes
var Player = require('./Classes/Player.js');

var players = [];
var sockets = [];

//=====WEBSOCKET FUNCTIONS======
function broadcastExceptSender(senderId, data) {
    for (let id in sockets) {
        if (sockets.hasOwnProperty(id) && id !== senderId) {
            let ws = sockets[id];
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify(data));
            }
        }
    }
}

function initializeSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', function(ws) {
        handleConnection(ws, broadcastExceptSender); // Pass broadcastExceptSender as an argument
    });
}

function handleConnection(ws, broadcastExceptSender) { // Adjusted to receive broadcastExceptSender
    ws.id = uuid(); // It's better to assign id before using it
    var player = new Player();
    var playerId = player.id;
    players[playerId] = player;
    sockets[ws.id] = ws; // Use ws.id since it's now available
    console.log('Client connected');

    //NOTIFY PLAYER REGISTRATION
    ws.send(JSON.stringify({ event: 'register', data: {id: playerId} }));
    ws.send(JSON.stringify({event: 'spawn', data: player}));
    broadcastExceptSender(ws.id, { event: 'spawn', data: player });

    //Inform client about every other client in the game
    for (var id in players) {
        if (id !== playerId) {
            ws.send(JSON.stringify({ event: 'spawn', data: players[id] }));
        }
    }
    
    ws.on('message', handleMessage);

    ws.on('close', () => {
        console.log('Client disconnected');
        delete players[playerId];
        delete sockets[ws.id]; // Use ws.id here as well
        broadcastExceptSender(ws.id, { event: 'disconnected', data: { id: playerId } });
    });
}

//Positional data from client


function handleMessage(message) {
    
    try {
        const data = JSON.parse(message);
        console.log(data);
        switch (data.event) {
            case 'updatePosition':
                handlePosition(data)
                break;
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
function handlePosition(data) {
    var playerId = data.id;
    var position = data.position;
    if (players[playerId]) {
        players[playerId].position.x = position.x;
        players[playerId].position.y = position.y;
    }
    const newPosiitionData = {
        event: 'updatePosition',
        data: {
            id: playerId,
            position: position
        }
    };
    
    broadcastExceptSender(data.id, newPosiitionData);
}
function handleMovement(data) {
    // Implement logic to handle player movement
}

function handleAction(data) {
    // Implement logic to handle player actions
}

module.exports = { initializeSocket };