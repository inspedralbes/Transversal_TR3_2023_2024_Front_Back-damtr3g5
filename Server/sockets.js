const WebSocket = require('ws');


function initializeSocket(server) {
    const wss = new WebSocket.Server({server});

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log('Received: %s', message);

        // Handle incoming messages here
        handleMessage(message);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
}


function handleMessage(message) {
    // Implement logic to handle different types of messages
    // Example: parse JSON message and handle different message types
    try {
        const data = JSON.parse(message);
        switch (data.type) {
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

module.exports = { initializeSocket};