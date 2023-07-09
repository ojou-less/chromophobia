class Bullet
{
    constructor(gameObj, character, facing, speed)
    {
        
        //this.damage = damage;
        this.speed = speed;
        this.bullet = gameObj.physics.add.group();
        
        this.shoot(facing, speed);
    }

    playerShoot(facing, speed)
    {
        this.bullet.create(this.xPos, this.yPos, "bomb");
        if (facing === "south") {
            this.bullet.setVelocity(0, speed);
        } else if (facing === "north") {
            this.bullet.setVelocity(0, -speed);
        } else if (facing === "west") {
            this.bullet.setVelocity(speed, 0);
        } else if (facing === "east") {
            this.bullet.setVelocity(-speed, 0);
        }


    }

    enemyShoot(directionsVec, xPos, yPos)
    {   
        let dir = [directionsVec.x, directionsVec.y];

        let temp = this.scalar(this.speed, this.normalize(dir));
        console.log("bullet speed: "+temp);
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
}