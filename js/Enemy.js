class Enemy
{
    //constructor(entity, xPos, yPos, type, weakness, speed, health, bullet)
    constructor(gameObj, xPos, yPos, speed)
    {
        this.xPos = xPos;
        this.yPos = yPos;

        //this.facing = 'south'
        /*
        this.type = type;
        this.weakness = weakness;
        this.speed = speed;
        this.health = health;
        this.bullet = bullet;
        */
        this.entity = gameObj.physics.add.sprite(this.xPos, this.yPos, 'idleEnemy');
        this.entity.setCollideWorldBounds(true);
    }

    show()
    {
        this.entity.anims.play('enemy-idle-front', true);
    }

    movement()
    {
        
    }


}