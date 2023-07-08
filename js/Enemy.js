class Enemy
{
    //constructor(entity, xPos, yPos, type, weakness, speed, health, bullet)
    constructor(gameObj, xPos, yPos, speed)
    {
        this.xPos = xPos;
        this.yPos = yPos;
        this.speed = speed;

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
        
        this.entity = gameObj.physics.add.sprite(this.xPos, this.yPos, 'idleEnemy');
        this.entity.setCollideWorldBounds(true);
    }

    update(playerX, playerY)
    {
        this.graphics.clear();
        
        this.xPos = this.entity.body.transform.x;
        this.yPos = this.entity.body.transform.y;

        this.calcDesire(playerX, playerY);
        this.move();

        for(let i = 0; i < this.directions; i++)
        {
            this.line.push(new Phaser.Geom.Line(this.xPos, this.yPos, this.xPos + this.interest[i][0]*50, this.yPos + this.interest[i][1]*50));

            this.graphics.lineStyle(2, 0x00ff00);
            this.graphics.strokeLineShape(this.line[i]);
            this.interest[i] = [0, 0];
        }
        this.line = [];
        console.log()
        
        this.entity.anims.play('enemy-idle-front', true);
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

    calcDesire(playerX, playerY)
    {
        let toPlayerVec = [playerX - this.xPos, playerY - this.yPos];
        
        let compare = this.normalize(toPlayerVec);
        
        for(let i = 1; i < this.directions; i++)
        {
            let temp = this.dot(compare, this.basisDirections[i]);
            this.interest[i] = this.scalar(temp, this.basisDirections[i]);
        }
    }

    
    scalar(scalar, vec)
    {
        return [scalar * vec[0], scalar * vec[1]];
    }

    dot(vec1, vec2)
    {

        return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }

    normalize(vec)
    {
        let magnitude = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1]);
        return [vec[0] / magnitude, vec[1] / magnitude];
    }


}