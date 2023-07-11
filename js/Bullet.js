class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'bomb');
    }

    shoot(direction, x, y, speed)
    {
        let temp = this.scalar(speed, this.normalize(direction));
        
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocity(temp[0], temp[1]);
    }

    scalar(scalar, vec)
    {
        return [scalar * vec[0], scalar * vec[1]];
    }

    normalize(vec)
    {
        let magnitude = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
        return [vec[0] / magnitude, vec[1] / magnitude];

    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        if (this.x <= -32 || this.x >= SCREENWIDTH + 32 || this.y <= -32 || this.y >= SCREENHEIGHT + 32)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }
}

class Bullets extends Phaser.Physics.Arcade.Group
{
    constructor (scene, speed, reload)
    {
        super(scene.physics.world, scene);

        this.createMultiple({
            frameQuantity: 15,
            key: 'bomb',
            active: false,
            visible: false,
            classType: Bullet
        });
        this.scene = scene;

        this.speed = speed;
        this.reload= reload;

        this.justShoot = false;

    }

    shootBullet(direction, x, y)
    {        
        if (!(this.justShoot))
        {
            const bullet = this.getFirstDead(false);
            if (bullet)
            {
                bullet.shoot(direction, x, y, this.speed);
                this.justShoot = true;
                
                this.scene.time.delayedCall(this.reload, function(){this.justShoot = false;}, [], this);
            }
        }
    }
}






/*
class Bullet
{
    constructor(gameObj, character, speed, damage)
    {
        this.damage = damage;
        this.speed = speed;

        this.xPos = character.x;
        this.yPos = character.y;
        this.timedEvent = gameObj.time;

        this.bullet = gameObj.physics.add.group();
    }

    playerShoot(facing)
    {
        this.bullet.create(this.xPos, this.yPos, "bomb");
        if (facing === "south") {
            this.bullet.setVelocity(0, this.speed);
        } else if (facing === "north") {
            this.bullet.setVelocity(0, -this.speed);
        } else if (facing === "west") {
            this.bullet.setVelocity(this.speed, 0);
        } else if (facing === "east") {
            this.bullet.setVelocity(-this.speed, 0);
        }
    }

    shoot(directionsVec, xPos, yPos)
    {   
        let dir = [directionsVec.x, directionsVec.y];

        let temp = this.scalar(this.speed, this.normalize(dir));
        //console.log("bullet speed: "+temp);
        this.bullet.create(xPos, yPos, "bomb");
        this.bullet.setVelocity(temp[0], temp[1]);
    }

    scalar(scalar, vec)
    {
        return [scalar * vec[0], scalar * vec[1]];
    }

    normalize(vec)
    {
        let magnitude = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
        return [vec[0] / magnitude, vec[1] / magnitude];

    }

    getEntity()
    {
        return this.bullet;
    }
}
*/


