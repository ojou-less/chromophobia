class MainCharacter extends Phaser.Physics.Arcade.Sprite
{
    //constructor(entity, xPos, yPos, type, weakness, speed, health, bullet)
    constructor(gameObj, xPos, yPos, speed)
    {
        super(gameObj, xPos, yPos, 'assets/IdleMain.png');
        //this.xPos = xPos;
        //this.yPos = yPos;
        //this.facing = 'south'
        /*
        this.type = type;
        this.weakness = weakness;
        this.speed = speed;
        this.health = health;
        this.bullet = bullet;

         */

        //this.entity = gameObj.physics.add.sprite(this.xPos, this.yPos, 'idleMain');
        //this.entity.setCollideWorldBounds(true);
    }

    show()
    {
        this.entity.anims.play('main-idle-front', true);
    }

    movement()
    {

    }


}