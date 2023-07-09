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

        this.entity = gameObj.physics.add.sprite(this.xPos, this.yPos, 'idleMain');
        this.entity.setCollideWorldBounds(true);
    }

    show()
    {
        this.entity.anims.play('main-idle-front', true);
    }

    movement()
    {
        let pressed = false;
        const speed = 200;
        if (gameOver)
        {
            return;
        }

        if (cursors.left.isDown)
        {
            this.entity.setVelocity(-speed, 0);
            pressed = true;
            this.entity.facing = 'east';
            this.entity.anims.play('main-walk-side', true);
            this.entity.flipX=true

        }
        else if (cursors.right.isDown)
        {
            this.entity.setVelocity(speed, 0);
            pressed = true;
            this.entity.facing = 'west';
            this.entity.anims.play('main-walk-side', true);
            this.entity.flipX=false
        }
        else if (cursors.up.isDown)
        {
            this.entity.setVelocity(0, -speed);
            pressed = true;
            this.entity.facing = 'north';
            this.entity.anims.play('main-walk-back', true);
        }

        if (cursors.down.isDown)
        {
            this.entity.setVelocity(0, speed);
            pressed = true;
            this.entity.facing = 'south';
            this.entity.anims.play('main-walk-front', true);

        }

        if (cursors.down.isDown && cursors.left.isDown)
        {
            this.entity.setVelocity(-speed, speed);
            pressed = true;
        }
        if (cursors.down.isDown && cursors.right.isDown)
        {
            this.entity.setVelocity(speed, speed);
            pressed = true;
        }
        if (cursors.up.isDown && cursors.left.isDown)
        {
            this.entity.setVelocity(-speed, -speed);
            pressed = true;
        }
        if (cursors.up.isDown && cursors.right.isDown)
        {
            this.entity.setVelocity(speed, -speed);
        }
        if (cursors.space.isDown)
        {
            new Bullet(gameScene, this.entity);
            //console.log("pew")
        }
        else if (pressed === false) {
            this.entity.setVelocity(0, 0);
            if(this.entity.facing === 'south')
            {
                this.entity.anims.play('main-idle-front', true);
            }
            else if(this.entity.facing === 'north')
            {
                this.entity.anims.play('main-idle-back', true);
            }
            else if(this.entity.facing === 'east')
            {
                this.entity.anims.play('main-idle-side', true);
                this.entity.flipX=true
            }
            else
            {
                this.entity.anims.play('main-idle-side', true);
                this.entity.flipX=false
            }

        }
    }


}