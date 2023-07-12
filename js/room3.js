let room3 = new Phaser.Scene('room3');
let room3Text;
let gameoverTextRoom3;


room3.preload = function()
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
    this.load.image("tiles3", "assets/images/tundra_.png");
    this.load.image("tiles3_resources", "assets/images/tundra_resources.png");
    this.load.image("tiles3_fences", "assets/images/tundra_fencesAndWalls.png");
    this.load.tilemapTiledJSON("map3", "assets/json/chromophobia_room3.json");

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

    
room3.create = function()
{
    
    const map = this.make.tilemap({
        key: "map3",        //ändern auf map3 und den rest des ganzen
        tileWidth: 16,
        tileHeight: 16
    });

    const tileset = map.addTilesetImage("tundra_", "tiles3");
    const treetiles = map.addTilesetImage("tundra_ [resources]", "tiles3_resources");
    const fencetiles = map.addTilesetImage("tundra_ [fencesAndWalls]", "tiles3_fences");
    const bglayer = map.createLayer("Background", tileset, 0, 0);
    const treelayer = map.createLayer("Obstacles", treetiles, 0, 0);
    const fencelayer = map.createLayer("Fences", fencetiles, 0, 0);
    const portallayer = map.createLayer("Portal", tileset, 0, 0);
    

    cursors = this.input.keyboard.createCursorKeys();
    player = new MainCharacter(this, 100, 450, 200, 400, new Bullets(this, 400, 200, 50, 'white'));
    enemies = new Enemy(this, player.getEntity(), 100, 100, 100, 300, 200, 'blue', new Bullets(this, 200, 500, 50, 'red'));
    //console.log(player);


    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), treelayer);
    this.physics.add.collider(player.getEntity(), fencelayer);
    this.physics.add.collider(player.getEntity(), portallayer, enterRoom4, null, this);

    fencelayer.setCollisionByProperty({collides:true});
    treelayer.setCollisionByProperty({collides:true});
    portallayer.setCollisionByProperty({teleports:false});


    function enterRoom4(){
        this.scene.start(room4);
        console.log("bruh");
    }

    this.physics.add.collider(player.getEntity(), enemies.getEntity());

    this.physics.add.overlap(player.bullet, enemies.getEntity(), test2, null, this);
    this.physics.add.overlap(enemies.bullet, player.getEntity(), test2, null, this);
    

    room3Text = room3.add.text(16, 16, "Room3 Room", {fontSize: "16px", fill: "#000"});
    gameoverTextRoom3 = room3.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    gameoverTextRoom3.setOrigin(0.5);
    gameoverTextRoom3.setVisible(false);
}

function test2(character, bullet)
{
    if(bullet.active)
    {
        console.log("Scene 3");
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
    
room3.update = function() 
{
    player.movement();
    enemies.update();
}