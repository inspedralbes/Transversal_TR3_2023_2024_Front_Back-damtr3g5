var shortID = require('shortid');
var Vector2 = require('./Vector2.js');
var PlayerAnimator = require('./PlayerAnimator.js');

module.exports = class Zombie {
    constructor() {
        this.id = shortID.generate();
        this.position = new Vector2();
        this.animator = new PlayerAnimator(); // Instantiate PlayerAnimator
        this.health = new Number(100);
        this.isDead= false;
        this.attackDamage = new Number(10);

    }
        dealDamage(amount = Number) {
            this.health -= amount;
            if (this.health <= 0) {
                this.isDead = true;
            }
            return this.isDead;
        }
    }
