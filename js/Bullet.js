class Bullet
{
    constructor(gameObj, character, facing, speed)
    {
        
        //this.damage = damage;
        this.xPos = character.x;
        this.yPos = character.y;

        this.bullet = gameObj.physics.add.group();
        
        this.shoot(facing, speed);
    }

    shoot(facing, speed)
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
}