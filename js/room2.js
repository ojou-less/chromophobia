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
    

    let playerBullets = [new Bullets(this, 200, 200, 50, 'red'), new Bullets(this, 50, 200, 300, 'blue'), new Bullets(this, 600, 500, 150, 'green')];
    player = new MainCharacter(this, 100, 450, 200, this.get, playerBullets);
    
    this.enemies = [new Enemy(this, player.getEntity(), 100, 100, 70, 200, 200, 'blue', new Bullets(this, 200, 700, 40, 'red'))];
    this.enemies.push(new Enemy(this, player.getEntity(), 400, 400, 70, 200, 200, 'blue', new Bullets(this, 200, 700, 40, 'red')));


    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), treelayer);
    this.physics.add.collider(player.getEntity(), portallayer, enterRoom3, null, this);

    treelayer.setCollisionByProperty({collides:true});
    portallayer.setCollisionByProperty({teleports:true});



    function enterRoom3()
    {
     //   if (this.enemies.length === 0) {
            this.scene.start(room3);
            room3.get = player.entity.health;
    //    }
    }

    for(let i = 0; i < this.enemies.length; i++)
    {
        console.log(this.enemies[i]);
        for(let j = 0; j < this.enemies.length; j++)
        {
            this.physics.add.collider(this.enemies[i].entity, this.enemies[j].entity);
        }

        this.physics.add.collider(player.getEntity(), this.enemies[i].entity);
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
    
    roomText = this.add.text(16, 16, "Room2 Room", {fontSize: "16px", fill: "#000"});
    gameoverText = this.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    gameoverText.setOrigin(0.5);
    gameoverText.setVisible(false);
}
    
room2.update = function() 
{
    player.movement();
    for(let i = 0; i < this.enemies.length; i++)
    {
        this.enemies[i].update();
    }
}
