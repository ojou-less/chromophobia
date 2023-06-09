let room5 = new Phaser.Scene('room5');
let room5Text;
let winTextRoom5;
let counter = 0;

room5.preload = function()
{
    console.log(this.get);
    // -----------------------------------------------------------------------------------
    // Loading Audio Assests
    this.load.audio("lavaBackground", "assets/audios/lava.wav");
    this.load.audio("winningSound", "assets/audios/win.mp3");

    // -----------------------------------------------------------------------------------
    // Loading Image Assests
    this.load.image("tiles5", "assets/images/cave_.png");
    this.load.tilemapTiledJSON("map5", "assets/json/chromophobia_room5.json");

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

    
room5.create = function() {

    const map = this.make.tilemap({
        key: "map5",        //ändern auf map3 und den rest des ganzen
        tileWidth: 16,
        tileHeight: 16
    });

    const tileset = map.addTilesetImage("cave_", "tiles5");
    const bglayer = map.createLayer("Background", tileset, 0, 0);
    const lavapitlayer = map.createLayer("Obstacles", tileset, 0, 0);
    const portallayer = map.createLayer("Portal", tileset, 0, 0);


    let playerBullets = [new Bullets(this, 350, 400, 100, 'red'), new Bullets(this, 350, 400, 100, 'blue'), new Bullets(this, 350, 400, 100, 'green')];
    player = new MainCharacter(this, 100, 450, 200, this.get, playerBullets);

    this.enemies = [new Enemy(this, player.getEntity(), 100, 100, 70, 200, 1000, 'green', new Bullets(this, 200, 2000, 100, 'red'))];
    this.enemies.push(new Enemy(this, player.getEntity(), 400, 400, 70, 200, 1000, 'red', new Bullets(this, 200, 2000, 100, 'blue')));
    this.enemies.push(new Enemy(this, player.getEntity(), 450, 200, 70, 200, 1000, 'blue', new Bullets(this, 200, 2000, 100, 'green')));



    this.physics.add.collider(player.getEntity(), bglayer);
    this.physics.add.collider(player.getEntity(), lavapitlayer, lavaKill, null, this);
    this.physics.add.collider(player.getEntity(), portallayer, enterRoom5, null, this);

    lavapitlayer.setCollisionByProperty({collides: true});
    portallayer.setCollisionByProperty({teleports: true});

    function lavaKill() {
        if (player.entity.health - 4 > 0) {
            player.entity.health -= 4;
        }
        console.log(player.entity.health);
    }


    function enterRoom5() {
        console.log("wann gibts endlich room 5 >:(");
    }

    for (let i = 0; i < this.enemies.length; i++) {
        console.log(this.enemies[i]);
        for (let j = 0; j < this.enemies.length; j++) {
            this.physics.add.collider(this.enemies[i].getEntity(), this.enemies[j].getEntity());
        }

        this.physics.add.collider(player.getEntity(), this.enemies[i].getEntity());
        for (let j = 0; j < player.bullets.length; j++) {
            this.physics.add.overlap(player.bullets[j], this.enemies[i].getEntity(), calcDamage, null, this);
        }
        this.physics.add.overlap(this.enemies[i].bullet, player.getEntity(), calcDamage, null, this);

        this.physics.add.collider(this.enemies[i].getEntity(), lavapitlayer);
    }


    roomText = this.add.text(16, 16, "Room 5", {fontSize: "16px", fill: "#000"}, {font: "Glass TTY VT220"});
    gameoverText = this.add.text(400, 300, "Game Over!\nPlease click into the field to restart", {
        fontSize: "30px",
        fill: "#000"
    });
    gameoverText.setOrigin(0.5);
    gameoverText.setVisible(false);
    winTextRoom5 = this.add.text(400, 300, "Congratulations you beat the game!\nPlease click into the field to restart", {
        fontSize: "30px",
        fill: "#000"
    });
    winTextRoom5.setOrigin(0.5);
    winTextRoom5.setVisible(false);

    this.sound.stopByKey('elevator');
    let lava = this.sound.add("lavaBackground", {volume: 1});
    lava.play();
    }

    room5.update = function () {
        player.movement();
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].update();
        }
        if (this.enemies.length === 0) {
            if (counter === 0) {
                this.physics.pause();
                winTextRoom5.setVisible(true);
                let winningSound = this.sound.add("winningSound", {volume: 1}, {loop: false});
                this.sound.stopAll();
                console.log(winningSound);
                winningSound.play();
                counter += 1;
                this.input.on('pointerdown', () => {
                    location.reload();
                });
            }
    }
}
