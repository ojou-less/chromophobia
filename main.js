var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 608,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true
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
    // this.load.image('sky', 'assets/sky.png');
    // this.load.image('ground', 'assets/platform.png');
    this.load.image("tiles1", "assets/forest_.png");
    this.load.image("tiles1_resources", "assets/forest_resources.png")
    this.load.tilemapTiledJSON("map1", "assets/chromophobia_map_v2.json");

    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');
    this.load.image('back', 'assets/dudeBack.png');

    this.load.spritesheet('dude', 'assets/dude.png', { 
        frameWidth: 32, 
        frameHeight: 48
    });
}

function create ()
{
    // this.add.image(400, 300, 'sky');

    // platforms = this.physics.add.staticGroup();

    // platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // platforms.create(600, 400, 'ground');
    // platforms.create(50, 250, 'ground');
    // platforms.create(750, 220, 'ground');

    const map = this.make.tilemap({
        key: "map1",
        tileWidth: 16,
        tileHeight: 16
    });

    const tileset = map.addTilesetImage("forest_", "tiles1");
    const treetiles = map.addTilesetImage("forest_ [resources]", "tiles1_resources");
    const bglayer = map.createLayer("Background", tileset, 0, 0);
    const treelayer = map.createLayer("Trees", treetiles, 0, 0);

    player = this.physics.add.sprite(200, 400, 'dude');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    player.facing = 'down';

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'front',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'back',
        frames: [ { key: 'back', frame: 0 } ],
        frameRate: 20
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

    this.physics.add.collider(player, treelayer);
    treelayer.setCollisionBetween(15, 29);      //what the fuck bro AAAA
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
        player.anims.play('left', true);
        
    }
    else if (cursors.right.isDown)
    {
        player.setVelocity(speed, 0);
        pressed = true;
        player.facing = 'right';
        player.anims.play('right', true);
    }
    else if (cursors.up.isDown)
    {
        player.setVelocity(0, -speed);
        pressed = true;
        player.facing = 'up';
        player.anims.play('back');
    }

    if (cursors.down.isDown)
    {
        player.setVelocity(0, speed);
        pressed = true;
        player.facing = 'down';
        player.anims.play('front');
       
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
        player.anims.play('front');
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