var shortID = require('shortid');
var Vector2 = require('./Vector2.js');
var PlayerAnimator = require('./PlayerAnimator.js');

module.exports = class Player {
    constructor() {
        this.username = '';
        this.id = shortID.generate();
        this.position = new Vector2();
        this.animator = new PlayerAnimator(); // Instantiate PlayerAnimator
        this.health = new Number(100);
        this.isDead= false;
        this.respawnTicker = new Number(0);
        this.respawnTime = new Number(0);

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
