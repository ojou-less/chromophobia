let room4 = new Phaser.Scene('room4');
let room4Text;
let gameoverTextRoom4;


room4.preload = function()
{
    
    // -----------------------------------------------------------------------------------
    // Loading Audio Assests
    this.load.audio("gameover", "assets/audios/dyingsound.mp3");
    this.load.audio("elevator", "assets/audios/Elevator-music.mp3");
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
    

    let playerBullets = [new Bullets(this, 200, 200, 50, 'red'), new Bullets(this, 400, 200, 300, 'blue'), new Bullets(this, 600, 500, 150, 'green')];
    player = new MainCharacter(this, 100, 450, 200, this.get, playerBullets);
    
    this.enemies = []; //[new Enemy(this, player.getEntity(), 100, 100, 70, 200, 200, 'blue', new Bullets(this, 200, 700, 40, 'red'))];
    //this.enemies.push(new Enemy(this, player.getEntity(), 400, 400, 70, 200, 200, 'blue', new Bullets(this, 200, 700, 40, 'red')));

    this.sound.stopByKey('background');
    let background = this.sound.add("elevator", {volume: 0.3});
    background.play();

    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), healingfountainlayer, healPlayer, null, this);
    this.physics.add.collider(player.getEntity(), portallayer, enterRoom5, null, this);

    healingfountainlayer.setCollisionByProperty({heals:true});
    portallayer.setCollisionByProperty({teleports:true});


    function enterRoom5(){
        if (this.enemies.length === 0) {
          this.scene.start(room5);
          room5.get = player.entity.health;
        }
    }

    function healPlayer(){
        if(player.healthMax > player.entity.health )
        {
            player.entity.health += 2;
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
        
        this.physics.add.collider(this.enemies[i].bullet, healingfountainlayer, bulletHitObstacles, null, this);
        this.physics.add.collider(this.enemies[i].getEntity(), healingfountainlayer);
    }

    for(let i = 0; i < player.bullets.length; i++)
    {
            this.physics.add.collider(player.bullets[i], healingfountainlayer, bulletHitObstacles, null, this);
    }

    roomtext = this.add.text(16, 16, "Room4 Room", {fontSize: "16px", fill: "#000"});
    gameoverText = this.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    gameoverText.setOrigin(0.5);
    gameoverText.setVisible(false);
}

    
room4.update = function() 
{
    player.movement();
    for(let i = 0; i < this.enemies.length; i++)
    {
        this.enemies[i].update();
    }
}
