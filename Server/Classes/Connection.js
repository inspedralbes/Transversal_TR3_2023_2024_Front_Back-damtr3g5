module.exports = class Connection {
    constructor() {
        this.ws;
        this.player;
        this.server;
        this.lobby;
    }
    //Handle all WebSocket Events
    createEvents() {
        let connection = this;
        let ws = connection.ws;
        let server = connection.server;
        let player = connection.player;
        ws.on('message', function(message)  {
            let data = JSON.parse(message);
            switch(data.event){
                case "disconnect":
                    server.onDisconnected(connection);
                    break;
                case "joinGame":
                    server.onAttemptToJoinGame(connection);
                    break;
                //OBTAINS DATA
                case "collisionDestroyed":
                    connection.lobby.onCollisionDestroyed(connection,data);
                    break;
                //OBTAINS DATA
                case "updatePosition":
                    player.position.x = data.data.position.x,
                    player.position.y = data.data.position.y;
                    server.lobbys[player.lobby].broadcastMessage(player.id, { event: "updatePosition", data: { id: player.id, position: player.position } });
                    break;
                //OBTAINS DATA
                case "updateAnimation":
                    player.animation = data.data.animation;
                    server.lobbys[player.lobby].broadcastMessage(player.id, { event: "updateAnimation", data: { id: player.id, animation: player.animation } });
                    break;
                //OBTAINS DATA
                case "fireBullet":
                    connection.lobby.onFireBullet(connection,data);
                    break;
                //OBTAINS DATA
                case "dealDamage":
                    break;
            }
        })
        
    }
}