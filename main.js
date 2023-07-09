const SCREENWIDTH = 800;
const SCREENHEIGHT = 600;

let gameScene = new Phaser.Scene('Game');

let config = {

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
    scene: gameScene
};

let player;
//let stars;
let enemies;

let bombs;
let platforms;
let cursors;
let score = 0;
let gameOver = false;
let scoreText;


let game = new Phaser.Game(config);

gameScene.preload = function()
{
    // this.load.image('sky', 'assets/sky.png');
    // this.load.image('ground', 'assets/platform.png');
    this.load.image("tiles1", "assets/forest_.png");
    this.load.image("tiles1_resources", "assets/forest_resources.png")
    this.load.tilemapTiledJSON("map1", "assets/chromophobia_map_v2.json");

    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');



    // -----------------------------------------------------------------------------------
    // Loading Player Assests
    this.load.spritesheet('idleMain', 'assets/IdleMain.png', { frameWidth: 21, frameHeight: 30 });
    this.load.spritesheet('walkingMain', 'assets/WalkingMain.png', { frameWidth: 21, frameHeight: 30 });

    // -----------------------------------------------------------------------------------
    // Loading Player Assests
    this.load.spritesheet('idleEnemy', 'assets/IdleEnemy.png', { frameWidth: 21, frameHeight: 30 });
    this.load.spritesheet('walkingEnemy', 'assets/WalkingEnemy.png', { frameWidth: 21, frameHeight: 30 });


}

gameScene.create = function()
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


    // -----------------------------------------------------------------------------------
    // Player Animations
    this.anims.create({
        key: 'main-walk-front',
        frames: this.anims.generateFrameNumbers('walkingMain', {frames:[0, 3, 6, 9]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'main-walk-back',
        frames: this.anims.generateFrameNumbers('walkingMain', {frames:[1, 4, 7, 10]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'main-walk-side',
        frames: this.anims.generateFrameNumbers('walkingMain', {frames:[2, 5, 8, 11]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'main-idle-front',
        frames: this.anims.generateFrameNumbers('idleMain', {frames:[0, 3]}) ,
        frameRate: 2
    });

    this.anims.create({
        key: 'main-idle-back',
        frames: this.anims.generateFrameNumbers('idleMain', {frames:[1, 4]} ),
        frameRate: 2
    });

    this.anims.create({
        key: 'main-idle-side',
        frames: this.anims.generateFrameNumbers('idleMain', {frames:[2, 5]} ),
        frameRate: 2
    });


    // -----------------------------------------------------------------------------------
    // Enemy Animations
    this.anims.create({
        key: 'enemy-walk-front',
        frames: this.anims.generateFrameNumbers('walkingEnemy', {frames:[0, 3, 6, 9]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-walk-back',
        frames: this.anims.generateFrameNumbers('walkingEnemy', {frames:[1, 4, 7, 10]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-walk-side',
        frames: this.anims.generateFrameNumbers('walkingEnemy', {frames:[2, 5, 8, 11]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-idle-front',
        frames: this.anims.generateFrameNumbers('idleEnemy', {frames:[0, 3]}) ,
        frameRate: 2
    });

    this.anims.create({
        key: 'enemy-idle-back',
        frames: this.anims.generateFrameNumbers('idleEnemy', {frames:[1, 4]} ),
        frameRate: 2
    });

    this.anims.create({
        key: 'enemy-idle-side',
        frames: this.anims.generateFrameNumbers('idleEnemy', {frames:[2, 5]} ),
        frameRate: 2
    });


    this.physics.add.collider(player, treelayer);
    treelayer.setCollisionBetween(16, 28);
    this.physics.add.collider(stars, platforms);
    this.physics.add.collider(bombs, platforms);



    cursors = this.input.keyboard.createCursorKeys();
    player = new MainCharacter(gameScene, 100, 450, 200, 400);


    enemies = new Enemy(gameScene, player, 100, 100, 50);
    enemies.shoot(gameScene, 150);
  

    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //this.physics.add.overlap(player, stars, collectStar, null, this);

    //this.physics.add.collider(player, bombs, hitBomb, null, this);
}

gameScene.update = function()
{

    player.movement();
    enemies.update();
    enemies.shoot(gameScene, 150);
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