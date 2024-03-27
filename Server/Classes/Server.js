let Connection = require('./Connection.js');

let Player = require('./Player.js');

//lOBBIES
let LobbyBase = require('./Lobbys/LobbyBase.js');
let GameLobby = require('./Lobbys/GameLobby.js');
let GameLobbySettings = require('./Lobbys/GameLobbySettings.js');

module.exports = class Server {
    constructor() {
        this.connections = [];
        this.lobbys = [];


    }
    joinLobby(lobbyID, connection) {
        let server = this;
        // Check if the lobby exists; if not, create a new instance of a lobby (e.g., LobbyBase or GameLobby)
        if (!this.lobbys[lobbyID]) {
            // This needs to be an instance of LobbyBase or a subclass so it has the onEnterLobby method.
            this.lobbys[lobbyID] = new LobbyBase(lobbyID);
        }
        // Add the connection to the lobby's connections array
        server.lobbys[lobbyID].connections.push(connection);
        // Set the connection's lobby to this lobby
        connection.lobby = this.lobbys[lobbyID];
    }
    // Interval update ever 100 miliseconds
    onUpdate() {
        let server = this;

        //Update each lobby
        for(let id in server.lobbys) {
            server.lobbys[id].onUpdate();
        }
    }
    //Handle a new connection to server
    onConnected(ws) {
        let server = this;

        let connection = new Connection();
        connection.ws = ws;
        connection.player = new Player();
        connection.server = server;

        let player = connection.player;
        let lobbys = server.lobbys;

        console.log("Added new Player to the server ("  + player.id + ")");
        server.connections[player.id] = connection;

        server.joinLobby(player.lobby, connection);

        connection.lobby = lobbys[player.lobby];
        connection.lobby.onEnterLobby(connection);

        return connection;

    }
    onDisconnected(connection = Connection) {
        let server = this;
        let id = connection.player.id;

        delete server.connections[id];
        console.log("Player "+connection.player.displayPlayerInformation()+" has disconnected from the server");
        
        let lobbyId = connection.player.lobby;
        if (server.lobbys[lobbyId]) {
            // Remove the connection from its lobby
            server.lobbys[lobbyId].broadcastMessage(id, { event: "disconnected", data: { id: id } });
            server.lobbys[lobbyId].onLeaveLobby(connection);
        }
    }
    onAttemptToJoinGame(connection = Connection) {
        let server = this;
        let lobbyFound = false;

        let gameLobbies = server.lobbys.filter(lobby => {
            return lobby instanceof GameLobby;
        });
        console.log("Game Lobbies: " + gameLobbies.length);

        gameLobbies.forEach(lobby => {
            if (!lobbyFound) {
                let canJoin = lobby.canEnterLobby(connection);
                if (canJoin) {
                    lobbyFound = true;
                    server.onSwitchLobby(connection, lobby.id);
                }
            }
        });
        //All game lobbies are full or we have never created one
        if (!lobbyFound) {
            let gameLobby = new GameLobby(server.lobbys.length, new GameLobbySettings('FFA',2));
            server.lobbys.push(gameLobby);
            server.onSwitchLobby(connection, gameLobby.id);
        }
    }
    onSwitchLobby(connection = Connection, lobbyID) {
        let server = this;
        let lobbys = server.lobbys;
        server.joinLobby(lobbyID, connection);
        connection.lobby = lobbys[lobbyID];
        lobbys[connection.player.lobby].onLeaveLobby(connection);
        lobbys[lobbyID].onEnterLobby(connection);
    }
}