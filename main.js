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

    //Set the world (global) gravity
    //game.physics.arcade.gravity.x = 0;
    //game.physics.arcade.gravity.y = 0;

        // Create a variable to handle the arrow keys
    this.cursor = game.input.keyboard.createCursorKeys();
    
    // Create the goal 
    this.goal = game.add.sprite(
      this.tileToPixels(7), 
      this.tileToPixels(1),
      'goal');
    
    // Create the player
    this.player = game.add.sprite(
      this.tileToPixels(1), 
      this.tileToPixels(1), 
      'player');

    // Enable the physics system for the player
    game.physics.arcade.enable(this.player);

    //make the player not able to go off screen
    this.player.body.collideWorldBounds = true;

    // Create a group that will contain all the targets
    this.targets = game.add.group();
    this.targets.enableBody = true;

    // Create 16 targets
    //for (var i = 0; i < 5; i++)
    //  for (var j = 0; j < 5; j++)
    //    game.add.sprite(0 + (i * 60), 0 + (j * 35), 'target', 0, this.targets);

    //create a single target
    var target = game.add.sprite(
      this.tileToPixels(4), 
      this.tileToPixels(1), 
      'target', 0, this.targets);

    //enable physics for this and set some drag so it doesn't
    //slide around forever
    game.physics.arcade.enable(target);
    target.body.drag.x = 10;
    target.body.drag.y = 10;

    // Make sure that the targets won't move
    //this.targets.setAll('body.immovable', true);
    this.targets.setAll('body.collideWorldBounds', true);


  },

  update: function() {
    // This function is called 60 times per second    
    // It contains the game's logic 

    if (this.cursor.right.isDown) 
      this.player.body.velocity.x = this.playerSpeed;
    else if (this.cursor.left.isDown) 
      this.player.body.velocity.x = -this.playerSpeed;
    else
      this.player.body.velocity.x = 0;


    if (this.cursor.up.isDown)
      this.player.body.velocity.y = -this.playerSpeed;
    else if(this.cursor.down.isDown)
      this.player.body.velocity.y = this.playerSpeed;
    else 
      this.player.body.velocity.y = 0;
    


    //detect player touching targets
    game.physics.arcade.collide(this.player, this.targets, this.hit, null, this);
  },

  render: function(){

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
  }

};

// Initialize Phaser, and start our 'main' state 
var game = new Phaser.Game(320, 320, Phaser.AUTO, 'gameDiv');
game.state.add('main', main);
game.state.start('main');



