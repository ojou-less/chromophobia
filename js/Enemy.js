class Enemy
{
    constructor(gameObj, player, xPos, yPos, speed, reach, health, weakness, bullet)
    {
        this.gameScene = gameObj;
        this.player = player;
        this.xPos = xPos;
        this.yPos = yPos;
        this.reach = reach;
        this.weakness = weakness;
        if(weakness === 'blue')
        {
            this.entity = gameObj.physics.add.sprite(this.xPos, this.yPos, 'enemy-green-n');
        }
        else if(weakness === 'red')
        {
            this.entity = gameObj.physics.add.sprite(this.xPos, this.yPos, 'enemy-lila-n');
        }
        else
        {
            this.entity = gameObj.physics.add.sprite(this.xPos, this.yPos, 'enemy-red-n');
        }

        
        this.entity.setCollideWorldBounds(true);
        this.entity.health = health;
        this.entity.weakness = weakness;

        this.health = health;

        
        this.speed = speed;
        this.bullet = bullet;

        this.directions = 8;

        this.basisDirections = []
        for(let i = 0; i<this.directions; i++)
        {
            this.basisDirections.push([Math.cos(i * 2*Math.PI/this.directions), Math.sin(i * 2*Math.PI/this.directions)])
        }

        this.graphics = gameObj.add.graphics();

        //this.line = [];
        this.interest = [];
        for(let i = 0; i<this.directions; i++)
        {
            this.interest.push([0, 0]);
        }
        
        this.entity.hit = function(damage, color)
        {
            if(this.health > 0){
                if(this.weakness === color)
                {
                    this.health -= 2*damage;
                }
                else
                {
                    this.health -= damage;
                }
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
        this.inbetween = [];
        for(let i = 1; i<=8; i++)
        {
            this.inbetween.push([i*2*Math.PI/8])
        }
        this.facing = [];
    }

    update()
    {
        this.xPos = this.entity.body.transform.x;
        this.yPos = this.entity.body.transform.y;

        this.calcDesire();
        this.move();

        for(let i = 0; i < this.directions; i++)
        {
            this.interest[i] = [0, 0];
        }

        this.loadSprite();

        this.shoot();
        this.healthBar();
    }

    healthBar()
    {
        let healthWidth = 20;
        this.graphics.clear();

        if(this.entity.health > 0)
        {
            let line = new Phaser.Geom.Line(this.xPos-(healthWidth *(this.entity.health/ this.health)), this.yPos-20, this.xPos+(healthWidth *(this.entity.health/ this.health)),  this.yPos-20);
            this.graphics.lineStyle(5, 0x00ff00);
            this.graphics.strokeLineShape(line);
        }
    }

    shoot()
    {
        let temp = this.magnitude(this.vectorize(this.xPos, this.yPos, this.player.x, this.player.y));
        let direction = [this.entity.body.newVelocity.x, this.entity.body.newVelocity.y]

        let angle 
        if(direction[1] < 0)
        {
            angle = Math.acos(this.dot(this.facing, [1, 0])/ this.magnitude(this.facing));
        } 
        else
        {
            angle = Math.PI + Math.acos(this.dot(this.facing, [-1, 0])/ this.magnitude(this.facing));
        }

        if(temp < this.reach && this.player.health > 0)
        {
            this.bullet.currentBullet().rotation = -angle;
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
        this.facing = average;
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

    loadSprite()
    {
        let angle 
        if(this.facing[1] < 0)
        {
            angle = Math.acos(this.dot(this.facing, [1, 0])/ this.magnitude(this.facing));
        } 
        else
        {
            angle = Math.PI + Math.acos(this.dot(this.facing, [-1, 0])/ this.magnitude(this.facing));
        }

        if(angle > this.inbetween[0] && angle <= this.inbetween[1])
        {
            if(this.weakness === 'blue')
            {
                this.entity.anims.play('enemy-green-nw', true);
                this.entity.flipX=false;
            }
            else if(this.weakness === 'red')
            {
                this.entity.anims.play('enemy-lila-nw', true);
                this.entity.flipX=false;
            }
            else
            {
                this.entity.anims.play('enemy-red-nw', true);
                this.entity.flipX=false;
            }
        }
        else if(angle > this.inbetween[1] && angle <= this.inbetween[2])
        {
            if(this.weakness === 'blue')
            {
                this.entity.anims.play('enemy-green-s', true);
            }
            else if(this.weakness === 'red')
            {
                this.entity.anims.play('enemy-lila-s', true);
            }
            else
            {
                this.entity.anims.play('enemy-red-s', true);
            }
        }
        else if(angle > this.inbetween[2] && angle <= this.inbetween[3])
        {
            if(this.weakness === 'blue')
            {
                this.entity.anims.play('enemy-green-nw', true);
                this.entity.flipX=true;
            }
            else if(this.weakness === 'red')
            {
                this.entity.anims.play('enemy-lila-nw', true);
                this.entity.flipX=true;
            }
            else
            {
                this.entity.anims.play('enemy-red-nw', true);
                this.entity.flipX=true;
            }
        }
        else if(angle > this.inbetween[3] && angle <= this.inbetween[4])
        {
            if(this.weakness === 'blue')
            {
                this.entity.anims.play('enemy-green-w', true);
                this.entity.flipX=true;
            }
            else if(this.weakness === 'red')
            {
                this.entity.anims.play('enemy-lila-w', true);
                this.entity.flipX=true;
            }
            else
            {
                this.entity.anims.play('enemy-red-w', true);
                this.entity.flipX=true;
            }
        }
        else if(angle > this.inbetween[4] && angle <= this.inbetween[5])
        {
            if(this.weakness === 'blue')
            {
                this.entity.anims.play('enemy-green-sw', true);
                this.entity.flipX=true;
            }
            else if(this.weakness === 'red')
            {
                this.entity.anims.play('enemy-lila-sw', true);
                this.entity.flipX=true;
            }
            else
            {
                this.entity.anims.play('enemy-red-sw', true);
                this.entity.flipX=true;
            }
        }
        else if(angle > this.inbetween[5] && angle <= this.inbetween[6])
        {
            if(this.weakness === 'blue')
            {
                this.entity.anims.play('enemy-green-n', true);
            }
            else if(this.weakness === 'red')
            {
                this.entity.anims.play('enemy-lila-n', true);
            }
            else
            {
                this.entity.anims.play('enemy-red-n', true);
            }
        }
        else if(angle > this.inbetween[6] && angle <= this.inbetween[7])
        {
            if(this.weakness === 'blue')
            {
                this.entity.anims.play('enemy-green-sw', true);
                this.entity.flipX=false;
            }
            else if(this.weakness === 'red')
            {
                this.entity.anims.play('enemy-lila-sw', true);
                this.entity.flipX=false;
            }
            else
            {
                this.entity.anims.play('enemy-red-sw', true);
                this.entity.flipX=false;
            }
        }
        else
        {
            if(this.weakness === 'blue')
            {
                this.entity.anims.play('enemy-green-w', true);
                this.entity.flipX=false;
            }
            else if(this.weakness === 'red')
            {
                this.entity.anims.play('enemy-lila-w', true);
                this.entity.flipX=false;
            }
            else
            {
                this.entity.anims.play('enemy-red-w', true);
                this.entity.flipX=false;
            }
        }

    }

    getEntity()
    {
        return this.entity;
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