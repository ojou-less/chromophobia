const SCREENWIDTH = 800;
const SCREENHEIGHT = 608;

let gameScene = new Phaser.Scene('Lobby');

let config = {

    type: Phaser.AUTO,
    width: 800,
    height: 608,
    scene: [gameScene, room2, room3, room4, room5],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
};

let player;
//let enemies = [];

let bombs;

let gameOver = false;
let gameoverText;
let roomText;


let game = new Phaser.Game(config);

gameScene.preload = function()
{

    // -----------------------------------------------------------------------------------
    // Loading Audio Assests
    this.load.audio("gameover", "assets/audios/wilhelmScream.wav");
    this.load.audio("background", "assets/audios/nature-soundstropicaljunglebirds-108380.mp3");
    this.load.audio("hitsound", "assets/audios/roblox-death-sound-effect_69KVqYY.mp3");
    this.load.audio("pewpew", "assets/audios/pewpew.wav");

    // -----------------------------------------------------------------------------------
    // Loading Image Assests
    this.load.image("tiles1", "assets/images/forest_.png");
    this.load.image("tiles1_resources", "assets/images/forest_resources.png");
    this.load.tilemapTiledJSON("map1", "assets/json/chromophobia_main_room.json");
    this.load.image('bomb', 'assets/images/bomb.png');



    // -----------------------------------------------------------------------------------
    // Loading Player Assests
    this.load.spritesheet('idleMain', 'assets/images/IdleMain.png', { frameWidth: 21, frameHeight: 30 });
    this.load.spritesheet('walkingMain', 'assets/images/playerWalking.png', { frameWidth: 21, frameHeight: 30 });

    // -----------------------------------------------------------------------------------
    // Loading Enemy Assests
    this.load.spritesheet('lilaEnemy', 'assets/images/enemyLila.png', { frameWidth: 21, frameHeight: 30 });
    this.load.spritesheet('redEnemy', 'assets/images/enemyRed.png', { frameWidth: 21, frameHeight: 30 });
    this.load.spritesheet('greenEnemy', 'assets/images/enemyGreen.png', { frameWidth: 21, frameHeight: 30 });

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
    const portallayer = map.createLayer("Portal", tileset, 0, 0);

    // -----------------------------------------------------------------------------------
    // Player Animations
    this.anims.create({
        key: 'main-walk-back',
        frames: this.anims.generateFrameNumbers('walkingMain', {frames:[1, 6, 11, 16]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'main-walk-front',
        frames: this.anims.generateFrameNumbers('walkingMain', {frames:[0, 5, 10, 15]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'main-walk-side',
        frames: this.anims.generateFrameNumbers('walkingMain', {frames:[2, 7, 12, 17]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'main-walk-south-west',
        frames: this.anims.generateFrameNumbers("walkingMain", {frames: [4, 9, 14, 19]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'main-walk-north-west',
        frames: this.anims.generateFrameNumbers("walkingMain", {frames: [3, 8, 13, 18]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'main-idle-back',
        frames: this.anims.generateFrameNumbers('idleMain', {frames:[1, 6]}) ,
        frameRate: 2
    });

    this.anims.create({
        key: 'main-idle-front',
        frames: this.anims.generateFrameNumbers('idleMain', {frames:[0, 5]} ),
        frameRate: 2
    });

    this.anims.create({
        key: 'main-idle-side',
        frames: this.anims.generateFrameNumbers('idleMain', {frames:[2, 7]} ),
        frameRate: 2
    });

    this.anims.create({
        key: 'main-idle-south-west',
        frames: this.anims.generateFrameNumbers('idleMain', {frames:[4, 9]} ),
        frameRate: 2
    });

    this.anims.create({
        key: 'main-idle-north-west',
        frames: this.anims.generateFrameNumbers('idleMain', {frames:[3, 8]} ),
        frameRate: 2
    });


    // -----------------------------------------------------------------------------------
    // Violet Enemy Animations
    this.anims.create({
        key: 'enemy-lila-n',
        frames: this.anims.generateFrameNumbers('lilaEnemy', {frames:[0, 5, 10, 15]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-lila-s',
        frames: this.anims.generateFrameNumbers('lilaEnemy', {frames:[1, 6, 11, 16]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-lila-w',
        frames: this.anims.generateFrameNumbers('lilaEnemy', {frames:[2, 7, 12, 17]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-lila-nw',
        frames: this.anims.generateFrameNumbers('lilaEnemy', {frames:[3, 8, 13, 18]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-lila-sw',
        frames: this.anims.generateFrameNumbers('lilaEnemy', {frames:[4, 9, 14, 19]}),
        frameRate: 7,
        repeat: -1
    });

    // -----------------------------------------------------------------------------------
    // Green Enemy Animations
    this.anims.create({
        key: 'enemy-red-n',
        frames: this.anims.generateFrameNumbers('redEnemy', {frames:[0, 5, 10, 15]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-red-s',
        frames: this.anims.generateFrameNumbers('redEnemy', {frames:[1, 6, 11, 16]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-red-w',
        frames: this.anims.generateFrameNumbers('redEnemy', {frames:[2, 7, 12, 17]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-red-nw',
        frames: this.anims.generateFrameNumbers('redEnemy', {frames:[3, 8, 13, 18]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-red-sw',
        frames: this.anims.generateFrameNumbers('redEnemy', {frames:[4, 9, 14, 19]}),
        frameRate: 7,
        repeat: -1
    });

    // -----------------------------------------------------------------------------------
    // Red Enemy Animations
    this.anims.create({
        key: 'enemy-green-n',
        frames: this.anims.generateFrameNumbers('greenEnemy', {frames:[0, 5, 10, 15]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-green-s',
        frames: this.anims.generateFrameNumbers('greenEnemy', {frames:[1, 6, 11, 16]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-green-w',
        frames: this.anims.generateFrameNumbers('greenEnemy', {frames:[2, 7, 12, 17]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-green-nw',
        frames: this.anims.generateFrameNumbers('greenEnemy', {frames:[3, 8, 13, 18]}),
        frameRate: 7,
        repeat: -1
    });

    this.anims.create({
        key: 'enemy-green-sw',
        frames: this.anims.generateFrameNumbers('greenEnemy', {frames:[4, 9, 14, 19]}),
        frameRate: 7,
        repeat: -1
    });

    let playerBullets = [new Bullets(this, 350, 400, 100, 'red'), new Bullets(this, 350, 400, 100, 'blue'), new Bullets(this, 350, 400, 100, 'green')];
    player = new MainCharacter(this, 100, 450, 200, 700, playerBullets);
    
    this.enemies = [new Enemy(this, player.getEntity(), 100, 100, 30, 200, 700, 'blue', new Bullets(this, 200, 700, 40, 'green'))];
    this.enemies.push(new Enemy(this, player.getEntity(), 400, 400, 70, 200, 700, 'blue', new Bullets(this, 200, 700, 40, 'green')));

    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), treelayer);
    this.physics.add.collider(player.getEntity(), portallayer, enterRoom2, null, this);

    treelayer.setCollisionByProperty({collides:true});
    portallayer.setCollisionByProperty({teleports:true});


    function enterRoom2() {
        if (this.enemies.length === 0) {
            this.scene.start(room2);
            room2.get = player.entity.health;
        }
    }

    for(let i = 0; i < this.enemies.length; i++)
    {
        console.log(this.enemies[i]);
        for(let j = 0; j < this.enemies.length; j++)
        {
            this.physics.add.collider(this.enemies[i].getEntity(), this.enemies[j].getEntity());
        }

        this.physics.add.collider(player.getEntity(), this.enemies[i].getEntity());
        for(let j = 0; j < player.bullets.length; j++)
        {
            this.physics.add.overlap(player.bullets[j], this.enemies[i].getEntity(), calcDamage, null, this);
        }
        this.physics.add.overlap(this.enemies[i].bullet, player.getEntity(), calcDamage, null, this);
        
        this.physics.add.collider(this.enemies[i].bullet, treelayer, bulletHitObstacles, null, this);
        this.physics.add.collider(this.enemies[i].getEntity(), treelayer);
    }

    for(let i = 0; i < player.bullets.length; i++)
    {
            this.physics.add.collider(player.bullets[i], treelayer, bulletHitObstacles, null, this);
    }
    
    
    let background = this.sound.add("background", {volume: 0.1});
    background.play();

    gameoverText = gameScene.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    roomText = gameScene.add.text(16, 16, "Room 1", {fontSize: "16px", fill: "#000"}, {font: "Glass TTY VT220"});
    portalText = gameScene.add.text(200, 18, "Neutralize all enemies and enter portal to resume", {fontSize: "16px", fill: "#000"});
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
        let gotshot = this.sound.add("hitsound", {volume: 0.1}, { loop: false});
        gotshot.play();

        if(character.dead())
        {
            for(let i = 0; i < this.enemies.length; i++)
            {
                if(this.enemies[i].getEntity() === character)
                {
                    this.enemies[i].healthBar();
                    this.enemies[i].entity = null;
                    this.enemies.splice(i,1);
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