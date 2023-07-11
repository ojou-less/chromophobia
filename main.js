
const SCREENWIDTH = 800;
const SCREENHEIGHT = 608;

let gameScene = new Phaser.Scene('Game');

let config = {

    type: Phaser.AUTO,
    width: 800,
    height: 608,
    scene: gameScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },

};

let player;

let enemies;

let bombs;

let cursors;
let score = 0;
let gameOver = false;
let gameoverText;


let game = new Phaser.Game(config);

gameScene.preload = function()
{

    // -----------------------------------------------------------------------------------
    // Loading Player Assests
    this.load.audio("gameover", "assets/dyingsound.mp3");
    this.load.audio("background", "assets/Monkeys-Spinning-Monkeys.mp3");
    this.load.audio("hitsound", "assets/roblox-death-sound-effect_69KVqYY.mp3");
    this.load.audio("pewpew", "assets/pewpew.wav");
    this.load.audio("gunshot", "assets/gunshot.wav");
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
    const map = this.make.tilemap({
        key: "map1",
        tileWidth: 16,
        tileHeight: 16
    });

    const tileset = map.addTilesetImage("forest_", "tiles1");
    const treetiles = map.addTilesetImage("forest_ [resources]", "tiles1_resources");
    const bglayer = map.createLayer("Background", tileset, 0, 0);
    const treelayer = map.createLayer("Trees", treetiles, 0, 0);

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

    cursors = this.input.keyboard.createCursorKeys();
    player = new MainCharacter(gameScene, 100, 450, 200, 400, new Bullets(gameScene, 400, 200, 50, 'white'));
    //console.log(player);

    enemies = new Enemy(gameScene, player.getEntity(), 100, 100, 100, 300, 200, 'blue', new Bullets(gameScene, 200, 500, 50, 'red'));
    //console.log(enemies);
  
    this.physics.add.collider(player.getEntity(), enemies.getEntity());

    this.physics.add.overlap(player.bullet, enemies.getEntity(), test1, null, this);
    this.physics.add.overlap(enemies.bullet, player.getEntity(), test1, null, this);
    let background = this.sound.add("background", {volume: 0.1});
    background.play();

    this.gameoverText = this.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    this.gameoverText.setOrigin(0.5);
    this.gameoverText.setVisible(false);
}

function test1(character, bullet)
{  
    if(bullet.active)
    {
        character.hit(bullet.damage, bullet.color);
        let gotshot = this.sound.add("hitsound", {volume: 0.5}, { loop: false});
        gotshot.play();
        if (character.health === 0) {
            let dyingSound = this.sound.add("gameover", {volume: 0.3});
            this.physics.pause();

            // show game over text
            this.gameoverText.setVisible(true);

            gameScene.sound.stopAll();
            dyingSound.play();
            gameScene.preload();
            this.input.on('pointerdown', () => this.scene.restart());
        }
    }
    bullet.setActive(false);
    bullet.setVisible(false);
    console.log(character.health);

}

gameScene.update = function()
{
    player.movement();
    enemies.update();
    //enemies.shoot(gameScene, 150);
    //console.log(enemies.getBulletEntity());
}