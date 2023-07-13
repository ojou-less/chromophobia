class MainCharacter extends Phaser.Physics.Arcade.Sprite
{
    speed;
    xPos;
    yPos;
    health;
    bulletShot;

    constructor(gameObj, xPos, yPos, speed, health, bullet)
    {
        super(gameObj, xPos, yPos, 'assets/IdleMain.png');
    
        this.speed = speed;
        this.xPos = xPos;
        this.yPos = yPos;
        this.bullets = bullet;
        this.healthMax = 400;

        this.bullet = bullet[0];

        this.cursor = gameObj.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT,SPACE,ONE,TWO,THREE');
        this.graphics = gameObj.add.graphics();

        this.entity = gameObj.physics.add.sprite(this.xPos, this.yPos, 'idleMain');
        this.entity.setCollideWorldBounds(true);
        
        this.entity.facing = "south";

        this.entity.health = health;
        
        this.entity.hit = function(damage)
        {
            this.health -= damage;
        }

        this.entity.dead = function()
        {
            if(this.health <= 0)
            {
                let dyingSound = gameObj.sound.add("gameover", {volume: 0.5});
                gameObj.physics.pause();

                gameoverText.setVisible(true);
                gameObj.sound.stopAll();
                dyingSound.play();

                gameObj.input.on('pointerdown', () =>{
                    gameObj.scene.start(gameScene)
                });
            }
        } 
    }

    show()
    {
        this.entity.anims.play('main-idle-front', true);
    }

    healthBar()
    {
        let healthWidth = 20;
        this.graphics.clear();
        if(this.entity.health > 0)
        {
            let line = new Phaser.Geom.Line(this.xPos-(healthWidth *(this.entity.health/ this.healthMax)), this.yPos-20, this.xPos+(healthWidth *(this.entity.health/ this.healthMax)),  this.yPos-20);
            this.graphics.lineStyle(5, 0x00ff00);
            this.graphics.strokeLineShape(line);
        }
    }

    movement()
    {
        this.bulletShot = false;
        let pressed = false;
        this.speed = 200;
        let cursors = this.cursor;


        this.xPos = this.entity.body.transform.x;
        this.yPos = this.entity.body.transform.y;

        this.healthBar();

        if (gameOver)
        {
            return;
        }

        if (cursors.LEFT.isDown)
        {
            this.entity.setVelocity(-this.speed, 0);
            pressed = true;
            this.entity.facing = 'east';
            this.entity.anims.play('main-walk-side', true);
            this.entity.flipX = true

        }
        else if (cursors.RIGHT.isDown)
        {
            this.entity.setVelocity(this.speed, 0);
            pressed = true;
            this.entity.facing = 'west';
            this.entity.anims.play('main-walk-side', true);
            this.entity.flipX = false
        }
        else if (cursors.UP.isDown)
        {
            this.entity.setVelocity(0, -this.speed);
            pressed = true;
            this.entity.facing = 'north';
            this.entity.anims.play('main-walk-back', true);
        }

        if (cursors.DOWN.isDown)
        {
            pressed = true;
            this.entity.setVelocity(0, this.speed);
            this.entity.facing = 'south';
            this.entity.anims.play('main-walk-front', true);
        }

        if (cursors.DOWN.isDown && cursors.LEFT.isDown)
        {
            pressed = true;
            this.entity.facing = 'south-east';
            this.entity.anims.play('main-walk-south-west', true);
            this.entity.setVelocity(-this.speed, this.speed);
            this.entity.flipX = true
        }
        if (cursors.DOWN.isDown && cursors.RIGHT.isDown)
        {
            pressed = true;
            this.entity.facing = 'south-west';
            this.entity.anims.play('main-walk-south-west', true);
            this.entity.setVelocity(this.speed, this.speed);
            this.entity.flipX = false;
        }
        if (cursors.UP.isDown && cursors.LEFT.isDown)
        {
            pressed = true;
            this.entity.facing = "north-east";
            this.entity.anims.play('main-walk-north-west', true);
            this.entity.setVelocity(-this.speed, -this.speed);
            this.entity.flipX = true;
        }
        if (cursors.UP.isDown && cursors.RIGHT.isDown)
        {
            this.entity.facing = "north-west";
            this.entity.anims.play('main-walk-north-west', true);
            this.entity.flipX = false;
            this.entity.setVelocity(this.speed, -this.speed);
            pressed = true;
        }
        if(cursors.ONE.isDown)
        {
            console.log("Bullet 1");
            this.bullet = this.bullets[0];
        }
        if(cursors.TWO.isDown)
        {
            console.log("Bullet 2");
            this.bullet = this.bullets[1];
        }
        if(cursors.THREE.isDown)
        {
            console.log("Bullet 3");
            this.bullet = this.bullets[2];
        }
        if (cursors.SPACE.isDown)
        {
            //this.bullet.currentBullet().setTint(0xff0000);
            if (pressed === false) {
                this.entity.setVelocity(0,0);
                
            }
            if(this.entity.facing === 'north')
            {
                this.bullet.currentBullet().angle = -90;
                this.bullet.shootBullet([0, -1], this.xPos, this.yPos);
            }
            else if(this.entity.facing === 'east')
            {
                this.bullet.currentBullet().angle = 180;
                this.bullet.shootBullet([-1, 0], this.xPos, this.yPos);
            }
            else if(this.entity.facing === 'south')
            {
                this.bullet.currentBullet().angle = 90;
                this.bullet.shootBullet([0, 1], this.xPos, this.yPos);
            }
            else
            {
                this.bullet.currentBullet().angle = 0;
                this.bullet.shootBullet([1, 0], this.xPos, this.yPos);
            }
        }
        else if (pressed === false) 
        {

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
                this.entity.flipX = true
            }
            else if (this.entity.facing === 'west')
            {
                this.entity.anims.play('main-idle-side', true);
                this.entity.flipX=false
            }
            else if (this.entity.facing === "north-east") {
                this.entity.anims.play('main-idle-north-west', true);
                this.entity.flipX = true;
            }
            else if (this.entity.facing === "north-west") {
                this.entity.anims.play('main-idle-north-west', true);
                this.entity.flipX = false;
            }
            else if (this.entity.facing === "south-east") {
                this.entity.anims.play('main-idle-south-west', true);
                this.entity.flipX = true;
            } else {
                this.entity.anims.play('main-idle-south-west', true);
                this.entity.flipX = false;
            }
        }
    }

    getEntity() 
    {
        return this.entity;
    }

    getBulletEntity()
    {
        console.log(this.bullet);
        if(this.bullet !== null)
        {
            console.log(this.bullet);
            return this.bullet.getEntity();
        }
    }
}