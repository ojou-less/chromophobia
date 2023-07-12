let room2 = new Phaser.Scene('room2');
let room1Text;
let gameoverTextRoom1;


room2.preload = function()
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
    this.load.image("tiles2", "assets/images/swamp_.png");
    this.load.image("tiles2_resources", "assets/images/swamp_resources.png");
    this.load.tilemapTiledJSON("map2", "assets/json/chromophobia_room2.json");

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

    
room2.create = function()
{
    
    const map = this.make.tilemap({
        key: "map2",
        tileWidth: 16,
        tileHeight: 16
    });

    const tileset = map.addTilesetImage("swamp_", "tiles2");
    const treetiles = map.addTilesetImage("swamp_ [resources]", "tiles2_resources");
    const bglayer = map.createLayer("Background", tileset, 0, 0);
    const treelayer = map.createLayer("Obstacles", treetiles, 0, 0);
    const portallayer = map.createLayer("Portal", tileset, 0, 0);
    

    // -----------------------------------------------------------------------------------
    // Player Animations
    /*
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
    */

    cursors = this.input.keyboard.createCursorKeys();
    player = new MainCharacter(this, 100, 450, 200, 400, new Bullets(this, 400, 200, 50, 'white'));
    enemies = new Enemy(this, player.getEntity(), 100, 100, 100, 300, 200, 'blue', new Bullets(this, 200, 500, 50, 'red'));
    //console.log(player);


    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), treelayer);
    this.physics.add.collider(player.getEntity(), portallayer, enterRoom3, null, this);

    treelayer.setCollisionByProperty({collides:true});
    portallayer.setCollisionByProperty({teleports:true});


    function enterRoom3(){
        this.scene.start(room3);
    }

    this.physics.add.collider(player.getEntity(), enemies.getEntity());

    this.physics.add.overlap(player.bullet, enemies.getEntity(), test2, null, this);
    this.physics.add.overlap(enemies.bullet, player.getEntity(), test2, null, this);
    

    room1Text = room2.add.text(16, 16, "Room1 Room", {fontSize: "16px", fill: "#000"});
    gameoverTextRoom1 = room2.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    gameoverTextRoom1.setOrigin(0.5);
    gameoverTextRoom1.setVisible(false);
}

function test2(character, bullet)
{
    if(bullet.active)
    {
        console.log("Scene 2");
        character.hit(bullet.damage, bullet.color);
        let gotshot = this.sound.add("hitsound", {volume: 0.01}, { loop: false});
        gotshot.play();
        if(enemies.getEntity() === character)
        {
            console.log("nice");
        }
        console.log(enemies);
        console.log(character);
        character.dead();
    }
    bullet.setActive(false);
    bullet.setVisible(false);
    console.log(character.health);

}


    
room2.update = function() 
{
    player.movement();
    enemies.update();
}
