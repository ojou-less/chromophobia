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
            player.setVelocity(-speed, 0);
            pressed = true;
            player.facing = 'east';
            player.anims.play('main-walk-side', true);
            player.flipX=true

        }
        else if (cursors.right.isDown)
        {
            player.setVelocity(speed, 0);
            pressed = true;
            player.facing = 'west';
            player.anims.play('main-walk-side', true);
            player.flipX=false
        }
        else if (cursors.up.isDown)
        {
            player.setVelocity(0, -speed);
            pressed = true;
            player.facing = 'north';
            player.anims.play('main-walk-back', true);
        }

        if (cursors.down.isDown)
        {
            player.setVelocity(0, speed);
            pressed = true;
            player.facing = 'south';
            player.anims.play('main-walk-front', true);

        }

        if (cursors.down.isDown && cursors.left.isDown)
        {
            player.setVelocity(-speed, speed);
            pressed = true;
        }
        if (cursors.down.isDown && cursors.right.isDown)
        {
            player.setVelocity(speed, speed);
            pressed = true;
        }
        if (cursors.up.isDown && cursors.left.isDown)
        {
            player.setVelocity(-speed, -speed);
            pressed = true;
        }
        if (cursors.up.isDown && cursors.right.isDown)
        {
            player.setVelocity(speed, -speed);
        }
        if (cursors.space.isDown)
        {
            new Bullet(gameScene, player);
            //console.log("pew")
        }
        else if (pressed === false) {
            player.setVelocity(0, 0);
            if(player.facing === 'south')
            {
                player.anims.play('main-idle-front', true);
            }
            else if(player.facing === 'north')
            {
                player.anims.play('main-idle-back', true);
            }
            else if(player.facing === 'east')
            {
                player.anims.play('main-idle-side', true);
                player.flipX=true
            }
            else
            {
                player.anims.play('main-idle-side', true);
                player.flipX=false
            }

        }
    }


}