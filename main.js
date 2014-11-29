// Define our main state
var main = {
  preload: function() {
    // This function will be executed at the beginning     
    // That's where we load the game's assets  

    game.load.image('player', 'assets/player.png');
    game.load.image('brick', 'assets/brick.png');

  },

  create: function() { 
    // This function is called after the preload function     
    // Here we set up the game, display sprites, etc. 
    // Initialize the physics system of the game
    game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create a variable to handle the arrow keys
    this.cursor = game.input.keyboard.createCursorKeys();

    // Create the player at the bottom of the screen
    this.player = game.add.sprite(200, 400, 'player');

    // Enable the physics system for the player
    game.physics.arcade.enable(this.player);

    //make the player not able to go off screen
    this.player.body.collideWorldBounds = true;

    // Create a group that will contain all the bricks
    this.bricks = game.add.group();
    this.bricks.enableBody = true;

    // Create the 16 bricks
    for (var i = 0; i < 5; i++)
      for (var j = 0; j < 5; j++)
        game.add.sprite(80+i*60, 55+j*35, 'brick', 0, this.bricks);

    // Make sure that the bricks won't move
    //this.bricks.setAll('body.immovable', true);
    this.bricks.setAll('body.collideWorldBounds', true);

  },

  update: function() {
    // This function is called 60 times per second    
    // It contains the game's logic 

    // If the right arrow is pressed, move the player to the right
    var speed = 200;

    if (this.cursor.right.isDown) 
      this.player.body.velocity.x = speed;

    // If the left arrow if pressed, move left
    else if (this.cursor.left.isDown) 
      this.player.body.velocity.x = -speed;

    else if (this.cursor.up.isDown)
      this.player.body.velocity.y = -speed;

    else if(this.cursor.down.isDown)
      this.player.body.velocity.y = speed;
    // If no arrow is pressed, stop moving
    else 
    {
      this.player.body.velocity.x = 0;  
      this.player.body.velocity.y = 0;
    }  


    //detect player touching bricks
    game.physics.arcade.collide(this.player, this.bricks, this.hit, null, this);

    //bricks bounch of each other
    game.physics.arcade.collide(this.bricks, this.bricks, null, null, this);
  },

  hit: function(player, brick) {
    // When the player hits a brick, kill the brick
    //
    //brick.kill();

    //update the score, etc..
}

};

// Initialize Phaser, and start our 'main' state 
var game = new Phaser.Game(450, 450, Phaser.AUTO, 'gameDiv');
game.state.add('main', main);
game.state.start('main');