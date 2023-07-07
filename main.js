var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var posX;
var posY;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.spritesheet('idle', 'assets/IdleMain.png', { frameWidth: 21, frameHeight: 30 });
    this.load.spritesheet('walking', 'assets/WalkingMain.png', { frameWidth: 21, frameHeight: 30 });

}

function create ()
{
    this.add.image(400, 300, 'sky');

    platforms = this.physics.add.staticGroup();

    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    player = this.physics.add.sprite(100, 450, 'idle'[0, 3]);
    //player.setScale(1.5)

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    player.facing = 'down';

    this.anims.create({
        key: 'walk-front',
        frames: this.anims.generateFrameNumbers('walking', {frames:[0, 3, 6, 9]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walk-back',
        frames: this.anims.generateFrameNumbers('walking', {frames:[1, 4, 7, 10]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'walk-side',
        frames: this.anims.generateFrameNumbers('walking', {frames:[2, 5, 8, 11]}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'idle-front',
        frames: this.anims.generateFrameNumbers('idle', {frames:[0, 3]}) ,
        frameRate: 3
    });

    this.anims.create({
        key: 'idle-back',
        frames: this.anims.generateFrameNumbers('idle', {frames:[1, 4]} ),
        frameRate: 3
    });

    this.anims.create({
        key: 'idle-side',
        frames: this.anims.generateFrameNumbers('idle', {frames:[2, 5]} ),
        frameRate: 3
    });


    cursors = this.input.keyboard.createCursorKeys();

    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    bombs = this.physics.add.group();

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.collider(player, platforms);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);

    //this.physics.add.overlap(player, stars, collectStar, null, this);

    //this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update ()
{
    movement()
    
}

function movement()
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
        player.facing = 'left';
        player.anims.play('walk-side', true);
        player.flipX=true
        
    }
    else if (cursors.right.isDown)
    {
        player.setVelocity(speed, 0);
        pressed = true;
        player.facing = 'right';
        player.anims.play('walk-side', true);
        player.flipX=false
    }
    else if (cursors.up.isDown)
    {
        player.setVelocity(0, -speed);
        pressed = true;
        player.facing = 'up';
        player.anims.play('walk-back', true);
    }

    if (cursors.down.isDown)
    {
        player.setVelocity(0, speed);
        pressed = true;
        player.facing = 'down';
        player.anims.play('walk-front', true);
       
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
        new bullet(80);
        new bullet(-80);
    }
    else if (pressed === false) {
        player.setVelocity(0, 0);
        player.anims.play('idle-front', true);
    }
}

/*
    ToDo:
    - flugbahn
    - damage on hit
    - color
*/
class bullet
{
    constructor(damage)
    {
        this.damage = damage;

        posX = player.x - damage;
        posY = player.y - damage;
        this.shoot();
    }

    shoot()
    {    
        let bomb = bombs.create(posX, posY, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

/*
    ToDo:
    - bombs 
    -- samething like bullets but bombs
*/
/*
function collectStar (player, star)
{
    star.disableBody(true, true);

    score += 10;
    scoreText.setText('Score: ' + score);

    if (stars.countActive(true) === 0)
    {
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, "bomb");
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play("turn");

    gameOver = true;
}
*/