/*
Ga plugins
==========
Weclome to the `plugins.js` file!
This file contains lots of extra tools that are really useful for making games, 
but which are more specialized that than the universal tools in `ga.js` file. 

How can use these plugins? The easiest way is just to link this entire file 
with a `<script>` tag. Then you have immediate access to all this code 
and you can decide later what you really need. 

Your own custom plugins
-----------------------

If you wan to keep you game file size small, create 
your own custom plugins file. Here's how: 

1. Make a new JS file called `custom.js` (or an other name you want to give it.)
2. Add this:

    GA.custom = function(ga) {
      //Your own collection of plugins will go here
    };

3. Link `custom.js` to your game's main HTML document with a `<script>` tag.

4. Then just copy/paste any plugin functions from this 
file (`plugins.js`) into your own `custom.js` file. Like this:

    GA.custom = function(ga) {
      //Create a random number within a specific range
      ga.random = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
    };

The `GA.custom` function is called by Ga as soon as the engine has 
finished initializing, but before the game runs. This means you 
can use it to run any other custom setup task that you want to 
perform before any of the game code runs. You could also use the 
`GA.custom` function to overwrite any of Ga's default properties 
with your own. Go wild!

The plugins in this file
------------------------

The code in this `plugins.js` file is organized into chapters. 
Use your text editor's search features to find what you're looking for. 
Here's the table of contents to get you started:

### Chapter 1: Utilities

`move`: Make a sprite or group move (or an array of them) by updating its velocity.
`distance`: The distance in pixels between the center point of two sprites.
`ease`: Make a sprite ease to the position of another sprite.
`easeProperty`: Ease a single sprite property to another value.
`slide`: Ease a sprite to a specific position.
`fadeIn`: Fade in a sprite.
`fadeOut`: Fade out a sprite.
`follow`: Make a sprite follow another sprite at a fixed speed.
`rotateAround`: Make a sprite rotate around the center of another sprite.
`rotatePoint`: Make any x/y point rotate around any other point.
`angle`: Get the angle between the center points of two sprites
`random`: Generate a random number within a range.
`wait`: Wait for a certain number of milliseconds and then execute a callback function.

### Chapter 2: Tween methods for sprite and scene transitions

`slide`: Ease a sprite into a new position.
`yoyo`: Ease a sprite back and forth between two points, with optional delay.
`fadeIn`: Fade a sprite in.
`fadeOut`: Fade a sprite out.`
`removeTween`: Compeletely remove a tween from Ga's global `tweens` array.

### Chapter 3: Sprite creation tools

`shoot`: A function for making sprites shoot bullets.
`grid`: Easily plot a grid of sprites. Returns a container full of sprite `children`.
`progressBar`: A loading progress bar you can use to display while game assets are loading.`

### Chapter 4: Collision

#### Boundary collisions

`outsideBounds`: Tells you if a sprite has exceeded the boundary of another sprite or container.
`contain`: Contains a sprite inside another sprite. Optional bounce if the sprite hits the edges.

#### Shape collisions

`hitTestPoint`: Returns `true` or `false` if an x/y point is intersecting a rectangle or circle.
`hitTestCircle`: Returns `true` if any two circular sprites overlap.
`hitTestRectangle`: Returns `true` if any two rectangular sprites overlap.
`rectangleCollision`: Prevents two colliding rectangles from overlapping and tells you the collision side
`circleCollision`: Makes a moving circle bounce away from a stationary circle.
`movingCircleCollision`: Makes two moving circles bounce apart.
`multipleCircleCollision`: Bounce apart any two circles that are in the same array.
`bounceOffSurface`: A helper method that's use internally by these collision functions.

#### 2D tile-based collisions

... coming soon!

### Chapter 5: Sprite controllers

`keyControlFourWay`: Assign keyboard keys to make a sprite move at a fixed speed in 4 directions

*/

GA = GA || {};
GA.plugins = function(ga) {

  /*
  Chapter 1: Utilities
  --------------------
  */

  //### move
  //Move a sprite or an array of sprites by adding its
  //velocity to its position
  ga.move = function(sprites) {
    var s;
    if (sprites instanceof Array === false) {
      s = sprites;
      s.x += s.vx;
      s.y += s.vy;
    }
    else {
      for (var i = 0; i < sprites.length; i++) {
        s = sprites[i];
        s.x += s.vx;
        s.y += s.vy;
      }
    }
  };

  /*
  ### distance

  Find the distance in pixels between two sprites.
  Parameters: 
  a. A sprite object with `centerX` and `centerX` properties. 
  b. A sprite object with `centerY` and `centerY` properties. 
  The function returns the number of pixels distance between the sprites.

  */

  ga.distance = function (s1, s2) {
    var vx = s2.centerX - s1.centerX;
    var vy = s2.centerY - s1.centerY;
    return Math.sqrt(vx * vx + vy * vy);
  };

  /*
  ### ease

  Make a sprite ease to the position of another sprite.
  Parameters: 
  a. A sprite object with `centerX` and `centerY` properties. This is the `follower`
  sprite.
  b. A sprite object with `centerX` and `centerY` properties. This is the `leader` sprite that
  the follower will chase
  c. The easing value, such as 0.3. A higher number makes the follower move faster

  */
  ga.ease = function(follower, leader, speed) {
    //Figure out the distance between the sprites
    var vx = leader.centerX - follower.centerX;
    var vy = leader.centerY - follower.centerY;
    var distance = Math.sqrt(vx * vx + vy * vy);
    
    //Move the follower if it's more than 1 pixel 
    //away from the leader
    if (distance >= 1) {
      follower.x += vx * speed;
      follower.y += vy * speed;
    }
  };

  /*
  ### follow

  Make a sprite move towards another sprite at a regular speed.
  Parameters: 
  a. A sprite object with `centerX` and `centerY` properties. This is the `follower`
  sprite.
  b. A sprite object with `centerX` and `centerY` properties. This is the `leader` sprite that
  the follower will chase
  c. The speed value, such as 3. The is the pixels per frame that the sprite will move. A higher number makes the follower move faster.

  */

  ga.follow = function(follower, leader, speed) {
    //Figure out the distance between the sprites
    var vx = leader.centerX - follower.centerX;
    var vy = leader.centerY - follower.centerY;
    var distance = Math.sqrt(vx * vx + vy * vy);
    
    //Move the follower if it's more than 1 move 
    //away from the leader
    if (distance >= speed) {
      follower.x += (vx / distance) * speed;
      follower.y += (vy / distance) * speed;
    }
  };

  //### rotateAround
  //Make a sprite rotate around another sprite

  ga.rotateAround = function(rotatingSprite, centerSprite, distance, angle) {
    rotatingSprite.x 
      = centerSprite.centerX - centerSprite.x
      + (distance * Math.cos(angle)) 
      - rotatingSprite.halfWidth;

    rotatingSprite.y 
      = centerSprite.centerY - centerSprite.y 
      + (distance *  Math.sin(angle)) 
      - rotatingSprite.halfWidth;
  };

  //### rotatePoint
  //Make a point rotate around another point

  ga.rotatePoint = function(pointX, pointY, distance, angle) {
    var point = {};
    point.x = pointX + Math.cos(angle) * distance;
    point.y = pointY + Math.sin(angle) * distance;
    return point;
  };

  /*
  ### angle

  Return the angle in Radians between two sprites.
  Parameters: 
  a. A sprite object with `centerX` and `centerY` properties.
  b. A sprite object with `centerX` and `centerY` properties.
  You can use it to make a sprite rotate towards another sprite like this:

      box.rotation = angle(box, pointer);

  */

  ga.angle = function(s1, s2) {
    return Math.atan2(
      s2.centerY - s1.centerY,
      s2.centerX - s1.centerX
    );
  };

  /*
  ### random

  Return a random integer between a minimum and maximum value
  Parameters: 
  a. An integer.
  b. An integer.
  Here's how you can use it to get a random number between, 1 and 10:

      random(1, 10);

  */
  ga.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //### wait
  ga.wait = function(duration, callBack) {
    setTimeout(callBack, duration);
  };
    
  /*
  Chapter 2: Tween methods for sprite and scene transitions
  ---------------------------------------------------------

  Ga has four special tween functions to help you manage scene
  or sprite transitions:

      slide
      yoyo
      fadeIn
      fadeOut

  They're special because they don't need to run inside a looping game
  state (like `play`) to work. That makes them easy to launch with callback functions.
  `slide` eases a sprite from its start position to a destination x
  and y point at a certain speed. It returns a tween object. You can
  attach an `onComplete` method to the tween object to do something
  when the tween has finished. It also has a Boolean `playing`
  property that tells you whether or not the tween is playing. Use
  `tween.pause()` and `tween.play()` to pause and play the tweens at
  any time. You can completely remove a tween with
  `ga.removeTween(tweenObject).
  `yoyo` is the same as `slide`, but the tween will bounce back and
  forth between its start and end points, forever. You can give it an
  optional `delay` argument that defines how long, in milliseconds, the
  tween should hold its position until it bounces back again.
  `fadeIn` and `fadeOut` work the same way, and change the sprite's
  `alpha` property.
  All of these special tweens are managed in Ga's `tweens` array. Ga's game loop
  calls each tween object's `update` function each frame.
  */

  //### slide
  //Use `slide` to ease a sprite to a new position.
  //`slide` arguments:
  //sprite, destinationX, destinationY, speed
  ga.slide = function(sprite, endX, endY, speed) {
    var tween = {};
    tween.startX = sprite.x;
    tween.startY = sprite.y;
    tween.playing = true;
    tween.update = function() {
      if (tween.playing) {
        var vx = endX - sprite.x,
            vy = endY - sprite.y,
            distance = Math.sqrt(vx * vx + vy * vy);

        if (distance >= 0.5) {
          sprite.x += vx * speed;
          sprite.y += vy * speed;
        } else {
          sprite.x = endX;
          sprite.y = endY;
          tween.playing = false;
          if (tween.onComplete) tween.onComplete();
          //Remove the tween from Ga's `tweens` array.
          ga.tweens.splice(ga.tweens.indexOf(tween), 1);
        }
      }
    };
    tween.pause = function() {
      tween.playing = false;
    };
    tween.play = function() {
      tween.playing = true;
    };
    //Add the tween to Ga's `tweens` array. The `tweens` array is
    //updated on each frame.
    ga.tweens.push(tween);
    //Return the tween object
    return tween;
  };

  //### yoyo
  //`yoyo` arguments:
  //sprite, destinationX, destinationY, speed, delayInMilliseconds
  ga.yoyo = function(sprite, endX, endY, speed, delay) {
    if (delay === undefined) delay = 0;
    var yoyo = {};
    function repeat(sprite, endX, endY, speed, delay) {
      yoyo.tween = ga.slide(sprite, endX, endY, speed);
      yoyo.tween.onComplete = function() {
        ga.wait(delay, function() {
          repeat(sprite, yoyo.tween.startX, yoyo.tween.startY, speed, delay);
        });
      };
    };
    repeat(sprite, endX, endY, speed, delay);
    //Define the `playing` property
    Object.defineProperty(yoyo, "playing", {
      get: function() {
        //Return the `tween` object's `playing` value
        return yoyo.tween.playing;
      }, 
      enumerable: false, configurable: false
    });
    //Pause and play the yoyo's tween
    yoyo.pause = function() {
      yoyo.tween.playing = false;
    };
    yoyo.play = function() {
      yoyo.tween.playing = true;
    };
    return yoyo;
  };

  //### fadeOut
  //`fadeOut` arguments:
  //sprite, speed
  ga.fadeOut = function(sprite, speed) {
    var tween = {};
    tween.playing = true;
    tween.update = function() {
      if (tween.playing) {
        //Important! Use the sprite's `_alpha` property for this
        //instead of its relative `alpha` property. That's because we
        //want to tween the alpha property without taking into account
        //the sprite's parent's alpha as well.
        if (sprite._alpha > 0) {
          sprite._alpha -= speed;
          if (sprite._alpha < 0) sprite._alpha = 0;
        } else {
          tween.playing = false;
          if (tween.onComplete) tween.onComplete();
          //Remove the tween from Ga's `tweens` array.
          ga.tweens.splice(ga.tweens.indexOf(tween), 1);
        }
      }
    };
    tween.pause = function() {
      tween.playing = false;
    };
    tween.play = function() {
      tween.playing = true;
    };
    //Add the tween to Ga's `tweens` array. The `tweens` array is
    //updated on each frame.
    ga.tweens.push(tween);
    //Return the tween object
    return tween;
  };

  //### fadeIn
  //`fadeIn` arguemnts:
  //sprite, speed
  ga.fadeIn = function(sprite, speed) {
    var tween = {};
    tween.playing = true;
    tween.update = function() {
      if (tween.playing) {
        //Important! Use the sprite's `_alpha` property for this
        //instead of its relative `alpha` property. That's because we
        //want to tween the alpha property without taking into account
        //the sprite's parent's alpha as well.
        if (sprite._alpha < 1) {
          sprite._alpha += speed;
          if (sprite._alpha > 1) sprite._alpha = 1;
        } else {
          tween.playing = false;
          if (tween.onComplete) tween.onComplete();
          //Remove the tween from Ga's `tweens` array.
          ga.tweens.splice(ga.tweens.indexOf(tween), 1);
        }
      }
    };
    tween.pause = function() {
      tween.playing = false;
    };
    tween.play = function() {
      tween.playing = true;
    };
    //Add the tween to Ga's `tweens` array. The `tweens` array is
    //updated on each frame.
    ga.tweens.push(tween);
    //Return the tween object
    return tween;
  };

  //### removeTween
  ga.removeTween = function(tweenObject) {
    //Remove the tween if tweenObject doesn't have a nested
    //tween object
    if(!tweenObject.tween) {
      tweenObject.pause();
      ga.tweens.splice(ga.tweens.indexOf(tweenObject), 1);
    //Otherwise, remove the nested tween object
    } else {
      tweenObject.tween.pause();
      ga.tweens.splice(ga.tweens.indexOf(tweenObject.tween), 1);
    }
  }

  /*
  Chapter 3: Sprite creation tools
  --------------------------------
  */

  //### shoot

  ga.shoot = function(
      shooter, angle, offsetFromCenter, 
      bulletSpeed, bulletSprite, bulletArray) {
    //Make a new sprite using the user-supplied `bulletSprite` function
    var bullet = bulletSprite();

    //Set the bullet's start point
    bullet.x 
      = shooter.centerX - bullet.halfWidth 
      + (offsetFromCenter * Math.cos(angle));
    bullet.y 
      = shooter.centerY - bullet.halfHeight 
      + (offsetFromCenter * Math.sin(angle));

    //Set the bullet's velocity
    bullet.vx = Math.cos(angle) * bulletSpeed;
    bullet.vy = Math.sin(angle) * bulletSpeed;

    //Push the bullet into the 
    bulletArray.push(bullet);
  };


  /*
  ### grid
  Create the grid of pegs using the `grid` function. `grid` returns a
  `group` sprite object that contains a sprite for every cell in the
  grid. You can define the rows and columns in the grid, whether or
  not the sprites should be centered inside each cell, or what their offset from the
  top left corner of each cell should be. Supply a function that
  returns the sprite that you want to make for each cell. You can
  supply an optional final function that runs any extra code after
  each sprite has been created. Here's the format for creating a grid:

          gridGroup = grid(

            //Set the grid's properties
            anInstanceOfGa, rows, columns, cellWidth, cellHeight, 
            areSpirtesCentered?, xOffset, yOffset,

            //A function that returns a sprite
            function() {return g.circle(16, "blue");},

            //An optional final function that runs some extra code
            function() {console.log("extra!");}
          );
  */

  ga.grid = function( 
      columns, rows, cellWidth, cellHeight, 
      centerCell, xOffset, yOffset,
      makeSprite, 
      extra
    ){ 
    //Set the defaults
    if (!columns && columns !== 0) columns = 0;
    if (!rows && rows !== 0) rows = 0;
    if (!cellWidth && cellWidth !== 0) cellWidth = 32;
    if (!cellHeight && cellHeight !== 0) cellHeight = 32;
    if (!xOffset && xOffset !== 0) xOffset = 0;
    if (!yOffset && yOffset !== 0) yOffset = 0;
    centerCell = centerCell || false;

    //Create an empty DisplayObjectContainer
    var container = ga.group();
    //The `create` method
    container.createGrid = function() {
      var length = columns * rows;
      for(var i = 0; i < length; i++) {
        var x = ((i % columns) * cellWidth),
            y = (Math.floor(i / columns) * cellWidth);

        //Use the `makeSprite` method supplied in the constructor
        //to make a sprite for the grid cell
        var sprite = makeSprite();
        container.addChild(sprite);

        //Should the sprite be centered in the cell?
        if (!centerCell) {
          sprite.x = x + xOffset;
          sprite.y = y + yOffset;
        }
        else {
          sprite.x = x + (sprite.width / 2) + xOffset;
          sprite.y = y + (sprite.height / 2) + yOffset;
        }
        //Run any optional extra code. This calls the
        //`extra` method supplied by the constructor
        if (extra) extra(sprite);
      }
    };
    container.createGrid();
    ga.stage.addChild(container);
    return container;
  };

  /*
  ### progressBar
  Use the `progressBar` to display the percentage of assetes being loaded.
  To use it, first make sure you define a `load` state when you intialize Ga.
  Here's an example of a Ga instance that's intialized with 5 assets. The last 
  argument, `load`, tells Ga that it should apply the `load` state as soon as
  Ga starts.

      var g = ga(
        512, 512, setup, 
        [
          "images/blixyiiUI.png",
          "images/blixyiiTileset.png",
          "fonts/puzzler.otf",
          "sounds/music.wav",
          "sounds/bounce.wav"
        ],
        load
      );
      g.start();
  
  Next, create a `load` function. It will run in a loop while the assets are loading
  and before the `setup` state is run. Here's how to create and update the progress
  bar in the load state

      function load() {
        g.progressBar.create(g.canvas, g.assets);
        g.progressBar.update();
      }

  When the assets have finished loading the `setup` state will automatically be run.
  Remove the progress bar in the `setup` function state like this:

      function setup() {
        g.progressBar.remove();
        //...
      }

  This is just a basic example of a progress bar to help you get started. You can use the
  same format to create your own custom preloading animation.

  */
  ga.progressBar = {
    maxWidth: 0, 
    height: 0,
    backgroundColor: "gray",
    foregroundColor: "cyan",
    backBar: null,
    frontBar: null,
    percentage: null,
    assets: null,
    initialized: false,
    create: function(canvas, assets) {
      if (!this.initialized) {
        //Store a reference to the `assets` object
        this.assets = assets;
        //Set the maximum width to half the width of the canvas
        this.maxWidth = ga.canvas.width / 2;

        //Build the progress bar using two Rectangle sprites and
        //one Message Sprite
        //1. Create the bar's gray background
        this.backBar = ga.rectangle(this.maxWidth, 32, this.backgroundColor);
        this.backBar.x = (ga.canvas.width / 2) - (this.maxWidth / 2);
        this.backBar.y = (ga.canvas.height / 2) - 16;

        //2. Create the blue foreground. This is the element of the 
        //progress bar that will increase in width as assets load
        this.frontBar = ga.rectangle(this.maxWidth, 32, this.foregroundColor);
        this.frontBar.x = (ga.canvas.width / 2) - (this.maxWidth / 2);
        this.frontBar.y = (ga.canvas.height / 2) - 16;
        
        //3. A text sprite that will display the percentage
        //of assets that have loaded
        this.percentage = ga.text("0%", "28px sans-serif", "black");
        this.percentage.x = (ga.canvas.width / 2) - (this.maxWidth / 2) + 12;
        this.percentage.y = (ga.canvas.height / 2) - 16;

        //Flag the progressBar as having been initialized
        this.initialized = true;
      }
    },
    update: function() {
      //Change the width of the blue `frontBar` to match the 
      //ratio of assets that have loaded. Adding `+ 1` to
      //`assets.loaded` means that the loading bar will appear at 100%
      //when the last asset is being loaded, which is reassuring for the
      //player.
      var ratio = (this.assets.loaded + 1) / this.assets.toLoad;
      this.frontBar.scaleX = ratio; 
      //Display the percentage
      this.percentage.content = Math.floor((ratio) * 100) + "%";
    },
    remove: function() {
      //Remove the progress bar
      g.remove(this.frontBar);
      g.remove(this.backBar);
      g.remove(this.percentage);
    }
  };

  /*
  Chapter 4: Collision
  --------------------
  */

  /*
  ### Boundary collisions
  */

  //#### outsideBounds
  ga.outsideBounds = function(s, bounds, extra){

    var x = bounds.x,
        y = bounds.y,
        width = bounds.width,
        height = bounds.height;

    //The `collision` object is used to store which 
    //side of the containing rectangle the sprite hits
    var collision;

    //Left
    if (s.x < x - s.width) {
      collision = "left";
    }
    //Top
    if (s.y < y - s.height) {
      collision = "top";
    }
    //Right
    if (s.x > width) {
      collision = "right";
    }
    //Bottom
    if (s.y > height) {
      collision = "bottom";
    }

    //The `extra` function runs if there was a collision
    //and `extra` has been defined
    if (collision && extra) extra(collision);
    
    //Return the `collision` object   
    return collision;
  };

  //#### contain
  ga.contain = function(s, bounds, bounce, extra){

    var x = bounds.x,
        y = bounds.y,
        width = bounds.width,
        height = bounds.height;

    //Set `bounce` to `false` by default
    bounce = bounce || false;

    //The `collision` object is used to store which 
    //side of the containing rectangle the sprite hits
    var collision;

    //Left
    if (s.x < x) {
      //Bounce the sprite if `bounce` is true
      if (bounce) s.vx *= -1;
      //If the sprite has `mass`, let the mass 
      //affect the sprite's velocity
      if(s.mass) s.vx /= s.mass;
      s.x = x;
      collision = "left";
    }
    //Top
    if (s.y < y) {
      if (bounce) s.vy *= -1;
      if(s.mass) s.vy /= s.mass;
      s.y = y;
      collision = "top";
    }
    //Right
    if (s.x + s.width > width) {
      if (bounce) s.vx *= -1;
      if(s.mass) s.vx /= s.mass;
      s.x = width - s.width;
      collision = "right";
    }
    //Bottom
    if (s.y + s.height > height) {
      if (bounce) s.vy *= -1;
      if(s.mass) s.vy /= s.mass;
      s.y = height - s.height;
      collision = "bottom";
    }

    //The `extra` function runs if there was a collision
    //and `extra` has been defined
    if (collision && extra) extra(collision);
    
    //Return the `collision` object   
    return collision;
  };

  /*
  ### Shape collisions
  /


  /*
  #### hitTestPoint

  Use it to find out if a point is touching a circular or rectangular sprite.
  Parameters: 
  a. An object with `x` and `y` properties.
  b. A sprite object with `x`, `y`, `centerX` and `centerY` properties.
  If the sprite has a `radius` property, the function will interpret
  the shape as a circle.
  */

  ga.hitTestPoint = function(point, sprite) {

    var shape, left, right, top, bottom, vx, vy, magnitude, hit;

    //Find out if the sprite is rectangular or circular depending
    //on whether it has a `radius` property
    if (sprite.radius) {
      shape = "circle";
    } else {
      shape = "rectangle";
    }

    //Rectangle
    if (shape === "rectangle") {
      //Get the position of the sprite's edges
      left = sprite.x;
      right = sprite.x + sprite.width;
      top = sprite.y;
      bottom = sprite.y + sprite.height;

      //Find out if the point is intersecting the rectangle
      hit = point.x > left && point.x < right && point.y > top && point.y < bottom;
    }

    //Circle
    if (shape === "circle") {
      //Find the distance between the point and the
      //center of the circle
      vx = point.x - sprite.centerX,
      vy = point.y - sprite.centerY,
      magnitude = Math.sqrt(vx * vx + vy * vy);

      //The point is intersecting the circle if the magnitude
      //(distance) is less than the circle's radius
      hit = magnitude < sprite.radius;
    }

    //`hit` will be either `true` or `false`
    return hit;
  };

  /*
  #### hitTestCircle

  Use it to find out if two circular sprites are touching.
  Parameters: 
  a. A sprite object with `centerX`, `centerY` and `radius` properties.
  b. A sprite object with `centerX`, `centerY` and `radius`.
  */

  ga.hitTestCircle = function(c1, c2) {
    var vx, vy, magnitude, totalRadii, hit;

    //Calculate the vector between the circles’ center points
    vx = c1.centerX - c2.centerX;
    vy = c1.centerY - c2.centerY;

    //Find the distance between the circles by calculating
    //the vector's magnitude (how long the vector is)  
    magnitude = Math.sqrt(vx * vx + vy * vy);

    //Add together the circles' total radii
    totalRadii = c1.radius + c2.radius;

    //Set hit to true if the distance between the circles is
    //less than their totalRadii
    hit = magnitude < totalRadii;

    //`hit` will be either `true` or `false`
    return hit;
  };

  /*
  #### hitTestRectangle

  Use it to find out if two rectangular sprites are touching.
  Parameters: 
  a. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
  b. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.

  */

  ga.hitTestRectangle = function(r1, r2) {
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //A variable to determine whether there's a collision
    hit = false;

    //Calculate the distance vector
    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
      //A collision might be occuring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
        //There's definitely a collision happening
        hit = true;
      } else {
        //There's no collision on the y axis
        hit = false;
      }
    } else {
      //There's no collision on the x axis
      hit = false;
    }

    //`hit` will be either `true` or `false`
    return hit;
  };

  /*
  #### rectangleCollision

  Use it to prevent two rectangular sprites from overlapping. 
  Optionally, make the first retangle bounceoff the second rectangle.
  Parameters: 
  a. A sprite object with `x`, `y` `center.x`, `center.y`, `halfWidth` and `halfHeight` properties.
  b. A sprite object with `x`, `y` `center.x`, `center.y`, `halfWidth` and `halfHeight` properties.
  c. Optional: true or false to indicate whether or not the first sprite
  should bounce off the second sprite.
  */

  ga.rectangleCollision = function(r1, r2, bounce, global) {
    var collision, combinedHalfWidths, combinedHalfHeights,
        overlapX, overlapY, vx, vy;
      
    //Set `bounce` to a default value of `true`
    if(bounce === undefined) bounce = false;

    //Set `global` to a default value of `true`
    if(global === undefined) global = true;

    //Calculate the distance vector
    if(global) {
      vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth);
      vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight);
    } else {
      vx = r1.centerX - r2.centerX;
      vy = r1.centerY - r2.centerY;
    }
    
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    //Check whether vx is less than the combined half widths 
    if (Math.abs(vx) < combinedHalfWidths) {
      //A collision might be occurring! 
      //Check whether vy is less than the combined half heights 
      if (Math.abs(vy) < combinedHalfHeights) {
        //A collision has occurred! This is good! 
        //Find out the size of the overlap on both the X and Y axes
        overlapX = combinedHalfWidths - Math.abs(vx);
        overlapY = combinedHalfHeights - Math.abs(vy);

        //The collision has occurred on the axis with the
        //*smallest* amount of overlap. Let's figure out which
        //axis that is

        if (overlapX >= overlapY) {
          //The collision is happening on the X axis 
          //But on which side? vy can tell us
          if (vy > 0) {
            collision = "top";
            //Move the rectangle out of the collision
            r1.y = r1.y + overlapY;
          } else {
            collision = "bottom";
            //Move the rectangle out of the collision
            r1.y = r1.y - overlapY;
          }
          //Bounce
          if (bounce) {
            r1.vy *= -1;

            /*Alternative
            //Find the bounce surface's vx and vy properties
            var s = {};
            s.vx = r2.x - r2.x + r2.width; 
            s.vy = 0;
    
            //Bounce r1 off the surface
            //bounceOffSurface(r1, s);
            */
          }
        } else {
          //The collision is happening on the Y axis 
          //But on which side? vx can tell us
          if (vx > 0) {
            collision = "left";
            //Move the rectangle out of the collision
            r1.x = r1.x + overlapX;
          } else {
            collision = "right";
            //Move the rectangle out of the collision
            r1.x = r1.x - overlapX;
          }
          //Bounce
          if (bounce) {
            r1.vx *= -1;

            /*Alternative
            //Find the bounce surface's vx and vy properties
            var s = {};
            s.vx = 0; 
            s.vy = r2.y - r2.y + r2.height;
      
            //Bounce r1 off the surface
            bounceOffSurface(r1, s);
            */
          }
        }
      } else {
        //No collision
      }
    } else {
      //No collision
    }
    //Return the collision string. it will be either "top", "right",
    //"bottom", or "left" depening on which side of r1 is touching r2. 
    return collision;
  }

  /*
  #### circleCollision

  Use this function to prevent a moving circular sprite from overlapping and optionally
  bouncing off a non-moving circular sprite.
  Parameters: 
  a. A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.
  b. A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.
  c. Optional: `true` or `false` to indicate whether or not the first sprite
  d. Optional: `true` or `false` to indicate whether or not local or global sprite positions should be used. 
  This defaults to `true` so set it to `false` if you want to use the sprite's local coordinates.
  should bounce off the second sprite.
  The sprites can contain an optional mass property that should be greater than 1.

  */

  ga.circleCollision = function(c1, c2, bounce, global) {
    var magnitude, combinedRadii, overlap,
        vx, vy, dx, dy, s = {},
        hit = false;

    //Set `bounce` to a default value of `true`
    if(bounce === undefined) bounce = true;

    //Set `global` to a default value of `true`
    if(global === undefined) global = true;

    //Calculate the vector between the circles’ center points

    if(global) {
      //Use global coordinates
      vx = (c2.gx + c2.radius) - (c1.gx + c1.radius);
      vy = (c2.gy + c2.radius) - (c1.gy + c1.radius);
    } else {
      //Use local coordinates
      vx = c2.centerX - c1.centerX;
      vy = c2.centerY - c1.centerY;
    }

    //Find the distance between the circles by calculating
    //the vector's magnitude (how long the vector is) 
    magnitude = Math.sqrt(vx * vx + vy * vy);

    //Add together the circles' combined half-widths
    combinedRadii = c1.radius + c2.radius;

    //Figure out if there's a collision
    if (magnitude < combinedRadii) {

      //Yes, a collision is happening.
      hit = true;

      //Find the amount of overlap between the circles 
      overlap = combinedRadii - magnitude;

      //Add some "quantum padding". This adds a tiny amount of space
      //between the circles to reduce their surface tension and make
      //them more slippery. "0.3" is a good place to start but you might
      //need to modify this slightly depending on the exact behaviour
      //you want. Too little and the balls will feel sticky, too much
      //and they could start to jitter if they're jammed together
      var quantumPadding = 0.3;
      overlap += quantumPadding;

      //Normalize the vector.
      //These numbers tell us the direction of the collision
      dx = vx / magnitude;
      dy = vy / magnitude;

      //Move circle 1 out of the collision by multiplying
      //the overlap with the normalized vector and subtract it from 
      //circle 1's position
      c1.x -= overlap * dx;
      c1.y -= overlap * dy;

      //Bounce    
      if (bounce) {
        //Create a collision vector object, `s` to represent the bounce surface.
        //Find the bounce surface's x and y properties
        //(This represents the normal of the distance vector between the circles)
        s.x = vy;
        s.y = -vx;

        //Bounce c1 off the surface
        bounceOffSurface(c1, s);
      } else {
        /*
        //Make it a bit slippery
        var friction = 0.9;
        c1.vx *= friction;
        c1.vy *= friction;
        */
      }
    }

    return hit;
  };

  /*
  #### movingCircleCollision

  Use it to make two moving circles bounce off each other.
  Parameters: 
  a. A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.
  b. A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.
  The sprites can contain an optional mass property that should be greater than 1.

  */

  ga.movingCircleCollision = function(c1, c2) {
    var combinedRadii, overlap, xSide, ySide,
        s = {},
        p1A = {}, p1B = {}, p2A = {}, p2B = {},
        hit = false;

    c1.mass = c1.mass || 1;
    c2.mass = c2.mass || 1;

    //Calculate the vector between the circles’ center points
    s.vx = c1.centerX - c2.centerX;
    s.vy = c1.centerY - c2.centerY;

    //Find the distance between the circles by calculating
    //the vector's magnitude (how long the vector is) 
    s.magnitude = Math.sqrt(s.vx * s.vx + s.vy * s.vy);

    //Add together the circles' combined half-widths
    combinedRadii = c1.radius + c2.radius;

    //Figure out if there's a collision
    if (s.magnitude < combinedRadii) {

      //Yes, a collision is happening
      hit = true;

      //Find the amount of overlap between the circles 
      overlap = combinedRadii - s.magnitude;

      //Add some "quantum padding" to the overlap
      overlap += 0.3;

      //Normalize the vector.
      //These numbers tell us the direction of the collision
      s.dx = s.vx / s.magnitude;
      s.dy = s.vy / s.magnitude;

      //Find the collision vector.
      //Divide it in half to share between the circles, and make it absolute
      s.vxHalf = Math.abs(s.dx * overlap / 2);
      s.vyHalf = Math.abs(s.dy * overlap / 2);

      //Find the side that the collision if occurring on
      (c1.x > c2.x) ? xSide = 1 : xSide = -1;
      (c1.y > c2.y) ? ySide = 1 : ySide = -1;

      //Move c1 out of the collision by multiplying
      //the overlap with the normalized vector and adding it to 
      //the circle's positions
      c1.x = c1.x + (s.vxHalf * xSide);
      c1.y = c1.y + (s.vyHalf * ySide);

      //Move c2 out of the collision
      c2.x = c2.x + (s.vxHalf * -xSide);
      c2.y = c2.y + (s.vyHalf * -ySide);

      //1. Calculate the collision surface's properties

      //Find the surface vector's left normal
      s.lx = s.vy;
      s.ly = -s.vx;

      //2. Bounce c1 off the surface (s)

      //Find the dot product between c1 and the surface
      var dp1 = c1.vx * s.dx + c1.vy * s.dy;

      //Project c1's velocity onto the collision surface
      p1A.x = dp1 * s.dx;
      p1A.y = dp1 * s.dy;

      //Find the dot product of c1 and the surface's left normal (s.l.x and s.l.y)
      var dp2 = c1.vx * (s.lx / s.magnitude) + c1.vy * (s.ly / s.magnitude);

      //Project the c1's velocity onto the surface's left normal
      p1B.x = dp2 * (s.lx / s.magnitude);
      p1B.y = dp2 * (s.ly / s.magnitude);

      //3. Bounce c2 off the surface (s)

      //Find the dot product between c2 and the surface
      var dp3 = c2.vx * s.dx + c2.vy * s.dy;

      //Project c2's velocity onto the collision surface
      p2A.x = dp3 * s.dx;
      p2A.y = dp3 * s.dy;

      //Find the dot product of c2 and the surface's left normal (s.l.x and s.l.y)
      var dp4 = c2.vx * (s.lx / s.magnitude) + c2.vy * (s.ly / s.magnitude);

      //Project c2's velocity onto the surface's left normal
      p2B.x = dp4 * (s.lx / s.magnitude);
      p2B.y = dp4 * (s.ly / s.magnitude);

      //Calculate the bounce vectors
      //Bounce c1
      //using p1B and p2A
      c1.bounce = {};
      c1.bounce.x = p1B.x + p2A.x;
      c1.bounce.y = p1B.y + p2A.y;

      //Bounce c2
      //using p1A and p2B
      c2.bounce = {};
      c2.bounce.x = p1A.x + p2B.x;
      c2.bounce.y = p1A.y + p2B.y;

      //Add the bounce vector to the circles' velocity
      //and add mass if the circle has a mass property
      c1.vx = c1.bounce.x / c1.mass;
      c1.vy = c1.bounce.y / c1.mass;
      c2.vx = c2.bounce.x / c2.mass;
      c2.vy = c2.bounce.y / c2.mass;
    }
    return hit;
  };

  //#### multipleCircleCollision
  /*
  Checks all the circles in an array for a collision against
  all the other circles in an array, using `movingCircleCollision` (above)
  */

  ga.multipleCircleCollision = function(arrayOfCircles) {
    //marble collisions
    for (var i = 0; i < arrayOfCircles.length; i++) {
      //The first marble to use in the collision check 
      var c1 = arrayOfCircles[i];
      for (var j = i + 1; j < arrayOfCircles.length; j++) {
        //The second marble to use in the collision check 
        var c2 = arrayOfCircles[j];
        //Check for a collision and bounce the marbles apart if
        //they collide. Use an optional mass property on the sprite
        //to affect the bounciness of each marble
        ga.movingCircleCollision(c1, c2);
      }
    }
  };

  /*
  #### bounceOffSurface

  Use this to bounce an object off another object. It's only used by the other collision functions,
  so you don't need to call it yourself.
  Parameters: 
  a. An object with `vx` and `vy` properties. This represents the object that is colliding
  with a surface.
  b. An object with `x` and `y` properties. This represents the surface that the object
  is colliding into.
  The first object can optionally have a mass property that's greater than 1. The mass will
  be used to dampen the bounce effect.
  */

  function bounceOffSurface(o, s) {
    var dp1, dp2,
        p1 = {},
        p2 = {},
        bounce = {},
        mass = o.mass || 1;

    //1. Calculate the collision surface's properties
    //Find the surface vector's left normal
    s.lx = s.y;
    s.ly = -s.x;

    //Find its magnitude
    s.magnitude = Math.sqrt(s.x * s.x + s.y * s.y);

    //Find its normalized values
    s.dx = s.x / s.magnitude;
    s.dy = s.y / s.magnitude;

    //2. Bounce the object (o) off the surface (s)

    //Find the dot product between the object and the surface
    dp1 = o.vx * s.dx + o.vy * s.dy;

    //Project the object's velocity onto the collision surface
    p1.vx = dp1 * s.dx;
    p1.vy = dp1 * s.dy;

    //Find the dot product of the object and the surface's left normal (s.l.x and s.l.y)
    dp2 = o.vx * (s.lx / s.magnitude) + o.vy * (s.ly / s.magnitude);

    //Project the object's velocity onto the surface's left normal
    p2.vx = dp2 * (s.lx / s.magnitude);
    p2.vy = dp2 * (s.ly / s.magnitude);

    //Reverse the projection on the surface's left normal
    p2.vx *= -1;
    p2.vy *= -1;

    //Add up the projections to create a new bounce vector
    bounce.x = p1.vx + p2.vx;
    bounce.y = p1.vy + p2.vy;

    //Assign the bounce vector to the object's velocity
    //with optional mass to dampen the effect
    o.vx = bounce.x / mass;
    o.vy = bounce.y / mass;
  }

  /*
  //#### hit
  An universal collision method that works for rectangular and circular sprites.
  it figures out what kinds of sprites are involved in the collision and 
  automatically chooses the correct collision method.
  */

  ga.hit = function(a, b, react, bounce, global, extra) {
    var collision;

    //Set the defaults
    react = react || false;
    bounce = bounce || false;
    global = global || true;

    //Check to make sure one of the arguments isn't an array
    if (b instanceof Array || a instanceof Array) {
      //If it is, check for a collision between a sprite and an array
      spriteVsArray();
    } else {
      //If one of the arguments isn't an array, find out what type of
      //collision check to run
      collision = findCollisionType(a, b); 
      if (collision && extra) extra(collision);
    }
    //Return the result of the collision.
    //It will be `undefined` if there's no collision and `true` if 
    //there is a collision. `rectangleCollision` sets `collsision` to
    //"top", "bottom", "left" or "right" depeneding on which side the
    //collision is occuring on
    return collision;

    function findCollisionType (a, b) {
      //Are `a` and `b` both shapes?
      if (a.width && b.width) {
        //Yes, but what kind of shapes?
        if(a.diameter && b.diameter) {
          //They're cicles
          return circleVsCircle(a, b);
        } else {
          //They're rectangles
          return rectangleVsRectangle(a, b);
        }
      }
      //They're not both shapes, so what are they?
      //Does `a` not have a width and `b` has a width?
      else if (!a.width && b.width) {
        //Yes, so this is a point vs. sprite collision test
        return ga.hitTestPoint(a, b);
      }
      else {
        //The user is trying to test some incompatible objects
        throw new Error("I'm sorry, " + a + " and " + b + " cannot be use together in a collision test.");
      }
    }
    
    function spriteVsArray() {
      //If `a` happens to be the array, flip it around so that it becomes `b`
      if (a instanceof Array) {
        var temp = a;
        b = a;
        a = temp;
      }
      //Loop through the array in reverse
      for (var i = b.length - 1; i >= 0; i--) {
        var sprite = b[i];
        collision = findCollisionType(a, sprite); 
        if (collision && extra) extra(collision, sprite);
      }
    }

    function circleVsCircle(a, b) {
      //If the circles shouldn't react to the collision,
      //just test to see if they're touching
      if(!react) {
        return ga.hitTestCircle(a, b);
      } 
      //Yes, the circles should react to the collision
      else {
        //Are they both moving?
        if (a.vx + a.vy !== 0 && b.vx + b.vy !== 0) {
          //Yes, they are both moving
          //(moving circle collisions always bounce apart so there's
          //no need for the third, `bounce`, argument)
          return ga.movingCircleCollision(a, b);
        }
        else {
          //No, they're not both moving
          return ga.circleCollision(a, b, bounce, global);
        }
      }
    }

    function rectangleVsRectangle(a, b) {
      //If the rectangles shouldn't react to the collision, just
      //test to see if they're touching
      if(!react) {
        return ga.hitTestRectangle(a, b);
      } 
      //Yes
      else {
        //Should they bounce apart?
        //Yes
        if(bounce) {
          return ga.rectangleCollision(a, b, true, global);
        } 
        //No
        else {
          return ga.rectangleCollision(a, b, false, global); 
        }
      }
    }
  };

  /*
  Chapter 4: Sprite controllers
  -----------------------------
  */

  //### keyControlFourWay

  ga.keyControlFourWay = function(s, speed, up, right, down, left) {
    //Create a `direction` property on the sprite
    s.direction = "";
    
    //Create some keyboard objects
    leftArrow = ga.keyboard(left);
    upArrow = ga.keyboard(up);
    rightArrow = ga.keyboard(right);
    downArrow = ga.keyboard(down);
    
    //Assign key `press` and release methods 
    leftArrow.press = function() {
      s.vx = -speed;
      s.vy = 0;
      s.direction = "left";
    };
    leftArrow.release = function() {
      if (!rightArrow.isDown && s.vy === 0) {
        s.vx = 0;
      }
    };
    upArrow.press = function() {
      s.vy = -speed;
      s.vx = 0;
      s.direction = "up";
    };
    upArrow.release = function() {
      if (!downArrow.isDown && s.vx === 0) {
        s.vy = 0;
      }
    };
    rightArrow.press = function() {
      s.vx = speed;
      s.vy = 0;
      s.direction = "right";
    };
    rightArrow.release = function() {
      if (!leftArrow.isDown && s.vy === 0) {
        s.vx = 0;
      }
    };
    downArrow.press = function() {
      s.vy = speed;
      s.vx = 0;
      s.direction = "down";
    };
    downArrow.release = function() {
      if (!upArrow.isDown && s.vx === 0) {
        s.vy = 0;
      }
    };
  };

//plugins ends
};
