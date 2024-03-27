let Connection = require('../Connection.js');
let WebSocket = require('ws');

module.exports = class LobbyBase {
    constructor(id) {
        this.id = id;
        this.connections = [];
    }
    onUpdate() {

    }
    onEnterLobby(connection = Connection) {
        let lobby= this;
        let player = connection.player;

        console.log('Player '+player.displayPlayerInformation()+' has entered the lobby ('+lobby.id+')');

        lobby.connections.push(connection);
        player.lobby = lobby.id;
        connection.lobby = lobby;
    }
    onLeaveLobby(connection = Connection) {
        let lobby= this;
        let player = connection.player;

        console.log('Player '+player.displayPlayerInformation()+' has left the lobby ('+lobby.id+')');
        connection.lobby = undefined;
        let index = lobby.connections.indexOf(connection);
        if(index>-1) {
            lobby.connections.splice(index,1);
        }
        
    }
    broadcastMessage(senderId, data) {
        let lobby = this;

        lobby.connections.forEach(connection => {
            if (connection.player.id !== senderId && connection.ws.readyState === WebSocket.OPEN) {
                connection.ws.send(JSON.stringify(data));
            }
        });
    }
    

}