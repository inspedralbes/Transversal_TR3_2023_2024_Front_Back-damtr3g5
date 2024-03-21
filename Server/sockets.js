const WebSocket = require('ws');
var uuid = require('uuid-random');

//Custom - Classes
var Player = require('./Classes/Player.js');

var players = [];
var sockets = [];

const messageRateLimit = 5;
const lastMessageTimestamps = {};

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
    ws.on ('updateAnimation',handleAnimation);
    ws.on('message', (message) => {
        handleMessage(ws, message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        delete players[playerId];
        delete sockets[ws.id]; // Use ws.id here as well
        broadcastExceptSender(ws.id, { event: 'disconnected', data: { id: playerId } });
    });
}

//Positional data from client


function handleMessage(ws,message) {
    const now = Date.now();
    const lastTimestamp = lastMessageTimestamps[ws.id] || 0;
    if (now - lastTimestamp <1000/messageRateLimit) {
        return;
    }
    lastMessageTimestamps[ws.id] = now;
    try {
        
        const data = JSON.parse(message);
        switch (data.event) {
            case 'updateAnimation':
                handleAnimation(data);
                break;
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
        }
    } catch (error) {
        console.error('Error parsing message:', error);
    }
}
function handlePosition(data) {
    try {
        const playerId = data.data.id;
        const position = data.data.position;
        
        if (players[playerId]) {
            // Directly update player position without validation
            players[playerId].position = position;
            
            // Prepare updated position data
            const newPositionData = {
                event: 'updatePosition',
                data: {
                    id: playerId,
                    position: position
                }
            };
            
            // Broadcast the updated position to all clients except the sender
            broadcastExceptSender(playerId, newPositionData);
        } else {
            console.log(`Player with ID ${playerId} not found.`);
        }
    } catch (error) {
        console.error('Error handling position:', error);
    }
}
function handleAnimation(data) {
    const playerId = data.data.id;
    const animatorData = data.data.animator;
    if (players[playerId]) {
        // Update the player's animator parameters
        players[playerId].animator.speed = animatorData.speed;
        players[playerId].animator.vertical = animatorData.vertical;
        players[playerId].animator.horizontal = animatorData.horizontal;
        players[playerId].animator.lastVertical = animatorData.lastVertical;
        players[playerId].animator.lastHorizontal = animatorData.lastHorizontal;

        // Prepare and broadcast the updated animator data
        const updatedAnimatorData = {
            event: 'updateAnimation',
            data: {
                id: playerId,
                animator: players[playerId].animator
            }
        };

        broadcastExceptSender(playerId, updatedAnimatorData);
    } else {
        console.log(`Player with ID ${playerId} not found.`);
    }
}
function handleMovement(data) {
    // Implement logic to handle player movement
}

function handleAction(data) {
    // Implement logic to handle player actions
}
//=====UTILITY FUNCTIONS======



module.exports = { initializeSocket };