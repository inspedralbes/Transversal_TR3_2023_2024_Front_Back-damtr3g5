const WebSocket = require('ws');
var uuid = require('uuid-random');

//Custom - Classes
var Player = require('./Classes/Player.js');
var Bullet = require('./Classes/Bullet.js');

var players = [];
var sockets = [];
var bullets = [];

//Updates
setInterval (() => {
    bullets.forEach(bullet => {
        var isDestroyed = bullet.onUpdate();

        //Remove
        if (isDestroyed) {
            var index = bullets.indexOf(bullet);
            if (index > -1) {
                bullets.splice(index, 1);

                var returnData = {
                    id: bullet.id
                }
                for (var id in players) {
                    sockets[id].send(JSON.stringify({ event: 'serverUnSpawn', data: returnData }));
                }
            }

        }
        else {
            var returnData = {
                id: bullet.id,
                position: {
                    x: bullet.position.x,
                    y: bullet.position.y
                
                }
            }
            Object.keys(sockets).forEach(id => {
                const ws = sockets[id];
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ event: 'updatePosition', data: returnData }));
                } else {
                    console.log(`Socket for player ${id} not found or not open.`);
                }
            });
        }
    })
},100,0);

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
        handleConnection(ws, broadcastExceptSender);
    });
}

//INICIALIZACIÓN DE CONEXIÓN
function handleConnection(ws, broadcastExceptSender) { 
    ws.id = uuid(); 
    var player = new Player();
    var playerId = player.id;
    players[playerId] = player;
    sockets[ws.id] = ws; 
    console.log('Client connected');

    //NOTIFICAR REGISTRO
    ws.send(JSON.stringify({ event: 'register', data: {id: playerId} }));
    ws.send(JSON.stringify({event: 'spawn', data: player}));
    broadcastExceptSender(ws.id, { event: 'spawn', data: player });

    //INFORMAR SOBRE OTROS JUGADORES
    for (var id in players) {
        if (id !== playerId) {
            ws.send(JSON.stringify({ event: 'spawn', data: players[id] }));
        }
    }
    //MENSAJES
    ws.on('message', (message) => {
        handleMessage(ws, message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        delete players[playerId];
        delete sockets[ws.id]; 
        broadcastExceptSender(ws.id, { event: 'disconnected', data: { id: playerId } });
    });
}



//MANEJAR OBTENCIÓN DE MENSAJES
function handleMessage(ws,message) {
    const now = Date.now();
    const lastTimestamp = lastMessageTimestamps[ws.id] || 0;
    const rateLimit = getDynamicRateLimit(message);
    if (now - lastTimestamp < rateLimit) {
        return;
    }
    lastMessageTimestamps[ws.id] = now;
    try {
        
        const data = JSON.parse(message);
        switch (data.event) {
            case 'updateAnimation':
                handleAnimation(ws,data);
                break;
            case 'updatePosition':
                
                handlePosition(ws,data)
                break;
            case 'fireBullet':
                handleShooting(ws,data);
                break;
            case 'collisionDestroyed':
                handleCollision(ws,data);
                break;
            default:
        }
    } catch (error) {
        console.error('Error parsing message:', error);
    }
}
function handlePosition(ws,data) {
    try {
        const playerId = data.data.id;
        const position = data.data.position;
        
        if (players[playerId]) {
            players[playerId].position = position;
            const newPositionData = {
                event: 'updatePosition',
                data: {
                    id: playerId,
                    position: position
                }
            };
            
            
            broadcastExceptSender(playerId, newPositionData);
        } else {
            console.log(`Player with ID ${playerId} not found.`);
        }
    } catch (error) {
        console.error('Error handling position:', error);
    }
}
function handleAnimation(ws,data) {
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
function handleShooting(ws,data) {
    const playerId = data.playerID;
    var bullet = new Bullet();
    bullet.name = "Bullet";
    bullet.activator = data.bulletdata.activator;
    bullet.position.x = data.bulletdata.position.x;
    bullet.position.y = data.bulletdata.position.y;
    bullet.direction.x = data.bulletdata.direction.x;
    bullet.direction.y = data.bulletdata.direction.y;

    bullets.push(bullet);

    var returnData = {
        event: 'serverSpawn',
        data: {
            id: bullet.id,
            activator: bullet.activator,
            name: bullet.name,
            position: {
                x: bullet.position.x,
                y: bullet.position.y
            },
            direction: {
                x: bullet.direction.x,
                y: bullet.direction.y
            }
        }
    }
    ws.send(JSON.stringify(returnData));
    broadcastExceptSender(playerId, returnData);
}
function handleCollision(ws,data) {
    console.log('Collsion with bullets id: '+data.id);
    //PARA MINIMIZAR ERRORES DE DUPLICADOS
    let returnBullets = bullets.filter(bullet => {
        return bullet.id == data.id;
    });

    returnBullets.forEach(bullet => { 
        bullet.isDestroyed = true;  
     }) ;
}

//=====UTILITY FUNCTIONS======
function getCurrentServerLoad() {
    // Let's assume it returns a value between 0 (no load) and 1 (maximum load)
    return sockets.length / 100; // Example: if you consider 100 clients as max load
}

function getDynamicRateLimit(message) {
    // Parse the message to determine its type
    // Assuming message is already a parsed object or adjust as necessary
    const messageType = message.type; // Example: 'updatePosition', 'chatMessage', etc.

    // Get current server load
    const serverLoad = getCurrentServerLoad();

    // Define base rate limits for different message types (in milliseconds)
    const baseRateLimits = {
        'updatePosition': 1, // Allow position updates every 50ms under normal conditions
        'chatMessage': 500, // Throttle chat messages to every 1 second
        'default': 1 // Default rate limit for other messages
    };

    // Adjust the rate limit based on server load
    // Example: double the rate limit under maximum load
    const loadAdjustedRateLimit = baseRateLimits[messageType] ? baseRateLimits[messageType] * (1 + serverLoad) : baseRateLimits['default'] * (1 + serverLoad);

    return loadAdjustedRateLimit;
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

module.exports = { initializeSocket };