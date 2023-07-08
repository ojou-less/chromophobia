class Bullet
{
    constructor(gameObj, character)
    {
        
        //this.damage = damage;
        this.xPos = character.x;
        this.yPos = character.y;

        this.bullet = gameObj.physics.add.group();
        
        this.shoot();
    }

    shoot()
    {   
        
        this.bullet.create(this.xPos, this.yPos, "bomb");
        
    }
}