class Bullet extends Phaser.Physics.Arcade.Sprite
{
    constructor (scene, x, y)
    {
        super(scene, x, y, 'bomb');
        this.damage;
        this.color;
        this.pewpew;

    }

    shoot(direction, x, y, speed)
    {
        let temp = this.scalar(speed, this.normalize(direction));
        this.body.reset(x, y);
        if(this.color === 'green')
        {
            this.setTint(0x00ff00);
        }
        if(this.color === 'red')
        {
            this.setTint(0xff0000);
        }
        if(this.color === 'blue')
        {
            this.setTint(0x0000ff);
        }
        this.setActive(true);
        this.setVisible(true);
        this.setVelocity(temp[0], temp[1]);
        this.pewpew.play();
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
    constructor (scene, speed, reload, damage, color)
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

        for (let i = 0; i < this.children.entries.length; i++) 
        {

            this.children.entries[i].pewpew = scene.sound.add("pewpew", {volume: 0.05}, { loop: false});
            this.children.entries[i].damage = damage;
            this.children.entries[i].color = color;
        }
        this.justShoot = false;
    }

    currentBullet()
    {
        return this.getFirstDead(false);
    }

    shootBullet(direction, x, y)
    {   
        if (!(this.justShoot))
        {
            const bullet = this.currentBullet();
            console.log(bullet);
            if (bullet)
            {
                bullet.shoot(direction, x, y, this.speed);
                this.justShoot = true;
                
                this.scene.time.delayedCall(this.reload, function(){this.justShoot = false;}, [], this);
            }
        }
    }
}


