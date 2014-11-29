// Define our main state
var main = {

  tileSize: 32,
  tilesWide: 10,
  tilesHigh: 10,
  playerSpeed: 60,


  preload: function() {
    // This function will be executed at the beginning     
    // That's where we load the game's assets  

    game.load.image('player', 'assets/player.png');
    game.load.image('target', 'assets/target.png');
    game.load.image('goal', 'assets/goal.png');

  },

  create: function() { 
    // This function is called after the preload function     
    // Here we set up the game, display sprites, etc. 
    // Initialize the physics system of the game
    game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create a variable to handle the arrow keys
    this.cursor = game.input.keyboard.createCursorKeys();

    // Create the player
    this.player = game.add.sprite(
      this.tileToPixels(1), 
      this.tileToPixels(1), 
      'player');

    this.player.gridx = 1;
    this.player.gridy = 1;

    console.log("Created player at: " + this.player.x + ", " + this.player.y);

    // Create the goal 
    this.goal = game.add.sprite(
      this.tileToPixels(7), 
      this.tileToPixels(1),
      'goal');

    // Enable the physics system for the player
    game.physics.arcade.enable(this.player);

    //make the player not able to go off screen
    this.player.body.collideWorldBounds = true;

    //set/create this property
    this.player.waypoint = new Phaser.Point(
      this.player.x,
      this.player.y
    );



    this.player.isMoving = false;

    // Create a group that will contain all the targets
    this.targets = game.add.group();
    this.targets.enableBody = true;

    // Create 16 targets
    //for (var i = 0; i < 5; i++)
    //  for (var j = 0; j < 5; j++)
    //    game.add.sprite(0 + (i * 60), 0 + (j * 35), 'target', 0, this.targets);

    //create a single target
    game.add.sprite(
      this.tileToPixels(4), 
      this.tileToPixels(1), 
      'target', 0, this.targets);

    // Make sure that the targets won't move
    //this.targets.setAll('body.immovable', true);
    this.targets.setAll('body.collideWorldBounds', true);


  },

  update: function() {
    // This function is called 60 times per second    
    // It contains the game's logic 

    // If the right arrow is pressed, move the player to the right
    var speed = 200;

    if (this.cursor.right.isDown) 
      //this.player.body.velocity.x = speed;
      this.movePlayer(1, 0);

    // If the left arrow if pressed, move left
    else if (this.cursor.left.isDown) 
      //this.player.body.velocity.x = -speed;
      this.movePlayer(-1, 0);

    else if (this.cursor.up.isDown)
      //this.player.body.velocity.y = -speed;
      this.movePlayer(0, -1);

    else if(this.cursor.down.isDown)
      //this.player.body.velocity.y = speed;
      this.movePlayer(0, 1);
    
    // If no arrow is pressed, stop moving
    else 
    {
      this.player.body.velocity.x = 0;  
      this.player.body.velocity.y = 0;
    }  


    //detect player touching bricks
    game.physics.arcade.collide(this.player, this.targets, this.hit, null, this);
  },

  render: function(){
    //console.log("Player   X: " + this.player.x + " Y: " + this.player.y);
    //console.log("Waypoint X: " + this.player.waypoint.x + " Y: " + this.player.waypoint.y);

    //waypoint is LEFT
    if (this.player.waypoint.x < this.player.x) { 
      this.player.body.velocity.x = -this.playerSpeed;
      this.player.isMoving = true;
    };

    //waypoint is RIGHT
    if (this.player.waypoint.x > this.player.x) { 
      this.player.body.velocity.x = this.playerSpeed;
      this.player.isMoving = true;
    };

    //at X waypoint
    if (Math.abs(this.player.waypoint.x - this.player.x) <= 3) { 
      this.player.body.velocity.x = 0;
      this.player.body.x = this.player.waypoint.x;
      this.player.isMoving = false;
      //console.log("reached destination x");
    };

    //waypoint is UP
    if (this.player.waypoint.y < this.player.y) { 
      this.player.body.velocity.y = -this.playerSpeed;
      this.player.isMoving = true;
    };

    //waypoint is DOWN
    if (this.player.waypoint.y > this.player.y) { 
      this.player.body.velocity.y = this.playerSpeed;
      this.player.isMoving = true;
    };

    //AT Y waypoint
    if (Math.abs(this.player.waypoint.y - this.player.y) <= 3) { 
      this.player.body.velocity.y = 0;
      this.player.body.y = this.player.waypoint.y;
      this.player.isMoving = false;
      //console.log("reached destination y");
    };


  },

  hit: function(player, target) {
    // When the player hits a target, kill the target
    //
    //target.kill();

    //update the score, etc..
  },

  tileToPixels: function(tile)
  {
    tile = parseInt(tile);
    return parseInt(tile * this.tileSize);
  },

  movePlayer: function(tilex, tiley){
    // Because we're adding 32 to the player's position, we need to prevent cases where the user tries to move
    // the player mid-move, knocking it off the grid. This is a crude way to do it but it works.
    
    if (this.player.isMoving) { return; }

    this.player.isMoving = true;

    this.player.gridx += tilex;
    this.player.gridy += tiley;


    this.player.gridx = Phaser.Math.clamp(this.player.gridx, 0, this.tilesWide);
    this.player.gridy = Phaser.Math.clamp(this.player.gridy, 0, this.tilesHigh);


    var waypoint = new Phaser.Point(
      this.tileToPixels(this.player.gridx),
      this.tileToPixels(this.player.gridy)
    );

    this.player.waypoint = waypoint;
    
    console.log("moving to waypoint:");
    console.log("x: " + waypoint.x + "  y: " + waypoint.y);

    console.log("target player grid position:");
    console.log("x: " + this.player.gridx + "  y: " + this.player.gridy);

    return;


    ///////////////////////////////////////////////////////////////////
    /////OLD positioning code worked nice, but no more collisions...
    ///////////////////////////////////////////////////////////////////

    
    this.player.isMoving = true;
    
    // Tween the player to the next grid space over 250ms, and when done, allow the player to make another move
    game.add
      .tween(this.player)
      .to(
        {
          x: this.player.x + x * this.tileSize, 
          y: this.player.y + y * this.tileSize
        }, 
        250, 
        Phaser.Easing.Quadratic.InOut, 
        true
        )
      .onComplete.add(function(){ 
       this.player.isMoving = false;
      }
      , this);
  }

};

// Initialize Phaser, and start our 'main' state 
var game = new Phaser.Game(320, 320, Phaser.AUTO, 'gameDiv');
game.state.add('main', main);
game.state.start('main');



