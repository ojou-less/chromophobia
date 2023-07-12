class Enemy
{
    constructor(gameObj, player, xPos, yPos, speed, reach, health, weakness, bullet)
    {
        this.gameScene = gameObj;
        this.player = player;
        this.xPos = xPos;
        this.yPos = yPos;
        this.reach = reach;

        this.entity = gameObj.physics.add.sprite(this.xPos, this.yPos, 'idleEnemy');
        this.entity.setCollideWorldBounds(true);
        this.entity.health = health;
        this.entity.weakness = weakness;

        this.health = health;

        
        this.speed = speed;
        //this.health = health;
        //this.weakness = weakness;
        this.bullet = bullet;

        this.directions = 8;

        this.basisDirections = []
        for(let i = 0; i<this.directions; i++)
        {
            this.basisDirections.push([Math.cos(i * 2*Math.PI/this.directions), Math.sin(i * 2*Math.PI/this.directions)])
        }

        this.graphics = gameObj.add.graphics();

        this.line = [];
        this.interest = [];
        for(let i = 0; i<this.directions; i++)
        {
            this.interest.push([0, 0]);
        }
        
        this.entity.hit = function(damage, color)
        {

            if(this.weakness === color)
            {
                this.health -= 2*damage;
            }
            else
            {
                this.health -= damage;
            }
        }

        this.entity.dead = function ()
        {
            if(this.health <= 0)
            {
                this.active = false;
                this.setTint(0xff0000);
                this.setVelocity(0);
                return true;
            }
        }
    }

    update()
    {
        this.graphics.clear();
        
        this.xPos = this.entity.body.transform.x;
        this.yPos = this.entity.body.transform.y;

        this.calcDesire();
        this.move();

        for(let i = 0; i < this.directions; i++)
        {
            this.line.push(new Phaser.Geom.Line(this.xPos, this.yPos, this.xPos + this.interest[i][0]*50, this.yPos + this.interest[i][1]*50));

            this.graphics.lineStyle(2, 0x00ffff);
            this.graphics.strokeLineShape(this.line[i]);
            this.interest[i] = [0, 0];
        }
        this.line = [];
        this.entity.anims.play('enemy-idle-front', true);

        this.shoot();
        this.healthBar();
    }

    healthBar()
    {
        let line = new Phaser.Geom.Line(this.xPos-10, this.yPos-20, this.xPos+10,  this.yPos-20);
        this.graphics.lineStyle(2, 0x00ff00);
        this.graphics.strokeLineShape(line);
    }

    shoot()
    {
        let temp = this.magnitude(this.vectorize(this.xPos, this.yPos, this.player.x, this.player.y));
        let direction = [this.entity.body.newVelocity.x, this.entity.body.newVelocity.y]
        if(temp < this.reach && this.player.health > 0)
        {
            this.bullet.shootBullet(direction, this.xPos, this.yPos);
        }
    }

    move()
    {
        let average = [0, 0];
        for(let i = 0; i < this.directions; i++)
        {
            average[0] += this.interest[i][0];
            average[1] += this.interest[i][1];
        }
        average[0] = (average[0] / this.directions);
        average[1] = (average[1] / this.directions);
        average = this.normalize(average);
        this.entity.setVelocity(average[0]*this.speed, average[1]*this.speed);
    }

    calcDesire()
    {
        let playerX = this.player.x;
        let playerY = this.player.y;

        let toPlayerVec = this.vectorize(this.xPos, this.yPos, playerX, playerY);
        
        let compare = this.normalize(toPlayerVec);
        
        for(let i = 1; i < this.directions; i++)
        {
            let temp = this.dot(compare, this.basisDirections[i]);
            this.interest[i] = this.scalar(temp, this.basisDirections[i]);
        }
    }

    getEntity()
    {
        return this.entity;
    }
    
    getBulletEntity()
    {
        return this.bullet.getEntity();
    }
    
    scalar(scalar, vec)
    {
        return [scalar * vec[0], scalar * vec[1]];
    }

    dot(vec1, vec2)
    {
        return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    vectorize(pnt1x, pnt1y, ptn2x, ptn2y)
    {
        return [ptn2x - pnt1x, ptn2y- pnt1y];
    }

    normalize(vec)
    {
        let magnitude = this.magnitude(vec);
        return [vec[0] / magnitude, vec[1] / magnitude];
    }

    magnitude(vec)
    {
        return Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
    }
}