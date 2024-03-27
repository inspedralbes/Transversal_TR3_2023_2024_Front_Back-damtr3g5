var shortID = require('shortid');
var Vector2 = require('./Vector2.js');
var PlayerAnimator = require('./PlayerAnimator.js');

module.exports = class Player {
    constructor() {
        this.username = 'Default_Player';
        this.id = shortID.generate();
        this.lobby = 0;
        this.position = new Vector2();
        this.animator = new PlayerAnimator(); // Instantiate PlayerAnimator
        this.health = new Number(100);
        this.isDead= false;
        this.respawnTicker = new Number(0);
        this.respawnTime = new Number(0);

    }
    displayPlayerInformation() {
        let player =this;
        return '('+player.id+','+player.username+','+player.lobby+','+player.position.x+','+player.position.y+','+player.health+','+player.isDead+','+player.respawnTicker+','+player.respawnTime+')';
    }
    respawnCounter() {
        this.respawnTicker += 1;

        if (this.respawnTicker >= 10) {
            this.respawnTicker = new Number(0);
            this.respawnTime = this.respawnTime + 1;

            if (this.respawnTime >= 3) {
                this.isDead = false;
                this.respawnTicker = new Number(0);
                this.respawnTime = new Number(0);
                this.health = new Number(100);
                this.position = new Vector2(-8,3);

                return true;
            }
        }
        return false
    }
        dealDamage(amount = Number) {
            this.health -= amount;
            if (this.health <= 0) {
                this.isDead = true;
                this.respawnTicker = new Number(0);
                this.respawnTime = new Number(0);
            }
            return this.isDead;
        }
    }
