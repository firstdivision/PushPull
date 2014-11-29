// Define our main state
var main = {

  tileSize: 32,
  tilesWide: 10,
  tilesHigh: 10,


  preload: function() {
    // This function will be executed at the beginning     
    // That's where we load the game's assets  

    game.load.image('player', 'assets/player.png');
    game.load.image('target', 'assets/target.png');

  },

  create: function() { 
    // This function is called after the preload function     
    // Here we set up the game, display sprites, etc. 
    // Initialize the physics system of the game
    game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create a variable to handle the arrow keys
    this.cursor = game.input.keyboard.createCursorKeys();

    // Create the player at the bottom of the screen
    this.player = game.add.sprite(0, 0, 'player');

    // Enable the physics system for the player
    game.physics.arcade.enable(this.player);

    //make the player not able to go off screen
    this.player.body.collideWorldBounds = true;

    //set/create this property
    this.player.isMoving = false;

    // Create a group that will contain all the targets
    this.targets = game.add.group();
    this.targets.enableBody = true;

    // Create 16 targets
    //for (var i = 0; i < 5; i++)
    //  for (var j = 0; j < 5; j++)
    //    game.add.sprite(0 + (i * 60), 0 + (j * 35), 'target', 0, this.targets);

    //create a single brick
    game.add.sprite(
      this.tileSize * 5, 
      this.tileSize * 5, 
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

    //bricks bounch of each other
    game.physics.arcade.collide(this.bricks, this.targets, null, null, this);
  },

  render: function(){
  },

  hit: function(player, brick) {
    // When the player hits a brick, kill the brick
    //
    //brick.kill();

    //update the score, etc..
  },

  movePlayer: function(x, y){
    // Because we're adding 32 to the player's position, we need to prevent cases where the user tries to move
    // the player mid-move, knocking it off the grid. This is a crude way to do it but it works.
    if (this.player.isMoving) { return; }
    
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



