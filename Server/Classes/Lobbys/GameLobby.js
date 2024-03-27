let LobbyBase = require('./LobbyBase.js');
let GameLobbySettings = require('./GameLobbySettings.js');
let Connection = require('../Connection.js');
let Bullet = require('../Bullet.js');
let WebSocket = require('ws');

module.exports = class GameLobby extends LobbyBase {
     constructor(id, settings = GameLobbySettings) {
         super(id);
         this.settings = settings;
         this.bullets = [];
         this.zombies = [];
     }

     onUpdate() {
        let lobby = this;
        lobby.updateBullets();
        lobby.updateDeadPlayers();

     }
     canEnterLobby(connection = Connection) {
        let lobby = this;
        let maxPlayerCounter = lobby.settings.maxPlayers;
        let currentPlayerCount = lobby.connections.length;

        if (currentPlayerCount + 1> maxPlayerCounter) {
            return false;
        }
        //Más condiciones aquí

        return true;
     }

     onEnterLobby(connection = Connection) {
        let lobby = this;

        super.onEnterLobby(connection);

        lobby.addPlayer(connection);

        //Handle spawning of any server objects here
     }

     onLeaveLobby(connection = Connection) {
        let lobby = this;
        super.onLeaveLobby(connection);

        lobby.removePlayer(connection);

        //Handle unspawning of any server objects here
     }
     updateBullets() {
        let lobby = this;
        let bullets = lobby.bullets;
        let connections = lobby.connections;
        bullets.forEach(bullet => {
            let isDestroyed = bullet.onUpdate();
            if(isDestroyed) {
                lobby.despawnBullet(bullet);
            } else {
                var returnData = {
                    id: bullet.id,
                    position: {
                        x: bullet.position.x,
                        y: bullet.position.y
                    }
                }
                connections.forEach(connection => {
                    connection.ws.send(JSON.stringify({
                        event: 'updatePosition',
                        data: returnData
                    }))
                })
            }
        })
     }

     updateDeadPlayers() {
        let lobby = this;
        let connections = lobby.connections;

        connections.forEach(connection => {
            let player= connection.player;

            if (player.isDead) {
                let isRespawn = player.respawnCounter();
                if (isRespawn) {
                    let ws = connection.ws;
                    let returnData = {
                        event:"respawnPlayer",
                        data: {
                            id: player.id,
                            position: {
                                x: player.position.x,
                                y: player.position.y
                            }
                        }
                        
                    
                    }
                    ws.send(JSON.stringify({returnData}))
                    lobby.broadcastMessage(player.id, JSON.stringify({returnData}));
                }
            }
        })
     }

     onFireBullet(connection = Connection, data) {
        let lobby = this;
        let ws = connection.ws;
        var bullet = new Bullet();
        bullet.name = "Bullet";
        bullet.activator = data.bulletdata.activator;
        bullet.position.x = data.bulletdata.position.x;
        bullet.position.y = data.bulletdata.position.y;
        bullet.direction.x = data.bulletdata.direction.x;
        bullet.direction.y = data.bulletdata.direction.y;
    
        lobby.bullets.push(bullet);
    
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
        lobby.broadcastMessage(connection.player.id, returnData);

     }
     onCollisionDestroyed(connection = Connection, data) {
        let lobby = this;
        console.log('Collsion with bullets id: '+data.id);
        //PARA MINIMIZAR ERRORES DE DUPLICADOS
        let returnBullets =  lobby.bullets.filter(bullet => {
            return bullet.id == data.id;
        });

        returnBullets.forEach(bullet => { 
            let zombieHit = false;

        // Iterate through zombies instead of 'zombies' variable
        lobby.zombies.forEach(zombie => {
            let distance = bullet.position.distanceTo(zombie.position); // Assuming distanceTo method exists

            if (distance < 0.65) { // Assuming a hit is determined by distance < 0.65
                zombieHit = true;
                let isDead = zombie.dealDamage(bullet.damage); // Assuming dealDamage method returns boolean

                let returnData = isDead ? {
                    event: 'zombieDead',
                    data: { id: zombie.id }
                } : {
                    event: 'zombieDamaged',
                    data: { id: zombie.id, health: zombie.health }
                };

                
                lobby.broadcastMessage(null, returnData); // null indicates no sender to exclude
                lobby.despawnBullet(bullet);
                if (isDead) {
                   
                    let index = lobby.zombies.indexOf(zombie);
                    if (index > -1) {
                        lobby.zombies.splice(index, 1);
                    }
                }
            }
        });

        if (!zombieHit || bullet.isDestroyed) { 
            bullet.isDestroyed = true;
        }
            
        }) ;
    }
    despawnBullet(bullet = Bullet) {
        let lobby = this;
        let bullets = lobby.bullets;
        let connections = lobby.connections;

        console.log("Destroying Bullet ("+`bullet.id`+")");
        var index = bullets.indexOf(bullet);
        if (index > -1) {
            bullets.splice(index, 1);
    
            var returnData = {
                event: 'serverUnSpawn',
                data: { id: bullet.id }
            }
            connections.forEach(connection => {
                if (connection.ws.readyState === WebSocket.OPEN) {
                    connection.ws.send(JSON.stringify(returnData));
                }
            });
        }
    }

     addPlayer(connection = Connection) {
        let lobby = this;
        let connections = lobby.connections;
        let ws = connection.ws;

        var returnData = {
            event: 'spawn',
            data: {id: connection.player.id}
        }
        ws.send(JSON.stringify(returnData));
        lobby.broadcastMessage(connection.player.id, returnData);

        connections.forEach(conn => {
            if (conn.player.id !== connection.player.id) {
                var returnData = {
                    event: 'spawn',
                    data: {id: conn.player.id}
                }
                ws.send(JSON.stringify(returnData));
            }
        });
     }
     


     removePlayer(connection = Connection) {
        let lobby = this;

        var returnData = {
            event: 'disconnected',
            data: {id: connection.player.id}
        }

        lobby.broadcastMessage(connection.player.id, returnData);
     }

     
     
}