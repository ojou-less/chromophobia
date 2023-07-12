const SCREENWIDTH = 800;
const SCREENHEIGHT = 608;

let gameScene = new Phaser.Scene('Lobby');

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

    scene: [gameScene, room1]
};

let player;
//let enemies = [];

let bombs;

let cursors;
let gameOver = false;
let gameoverText;
let roomText;


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

    console.log("preload");
}

gameScene.create = function()
{
    console.log("create");
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
    this.enemies = [new Enemy(gameScene, player.getEntity(), 100, 100, 70, 200, 200, 'blue', new Bullets(gameScene, 200, 700, 40, 'red'))];
    this.enemies.push(new Enemy(gameScene, player.getEntity(), 400, 400, 70, 200, 200, 'blue', new Bullets(gameScene, 200, 700, 40, 'red')));

    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), treelayer);

    treelayer.setCollisionByProperty({collides:true});
    bglayer.setTileIndexCallback([39, 40, 41, 61, 62, 63, 83, 84, 85], ()=>{
        console.log("portal betreten");
    });

    this.input.keyboard.on("keydown-A", () =>{
        //room1.preload();
        this.scene.start(room1);
    });

    

    for(let i = 0; i < this.enemies.length; i++)
    {
        console.log(this.enemies[i]);
        for(let j = 0; j < this.enemies.length; j++)
        {
            this.physics.add.collider(this.enemies[i].getEntity(), this.enemies[j].getEntity());
        }

        this.physics.add.collider(player.getEntity(), this.enemies[i].getEntity());
        this.physics.add.overlap(player.bullet, this.enemies[i].getEntity(), calcDamage, null, this);
        this.physics.add.overlap(this.enemies[i].bullet, player.getEntity(), calcDamage, null, this);
        
        this.physics.add.collider(this.enemies[i].bullet, treelayer, bulletHitObstacles, null, this);
        this.physics.add.collider(this.enemies[i].getEntity(), treelayer);
    }

    this.physics.add.collider(player.bullet, treelayer, bulletHitObstacles, null, this);
    
    let background = this.sound.add("background", {volume: 0.01});
    background.play();

    roomText = gameScene.add.text(16, 16, "Main Room", {fontSize: "16px", fill: "#000"});
    
    gameoverText = gameScene.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    gameoverText.setOrigin(0.5);
    gameoverText.setVisible(false);
}

function bulletHitObstacles(bullet)
{
    bullet.setVisible(false);
    bullet.setActive(false);
}

function calcDamage(character, bullet)
{
    if(bullet.active)
    {
        character.hit(bullet.damage, bullet.color);
        let gotshot = this.sound.add("hitsound", {volume: 0.01}, { loop: false});
        gotshot.play();
        console.log(character.health);

        if(character.dead())
        {
            //bullet.setVisible(false);
            for(let i = 0; i < this.enemies.length; i++)
            {
                if(this.enemies[i].getEntity() === character)
                {
                    this.enemies[i].entity = null;
                    this.enemies.splice(i,1);
                    console.log(this.enemies);
                }
            }
        }
    }
    bullet.setActive(false);
    bullet.setVisible(false);
}

gameScene.update = function()
{
    player.movement();
    for(let i = 0; i < this.enemies.length; i++)
    {
        this.enemies[i].update();
    }
}