let room1 = new Phaser.Scene('room1');
let room1Text;
//let gameoverTextRoom1;


room1.preload = function()
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

    
room1.create = function()
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

    ///cursors = this.input.keyboard.createCursorKeys();
    let playerBullets = [new Bullets(this, 200, 200, 50, 'red'), new Bullets(this, 50, 200, 300, 'blue'), new Bullets(this, 600, 500, 150, 'green')]
    player = new MainCharacter(this, 100, 450, 200, 400, playerBullets);
    
    this.enemies = [new Enemy(this, player.getEntity(), 300, 200, 70, 200, 200, 'blue', new Bullets(this, 200, 700, 40, 'red'))];
    this.enemies.push(new Enemy(this, player.getEntity(), 600, 700, 70, 200, 200, 'blue', new Bullets(this, 200, 700, 40, 'red')));

    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), treelayer);

    treelayer.setCollisionByProperty({collides:true});
    bglayer.setTileIndexCallback([39, 40, 41, 61, 62, 63, 83, 84, 85], ()=>{
        console.log("portal betreten");
    });

    this.input.keyboard.on("keydown-A", () =>{
        
        this.scene.start(gameScene);
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

    roomText = this.add.text(16, 16, "Room 2", {fontSize: "16px", fill: "#000"});
    
    gameoverText = this.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    gameoverText.setOrigin(0.5);
    gameoverText.setVisible(false);
}
    
room1.update = function() 
{
    player.movement();

    for(let i = 0; i < this.enemies.length; i++)
    {
        this.enemies[i].update();
    }
}
