let room3 = new Phaser.Scene('room3');
let room3Text;
let gameoverTextRoom3;


room3.preload = function()
{
    
    // -----------------------------------------------------------------------------------
    // Loading Audio Assests
    this.load.audio("backgroundSnow", "assets/audios/winterBackgroundNoFootsteps.wav");

    // -----------------------------------------------------------------------------------
    // Loading Image Assests
    this.load.image("tiles3", "assets/images/tundra_.png");
    this.load.image("tiles3_resources", "assets/images/tundra_resources.png");
    this.load.image("tiles3_fences", "assets/images/tundra_fencesAndWalls.png");
    this.load.tilemapTiledJSON("map3", "assets/json/chromophobia_room3.json");


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
    

    let playerBullets = [new Bullets(this, 200, 200, 50, 'red'), new Bullets(this, 400, 200, 300, 'blue'), new Bullets(this, 600, 500, 150, 'green')];
    player = new MainCharacter(this, 100, 450, 200, this.get, playerBullets);
    
    this.enemies = [new Enemy(this, player.getEntity(), 100, 100, 70, 200, 200, 'blue', new Bullets(this, 200, 700, 40, 'red'))];
    this.enemies.push(new Enemy(this, player.getEntity(), 400, 400, 70, 200, 200, 'blue', new Bullets(this, 200, 700, 40, 'red')));

    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), treelayer);
    this.physics.add.collider(player.getEntity(), fencelayer);
    this.physics.add.collider(player.getEntity(), portallayer, enterRoom4, null, this);

    fencelayer.setCollisionByProperty({collides:true});
    treelayer.setCollisionByProperty({collides:true});
    portallayer.setCollisionByProperty({teleports:false});

    this.sound.stopByKey('background');
    let backgroundSnow = this.sound.add("backgroundSnow", {volume: 0.3});
    backgroundSnow.play();

    function enterRoom4(){
        if (this.enemies.length === 0) {
            this.scene.start(room4);
            room4.get = player.entity.health;
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

    roomtext = this.add.text(16, 16, "Room3 Room", {fontSize: "16px", fill: "#000"});
    gameoverText = this.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    gameoverText.setOrigin(0.5);
    gameoverText.setVisible(false);
}
    
room3.update = function() 
{
  //  console.log(player.entity.getVelocity());

    player.movement();
    for(let i = 0; i < this.enemies.length; i++)
    {
        this.enemies[i].update();
    }
}
