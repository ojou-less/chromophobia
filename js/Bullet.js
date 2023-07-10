class Bullet
{
    constructor(gameObj, character, speed)
    {
        //this.damage = damage;
        this.speed = speed;

        this.xPos = character.x;
        this.yPos = character.y;

        //let gunshot = gameObj.sound.add("gunshot", {volume: 0.01}, { loop: false});
        //gunshot.play();
        let pewpew = gameObj.sound.add("pewpew", {volume: 0.01}, { loop: false});
        pewpew.play();
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