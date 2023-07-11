const SCREENWIDTH = 800;
const SCREENHEIGHT = 608;

let gameScene = new Phaser.Scene('Game');

let config = {

    type: Phaser.AUTO,
    width: 800,
    height: 608,

    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [gameScene, room1]
};

let player;
let enemies;

let bombs;

let cursors;
let gameOver = false;

let game = new Phaser.Game(config);

gameScene.preload = function()
{

    // -----------------------------------------------------------------------------------
    // Loading Audio Assests
    this.load.audio("gameover", "assets/audios/dyingsound.mp3");
    this.load.audio("background", "assets/audios/Monkeys-Spinning-Monkeys.mp3");
    this.load.audio("hitsound", "assets/audios/roblox-death-sound-effect_69KVqYY.mp3");
    this.load.audio("pewpew", "assets/audios/pewpew.wav");
    this.load.audio("gunshot", "assets/audios/gunshot.wav");

    // -----------------------------------------------------------------------------------
    // Loading Image Assests
    this.load.image("tiles1", "assets/images/forest_.png");
    this.load.image("tiles1_resources", "assets/images/forest_resources.png");
    this.load.tilemapTiledJSON("map1", "assets/json/chromophobia_map_v4.json");

    this.load.image('star', 'assets/images/star.png');
    this.load.image('bomb', 'assets/images/bomb.png');



    // -----------------------------------------------------------------------------------
    // Loading Player Assests
    this.load.spritesheet('idleMain', 'assets/images/IdleMain.png', { frameWidth: 21, frameHeight: 30 });
    this.load.spritesheet('walkingMain', 'assets/images/WalkingMain.png', { frameWidth: 21, frameHeight: 30 });

    // -----------------------------------------------------------------------------------
    // Loading Player Assests
    this.load.spritesheet('idleEnemy', 'assets/images/IdleEnemy.png', { frameWidth: 21, frameHeight: 30 });
    this.load.spritesheet('walkingEnemy', 'assets/images/WalkingEnemy.png', { frameWidth: 21, frameHeight: 30 });


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


    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), treelayer);
    // treelayer.setCollisionBetween(214, 228);

    treelayer.setCollisionByProperty({collides:true});
    // bglayer.setTileLocationCallback(24, 4, 3, 3, ()=>{
    //     alert("portal wurde betreten!");
    //     console.log("portal wurde betreten!");

    //     bglayer.setTileLocationCallback(24, 4, 3, 3, null); //rekursive call weil sonst infinite loop
    // });
    bglayer.setTileIndexCallback([39, 40, 41, 61, 62, 63, 83, 84, 85], ()=>{
        console.log("portal betreten");
    });

    this.input.on("pointerdown", ()=>{
        this.scene.start(room1);
    });

    enemies = new Enemy(gameScene, player.getEntity(), 100, 100, 100, 300, 200, 'blue', new Bullets(gameScene, 200, 500, 50, 'red'));
    //console.log(enemies);

  
    this.physics.add.collider(player.getEntity(), enemies.getEntity());

    this.physics.add.overlap(player.bullet, enemies.getEntity(), test1, null, this);
    this.physics.add.overlap(enemies.bullet, player.getEntity(), test1, null, this);
    let background = this.sound.add("background", {volume: 0.5});
    background.play();
}

function test1(character, bullet)
{  
    if(bullet.active)
    {
        character.hit(bullet.damage, bullet.color);
        let gotshot = this.sound.add("hitsound", {volume: 0.1}, { loop: false});
        gotshot.play();
        if (character.health === 0) {
            let dyingSound = this.sound.add("gameover", {volume: 0.1});
            dyingSound.play();
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
}