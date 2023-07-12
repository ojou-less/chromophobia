let room4 = new Phaser.Scene('room4');
let room4Text;
let gameoverTextRoom4;


room4.preload = function()
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
    this.load.image("tiles4", "assets/images/desert_.png");
    this.load.image("tiles4_resources", "assets/images/desert_fountain.png");
    this.load.tilemapTiledJSON("map4", "assets/json/chromophobia_room4.json");

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

    
room4.create = function()
{
    
    const map = this.make.tilemap({
        key: "map4",        //ändern auf map3 und den rest des ganzen
        tileWidth: 16,
        tileHeight: 16
    });

    const tileset = map.addTilesetImage("desert_", "tiles4");
    const treetiles = map.addTilesetImage("desert_ [fountain]", "tiles4_resources");
    const bglayer = map.createLayer("Background", tileset, 0, 0);
    const healingfountainlayer = map.createLayer("Fountain", treetiles, 0, 0);
    const portallayer = map.createLayer("Portal", tileset, 0, 0);
    

    cursors = this.input.keyboard.createCursorKeys();
    player = new MainCharacter(this, 100, 450, 200, 400, new Bullets(this, 400, 200, 50, 'white'));
    // enemies = new Enemy(this, player.getEntity(), 100, 100, 100, 300, 200, 'blue', new Bullets(this, 200, 500, 50, 'red'));
    //console.log(player);


    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), healingfountainlayer, healPlayer, null, this);
    this.physics.add.collider(player.getEntity(), portallayer, enterRoom5, null, this);

    healingfountainlayer.setCollisionByProperty({heals:true});
    portallayer.setCollisionByProperty({teleports:true});


    function enterRoom5(){
        gameScene.preload();
        if (this.enemies.length === 0) {

            this.scene.start(gameScene);
        }
    }

    function healPlayer(){
        console.log("healing player...");
    }

    this.physics.add.collider(player.getEntity(), enemies.getEntity());

    this.physics.add.overlap(player.bullet, enemies.getEntity(), test2, null, this);
    this.physics.add.overlap(enemies.bullet, player.getEntity(), test2, null, this);
    

    room4Text = room4.add.text(16, 16, "Room4 Room", {fontSize: "16px", fill: "#000"});
    gameoverTextRoom4 = room4.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    gameoverTextRoom4.setOrigin(0.5);
    gameoverTextRoom4.setVisible(false);
}

function test2(character, bullet)
{
    if(bullet.active)
    {
        console.log("Scene 4");
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
    
room4.update = function() 
{
    player.movement();
    // enemies.update();
}
