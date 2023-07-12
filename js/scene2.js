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
    const map = this.make.tilemap({
        key: "map1",
        tileWidth: 16,
        tileHeight: 16
    });

    const tileset = map.addTilesetImage("forest_", "tiles1");
    const treetiles = map.addTilesetImage("forest_ [resources]", "tiles1_resources");
    const bglayer = map.createLayer("Background", tileset, 0, 0);
    const treelayer = map.createLayer("Trees", treetiles, 0, 0);
    

    cursors = this.input.keyboard.createCursorKeys();
    player = new MainCharacter(this, 100, 450, 200, 400, new Bullets(this, 400, 200, 50, 'white'));
    enemies = new Enemy(this, player.getEntity(), 100, 100, 100, 300, 200, 'blue', new Bullets(this, 200, 500, 50, 'red'));
    


    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), treelayer);
    

    treelayer.setCollisionByProperty({collides:true});
    bglayer.setTileIndexCallback([39, 40, 41, 61, 62, 63, 83, 84, 85], ()=>{
        console.log("portal betreten");
    });


    this.input.keyboard.on("keydown-A", () => {
        //gameScene.preload();

        this.scene.start(gameScene);
    });

    this.physics.add.collider(player.getEntity(), enemies.getEntity());

    this.physics.add.overlap(player.bullet, enemies.getEntity(), test2, null, this);
    this.physics.add.overlap(enemies.bullet, player.getEntity(), test2, null, this);
    

    room1Text = room1.add.text(16, 16, "Room1 Room", {fontSize: "16px", fill: "#000"});
    gameoverText = room1.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {fontSize: "30px", fill: "#000"});
    gameoverText.setOrigin(0.5);
    gameoverText.setVisible(false);
}
/*
function test2(character, bullet)
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
*/


    
room1.update = function() 
{
    player.movement();
    enemies.update();
}
