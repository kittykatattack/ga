// player.vy = 0;
// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @language ECMASCRIPT5
// @fileoverview
// @suppress {checkTypes | globalThis | checkVars}
// ==/ClosureCompiler==

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
      ga.randomInt = function(min, max) {
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
`followEase`: Make a sprite ease to the position of another sprite.
`easeProperty`: Ease a single sprite property to another value.
`slide`: Ease a sprite to a specific position.
`fadeIn`: Fade in a sprite.
`fadeOut`: Fade out a sprite.
`fade`: Fades in or out.
`pulse`: Uses the `fade` method to make a sprite's alpha ocillate.
`follow`: Make a sprite follow another sprite at a fixed speed.
`rotateSprite`: Make a sprite rotate around the center of another sprite.
`rotatePoint`: Make any x/y point rotate around any other point.
`angle`: Get the angle between the center points of two sprites
`randomInt`: Generate a random integer within a range.
`randomFloat`: Generate a random floating point number within a range.
`wait`: Wait for a certain number of milliseconds and then execute a callback function.
`worldCamera`: A method that creates and returns a camera for a scrolling game world.
`scaleToWindow`: Automatically scales and centers the game to the maximum browser window area.
`shake`: Make a sprite or group shake. You can use it for a screen shake effect.

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
`particleEffect`: A versatile function for creating particles.
`emitter`: A particle emitter for creating a constant stream of particles.
`tilingSprite`: An easy way to create a seamless scrolling background effect.
`burst`: DEPRICATED. A particle explosion effect.

### Chapter 4: Collision

#### Boundary collisions

`outsideBounds`: Tells you if a sprite has exceeded the boundary of another sprite or container.
`contain`: Contains a sprite inside another sprite. Optional bounce if the sprite hits the edges.

#### Shape collisions

`hitTestPoint`: Returns `true` or `false` if an x/y point is intersecting a rectangle or circle.
`hitTestCircle`: Returns `true` if any two circular sprites overlap.
`hitTestRectangle`: Returns `true` if any two rectangular sprites overlap.
`hitTestCircleRectangle`: Returns `true` if rectangular and circular sprites overlap.
`hitTestCirclePoint`: Returns `true` if a point intersects a circle.
`rectangleCollision`: Prevents two colliding rectangles from overlapping and tells you the collision side
`circleCollision`: Makes a moving circle bounce away from a stationary circle.
`movingCircleCollision`: Makes two moving circles bounce apart.
`multipleCircleCollision`: Bounce apart any two circles that are in the same array.
`bounceOffSurface`: A helper method that's use internally by these collision functions.

#### 2D tile-based collision utilities

`getIndex`: Converts a sprite's x/y pixel coordinates into an array index number.
`getTile`: Converts a sprite's index number into x/y pixel coordinates.
`surroundingCells`: returns an array of 9 index numbers of cells surrounding a center cell.
`getPoints`: returns an object with the x/y positions of all the sprite's corner points.
`hitTestTile`: A versatile collision detection function for tile based games.
`updateMap`: Returns a new map array with the new index positions of sprites.

### Chapter 5: Sprite controllers

`keyControlFourWay`: Assign keyboard keys to make a sprite move at a fixed speed in 4 directions

### Chapter 6: Tiled editor importers

`makeTiledWorld`: Creates a game world using Tiled Editor's JSON export data.

### Chapter 7: The fullscreen module

`requestFullscreen`: Used by `enableFullscreen` to launch fullscreen mode.
`exitFullscreen`: used by `enableFullscreen` to exit fullsrcreen mode.
`alignFullscreen`: Used by `enableFullscreen` to scale and center the canvas in fullscreen mode.
`enableFullscreen`: Enables fullscreen mode when the user clicks or touches the canvas.

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
    var vx = s2.centerX - s1.centerX,
        vy = s2.centerY - s1.centerY;
    return Math.sqrt(vx * vx + vy * vy);
  };

  /*
  ### followEase

  Make a sprite ease to the position of another sprite.
  Parameters:
  a. A sprite object with `centerX` and `centerY` properties. This is the `follower`
  sprite.
  b. A sprite object with `centerX` and `centerY` properties. This is the `leader` sprite that
  the follower will chase
  c. The easing value, such as 0.3. A higher number makes the follower move faster

  */
  ga.followEase = function(follower, leader, speed) {

    //Figure out the distance between the sprites
    var vx = leader.centerX - follower.centerX,
        vy = leader.centerY - follower.centerY,
        distance = Math.sqrt(vx * vx + vy * vy);

    //Move the follower if it's more than 1 pixel
    //away from the leader
    if (distance >= 1) {
      follower.x += vx * speed;
      follower.y += vy * speed;
    }
  };

  /*
  ### followConstant

  Make a sprite move towards another sprite at a regular speed.
  Parameters:
  a. A sprite object with `centerX` and `centerY` properties. This is the `follower`
  sprite.
  b. A sprite object with `centerX` and `centerY` properties. This is the `leader` sprite that
  the follower will chase
  c. The speed value, such as 3. The is the pixels per frame that the sprite will move. A higher number makes the follower move faster.

  */

  ga.followConstant = function(follower, leader, speed) {

    //Figure out the distance between the sprites
    var vx = leader.centerX - follower.centerX,
        vy = leader.centerY - follower.centerY,
        distance = Math.sqrt(vx * vx + vy * vy);

    //Move the follower if it's more than 1 move
    //away from the leader
    if (distance >= speed) {
      follower.x += (vx / distance) * speed;
      follower.y += (vy / distance) * speed;
    }
  };

  //### rotateAroundSprite
  //Make a sprite rotate around another sprite

  ga.rotateAroundSprite = function(rotatingSprite, centerSprite, distance, angle) {
    rotatingSprite.x
      = centerSprite.centerX - rotatingSprite.parent.x
      + (distance * Math.cos(angle))
      - rotatingSprite.halfWidth;

    rotatingSprite.y
      = centerSprite.centerY - rotatingSprite.parent.y//centerSprite.y
      + (distance *  Math.sin(angle))
      - rotatingSprite.halfWidth;
  };

  //### rotateAroundPoint
  //Make a point rotate around another point.
  //If distanceX and distanceY are the same value, the rotation will
  //be circular. If they're different values, the rotation will be
  //ellipical.

  ga.rotateAroundPoint = function(pointX, pointY, distanceX, distanceY, angle) {
    var point = {};
    point.x = pointX + Math.cos(angle) * distanceX;
    point.y = pointY + Math.sin(angle) * distanceY;
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

  Returns a random integer between a minimum and maximum value
  Parameters:
  a. An integer.
  b. An integer.
  Here's how you can use it to get a random number between, 1 and 10:

      randomInt(1, 10);

  */
  ga.randomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  //### randomFloat
  // Returns a random floating point number between a minimum and maximum value
  ga.randomFloat = function(min, max) {
    return min + Math.random()*(max-min);
  }

  //### wait
  ga.wait = function(duration, callBack) {
    setTimeout(callBack, duration);
  };

  //### worldCamera
  /*
  The `worldCamera` method returns a `camera` object
  with `x` and `y` properties. It has
  two useful methods: `centerOver`, to center the camera over
  a sprite, and `follow` to make it follow a sprite.
  `worldCamera` arguments: worldObject, theCanvas
  The worldObject needs to have a `width` and `height` property.
  */

  ga.worldCamera = function(world, canvas) {
    var camera = {
      width: canvas.width,
      height: canvas.height,
      _x: 0,
      _y: 0,

      //`x` and `y` getters/setters
      //When you change the camera's position,
      //they acutally reposition the world
      get x() {
        return this._x;
      },
      set x(value) {
        this._x = value;
        world.x = -this._x;
        world._previousX = world.x;
      },
      get y() {
        return this._y;
      },
      set y(value) {
        this._y = value;
        world.y = -this._y;
        world._previousY = world.y;
      },
      get centerX() {
        return this.x + (this.width / 2);
      },
      get centerY() {
        return this.y + (this.height / 2);
      },
      get rightInnerBoundary() {
        return this.x + (this.width / 2) + (this.width / 4);
      },
      get leftInnerBoundary() {
        return this.x + (this.width / 2) - (this.width / 4);
      },
      get topInnerBoundary() {
        return this.y + (this.height / 2) - (this.height / 4);
      },
      get bottomInnerBoundary() {
        return this.y + (this.height / 2) + (this.height / 4);
      },
      follow: function(sprite) {

        //Check the sprites position in relation to the inner boundary
        if(sprite.x < this.leftInnerBoundary) {
          //Move the camera to follow the sprite if the sprite strays outside
          //this.x = Math.floor(sprite.x - (this.width / 4));
          this.x = sprite.x - (this.width / 4);
        }
        if(sprite.y < this.topInnerBoundary) {

          //this.y = Math.floor(sprite.y - (this.height / 4));
          this.y = sprite.y - (this.height / 4);
        }
        if(sprite.x + sprite.width > this.rightInnerBoundary) {

          //this.x = Math.floor(sprite.x + sprite.width - (this.width / 4 * 3));
          this.x = sprite.x + sprite.width - (this.width / 4 * 3);
        }
        if(sprite.y + sprite.height > this.bottomInnerBoundary) {

          //this.y = Math.floor(sprite.y + sprite.height - (this.height / 4 * 3));
          this.y = sprite.y + sprite.height - (this.height / 4 * 3);
        }
        //If the camera reaches the edge of the map, stop it from moving
        if(this.x < 0) {
          this.x = 0;
        }
        if(this.y < 0) {
          this.y = 0;
        }
        if(this.x + this.width > world.width) {
          this.x = world.width - this.width;
        }
        if(this.y + this.height > world.height) {
          this.y = world.height - this.height;
        }
      },
      centerOver: function(sprite) {

        //Center the camera over a sprite
        this.x = (sprite.x + sprite.halfWidth) - (this.width / 2);
        this.y = (sprite.y + sprite.halfHeight) - (this.height / 2);
      }
    };

    return camera;
  };
  
   /*
  ga.worldCamera = function(world, canvas) {
    var camera = ga.group();
    camera.width = canvas.width;
    camera.height = canvas.height;
    camera._x = 0;
    camera._y = 0;
    Object.defineProperties(camera, {
      x: {
        get: function() {
          return this._x; 
        },
        set: function(value) {
          this._x = value;
          world.x = -this._x;
          //world._previousX = world.x;
        },
        enumerable: true, configurable: true
      },
      y: {
        get: function() {
          return this._y; 
        },
        set: function(value) {
          this._y = value;
          world.y = -this._y;
          //world._previousY = world.y;
        },
        enumerable: true, configurable: true
      },
      rightInnerBoundary: {
        get: function() {
          return this.x + (this.width / 2) + (this.width / 4);
        },
        enumerable: true, configurable: true
      },
      leftInnerBoundary: {
        get: function() {
          return this.x + (this.width / 2) - (this.width / 4);
        },
        enumerable: true, configurable: true
      },
      topInnerBoundary: {
        get: function() {
          return this.y + (this.height / 2) - (this.height / 4);
        },
        enumerable: true, configurable: true
      },
      bottomInnerBoundary: {
        get: function() {
          return this.y + (this.height / 2) + (this.height / 4);
        },
        enumerable: true, configurable: true
      }
    });
    camera.follow = function(sprite) {
      //Check the sprites position in relation to the inner boundary
      if(sprite.x < this.leftInnerBoundary) {
        //Move the camera to follow the sprite if the sprite strays outside
        this.x = Math.floor(sprite.x - (this.width / 4));
      }
      if(sprite.y < this.topInnerBoundary) {
        this.y = Math.floor(sprite.y - (this.height / 4));
      }
      if(sprite.x + sprite.width > this.rightInnerBoundary) {
        this.x = Math.floor(sprite.x + sprite.width - (this.width / 4 * 3));
      }
      if(sprite.y + sprite.height > this.bottomInnerBoundary) {
        this.y = Math.floor(sprite.y + sprite.height - (this.height / 4 * 3));
      }
      //If the camera reaches the edge of the map, stop it from moving
      if(this.x < 0) {
        this.x = 0;
      }
      if(this.y < 0) {
        this.y = 0;
      }
      if(this.x + this.width > world.width) {
        this.x = world.width - this.width;
      }
      if(this.y + this.height > world.height) {
        this.y = world.height - this.height;
      }
    };
    camera.centerOver = function(sprite) {
      //Center the camera over a sprite
      this.x = (sprite.x + sprite.halfWidth) - (this.width / 2);
      this.y = (sprite.y + sprite.halfHeight) - (this.height / 2);
      console.log(world)
    };

    return camera;
  };
  */
  //### scaleToWindow
  //Center and scale the game engine inside the HTML page 
  ga.scaleToWindow = function(backgroundColor) {

    backgroundColor = backgroundColor || "#2C3539";
    var scaleX, scaleY, scale, center;
    
    //1. Scale the canvas to the correct size
    //Figure out the scale amount on each axis
    scaleX = window.innerWidth / ga.canvas.width;
    scaleY = window.innerHeight / ga.canvas.height;

    //Scale the canvas based on whichever value is less: `scaleX` or `scaleY`
    scale = Math.min(scaleX, scaleY);
    ga.canvas.style.transformOrigin = "0 0";
    ga.canvas.style.transform = "scale(" + scale + ")";

    //2. Center the canvas.
    //Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and 
    //square or tall canvases should be centered horizontally
    if (ga.canvas.width > ga.canvas.height) {
      if (ga.canvas.width * scale < window.innerWidth) {
        center = "horizontally";
      } else { 
        center = "vertically";
      }
    } else {
      if (ga.canvas.height * scale < window.innerHeight) {
        center = "vertically";
      } else { 
        center = "horizontally";
      }
    }
    
    //Center horizontally (for square or tall canvases)
    var margin;
    if (center === "horizontally") {
      margin = (window.innerWidth - ga.canvas.width * scale) / 2;
      ga.canvas.style.marginLeft = margin + "px";
      ga.canvas.style.marginRight = margin + "px";
    }

    //Center vertically (for wide canvases) 
    if (center === "vertically") {
      margin = (window.innerHeight - ga.canvas.height * scale) / 2;
      ga.canvas.style.marginTop = margin + "px";
      ga.canvas.style.marginBottom = margin + "px";
    }

    //3. Remove any padding from the canvas  and body and set the canvas
    //display style to "block"
    ga.canvas.style.paddingLeft = 0;
    ga.canvas.style.paddingRight = 0;
    ga.canvas.style.paddingTop = 0;
    ga.canvas.style.paddingBottom = 0;
    ga.canvas.style.display = "block";
    
    //4. Set the color of the HTML body background
    document.body.style.backgroundColor = backgroundColor;
    
    //5. Set the game engine and pointer to the correct scale. 
    //This is important for correct hit testing between the pointer and sprites
    ga.pointer.scale = scale;
    ga.scale = scale;

    //It's important to set `canvasHasBeenScaled` to `true` so that
    //the scale values aren't overridden by Ga's check for fullscreen
    //mode in the `update` function (in the `ga.js` file.)
    ga.canvas.scaled = true;

    //Fix some quirkiness in scaling for Safari
    var ua = navigator.userAgent.toLowerCase(); 
    if (ua.indexOf("safari") != -1) { 
      if (ua.indexOf("chrome") > -1) {
        // Chrome
      } else {
        // Safari
        ga.canvas.style.maxHeight = "100%";
        ga.canvas.style.minHeight = "100%";
      }
    }
  };



  //### scaleToFit - DEPRICATED - DO NOT USE!
  /*
  Center and scale Ga inside the HTML page. The `dimension` can be either "width" or "height"
  depending on you want to center the game horizontally ("width") or vertically ("height").
  */
  ga.scaleToFit = function(dimension, color) {
    var scaleX, scaleY, scale;

    if (dimension === "width") {
      scaleX = ga.canvas.width / window.innerWidth;
      scaleY = ga.canvas.height / window.innerHeight;
    }
    if (dimension === "height") {
      scaleX = window.innerWidth / ga.canvas.width;
      scaleY = window.innerHeight / ga.canvas.height;
    }
    scale = Math.min(scaleX, scaleY);
    ga.canvas.style.transformOrigin = "0 0";
    ga.canvas.style.transform = "scale(" + scale + ")";

    //Set the color of the HTML body background
    document.body.style.backgroundColor = color;

    //Center the canvas in the HTML body
    ga.canvas.style.paddingLeft = 0;
    ga.canvas.style.paddingRight = 0;
    ga.canvas.style.marginLeft = "auto";
    ga.canvas.style.marginRight = "auto";
    ga.canvas.style.display = "block";
    ga.canvas.style.minHeight = "100%";
    
    //Fix some quirkiness in scaling for Safari
    var ua = navigator.userAgent.toLowerCase(); 
    if (ua.indexOf('safari') != -1) { 
      if (ua.indexOf('chrome') > -1) {
        // Chrome
      } else {
        // Safari
        ga.canvas.style.maxHeight = "100%";
        ga.canvas.style.minHeight = "100%";
      }
    }
    
    //Set ga to the correct scale. This important for correct hit testing
    //between the pointer and sprites
    ga.scale = scale;
  };

  /*
  ### shake
  Use `shake` to create a shaking effect, like shaking the screen
  `shake` arguments: sprite, magnitude
  */
  ga.shake = function (sprite, magnitude) {
    var counter = 1,
        startX = sprite.x;
        startY = sprite.y;
    
    magnitude = magnitude || 64;    
    
    sprite.update = function() {
      if (counter < 10) {
        sprite.x = startX;
        sprite.y = startY;
        magnitude -= counter;
        sprite.x = ga.randomInt(-magnitude, magnitude);
        sprite.y = ga.randomInt(-magnitude, magnitude);
        counter += 1;
      }
      if (counter >= 10) {
        sprite.x = startX;
        sprite.y = startY;
        ga.particles.splice(ga.particles.indexOf(sprite), 1);
      }
    };
    ga.particles.push(sprite);
  }

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
  ga.fadeOut = function(sprite, speed, finalValue) {
    finalValue = finalValue || 0;
    var tween = {};
    tween.playing = true;
    tween.update = function() {
      if (tween.playing) {
        //Important! Use the sprite's `_alpha` property for this
        //instead of its relative `alpha` property. That's because we
        //want to tween the alpha property without taking into account
        //the sprite's parent's alpha as well.
        if (sprite._alpha > finalValue) {
          sprite._alpha -= speed;
          if (sprite._alpha < finalValue) sprite._alpha = finalValue;
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
  ga.fadeIn = function(sprite, speed, finalValue) {
    finalValue = finalValue || 1;
    var tween = {};
    tween.playing = true;
    tween.update = function() {
      if (tween.playing) {
        //Important! Use the sprite's `_alpha` property for this
        //instead of its relative `alpha` property. That's because we
        //want to tween the alpha property without taking into account
        //the sprite's parent's alpha as well.
        if (sprite._alpha < finalValue) {
          sprite._alpha += speed;
          if (sprite._alpha > finalValue) sprite._alpha = finalValue;
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
  
  //### fade
  //Use `fade` to fade-in or fade-out any spirte.
  //It's usually used along with the `pulse` effect (below.)
  //`fade` arguments:
  //sprite, speed, finalValue
  ga.fade = function(sprite, speed, finalValue) {
    finalValue = finalValue || 0;
    var tween = {};
    tween.playing = true;
    tween.update = function() {
      if (tween.playing) {
        //Fade out
        if (finalValue < sprite._alpha) {
          //Important! Use the sprite's `_alpha` property for this
          //instead of its relative `alpha` property. That's because we
          //want to tween the alpha property without taking into account
          //the sprite's parent's alpha as well.
          if (sprite._alpha > finalValue) {
            sprite._alpha -= speed;
            if (sprite._alpha < finalValue) sprite._alpha = finalValue;
          } else {
            tween.playing = false;
            if (tween.onComplete) tween.onComplete();
            //Remove the tween from Ga's `tweens` array.
            ga.tweens.splice(ga.tweens.indexOf(tween), 1);
          }
        }
        else {
          //Fade in
          if (sprite._alpha < finalValue) {
            sprite._alpha += speed;
            if (sprite._alpha > finalValue) sprite._alpha = finalValue;
          } else {
            tween.playing = false;
            if (tween.onComplete) tween.onComplete();
            //Remove the tween from Ga's `tweens` array.
            ga.tweens.splice(ga.tweens.indexOf(tween), 1);
          }
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

  //### pulse
  //Oscilates a sprite's alpha between 1 and 10
  //`pulse` arguments:
  //sprite, speedOfFade, finalAlphaValue, delayTimeInMillisecionds

  ga.pulse = function(sprite, speed, finalAlpha, delay) {
    if (delay === undefined) delay = 0;
    var pulse = {};
    function repeat(sprite, speed, finalAlpha, delay) {
      pulse.tween = ga.fade(sprite, speed, finalAlpha);
      pulse.tween.onComplete = function() {
        ga.wait(delay, function() {
          if(sprite._alpha < 1) {
            repeat(sprite, speed, 1, delay);
          } else {
            repeat(sprite, speed, 0, delay);
          }
        });
      };
    };
    repeat(sprite, finalAlpha, speed, delay);
    //Define the `playing` property
    Object.defineProperty(pulse, "playing", {
      get: function() {
        //Return the `tween` object's `playing` value
        return pulse.tween.playing;
      },
      enumerable: false, configurable: false
    });
    //Pause and play the pulse's tween
    pulse.pause = function() {
      pulse.tween.playing = false;
    };
    pulse.play = function() {
      pulse.tween.playing = true;
    };
    return pulse;
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
      bulletSpeed, bulletArray, bulletSprite) {
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
            columns, rows, cellWidth, cellHeight,
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
    if (columns === undefined) columns = 0;
    if (rows === undefined) rows = 0;
    if (cellWidth === undefined) cellWidth = 32;
    if (cellHeight === undefined) cellHeight = 32;
    if (xOffset === undefined) xOffset = 0;
    if (yOffset === undefined) yOffset = 0;
    if (centerCell === undefined) centerCell = false;
    
    /*
    if (!columns && columns !== 0) columns = 0;
    if (!rows && rows !== 0) rows = 0;
    if (!cellWidth && cellWidth !== 0) cellWidth = 32;
    if (!cellHeight && cellHeight !== 0) cellHeight = 32;
    if (!xOffset && xOffset !== 0) xOffset = 0;
    if (!yOffset && yOffset !== 0) yOffset = 0;
    centerCell = centerCell || false;
    */

    //Create an empty DisplayObjectContainer
    var container = ga.group();

    //The `create` method
    container.createGrid = function() {
      var length = columns * rows;
      for(var i = 0; i < length; i++) {
        var x = ((i % columns) * cellWidth),
            y = (Math.floor(i / columns) * cellHeight);

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
          sprite.x = x + (cellWidth / 2 ) - sprite.halfWidth + xOffset;
          sprite.y = y + (cellHeight / 2) - sprite.halfHeight + yOffset;
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
        this.percentage.y = (ga.canvas.height / 2) - 12;

        //Flag the progressBar as having been initialized
        this.initialized = true;
      }
    },
    update: function() {

      //Change the width of the blue `frontBar` to match the
      //ratio of assets that have loaded. Adding `+1` to
      //`assets.loaded` means that the loading bar will appear at 100%
      //when the last asset is being loaded, which is reassuring for the
      //player observing the load progress
      var ratio = (ga.assets.loaded + 1) / ga.assets.toLoad;
      this.frontBar.width = this.maxWidth * ratio;


      //Display the percentage
      this.percentage.content = Math.floor((ratio) * 100) + "%";
    },
    remove: function() {

      //Remove the progress bar
      ga.remove(this.frontBar);
      ga.remove(this.backBar);
      ga.remove(this.percentage);
    }
  };

  /*
  particleEffect
  -----

  Create particles with a versatile function called function called
  `particleEffect`. It's all you'll need for most 2D action games.
  Here's an example of how to use it to 
  produce a starburst effect at the pointer's x and y position.

      g.particleEffect(
        g.pointer.x,                             //The particle’s starting x position
        g.pointer.y,                             //The particle’s starting y position
        function(){                              //Particle function
          return g.sprite("images/star.png");
        },
        20,                                      //Number of particles
        0.1,                                     //Gravity
        true,                                    //Random spacing
        0, 6.28,                                 //Min/max angle
        12, 24,                                  //Min/max size
        1, 2,                                    //Min/max speed
        0.005, 0.01,                             //Min/max scale speed
        0.005, 0.01,                             //Min/max alpha speed
        0.05, 0.1                                //Min/max rotation speed
      );

  You can see that most of those arguments describe range between 
  the minimum and maximum values that should be used to change 
  the sprites’ speed, rotation, scale and alpha.
  You can also assign the number of particles that should be created,
  and add optional gravity. 

  You can make particles using any sprites by customizing the third argument. 
  Just supply a function that returns the kind of sprite you want to use for each particle:

      function(){                              
        return g.sprite("images/star.png");
      },

  If you supply a sprite that has multiple frames, the particleEffect 
  function will automatically choose a random frame for each particle.

  The minimum and maximum angle values are important for defining the 
  circular spread of particles as they radiate out from the origin point. 
  For a completely circular explosion effect, use a minimum angle 
  of 0, and a maximum angle for 6.28.

      0, 6.28

  (These numbers values are radians; the equivalent in degrees is 0 and 360.) 
  0 starts at the 3 o’clock position, pointing directly to the right. 3.14 
  is the 9 o’clock position, and 6.28 takes you around back to 0 again.

  If you want to constrain the particles to a narrower angle range, just supply 
  the minimum and maximum values that describe that range. Here are values 
  you could use to constrain the angle to a pizza-slice with the crust pointing left.

  2.4, 3.6

  You could use a constrained angle range like this to create a particle stream, 
  like a fountain or rocket engine flames. By carefully choosing the sprite for 
  the particle and finely adjusting each parameter, you can use this 
  all-purpose `particleEffect` function to simulate everything from liquid to fire. 
  */
  
  //First, you need an array to store the particles.
  ga.particles = [];

  ga.particleEffect = function(
    x, 
    y, 
    spriteFunction,
    numberOfParticles,
    gravity,
    randomSpacing,
    minAngle, maxAngle,
    minSize, maxSize, 
    minSpeed, maxSpeed,
    minScaleSpeed, maxScaleSpeed,
    minAlphaSpeed, maxAlphaSpeed,
    minRotationSpeed, maxRotationSpeed
  ) {

    if (x === undefined) x = 0;
    if (y === undefined) y = 0; 
    if (spriteFunction === undefined) spriteFunction = function(){return ga.circle(10, "red")};
    if (numberOfParticles === undefined) numberOfParticles = 10;
    if (gravity === undefined) gravity = 0;
    if (randomSpacing === undefined) randomSpacing = true;
    if (minAngle === undefined) minAngle = 0; 
    if (maxAngle === undefined) maxAngle = 6.28;
    if (minSize === undefined) minSize = 4; 
    if (maxSize === undefined) maxSize = 16; 
    if (minSpeed === undefined) minSpeed = 0.1; 
    if (maxSpeed === undefined) maxSpeed = 1; 
    if (minScaleSpeed === undefined) minScaleSpeed = 0.01; 
    if (maxScaleSpeed === undefined) maxScaleSpeed = 0.05;
    if (minAlphaSpeed === undefined) minAlphaSpeed = 0.02; 
    if (maxAlphaSpeed === undefined) maxAlphaSpeed = 0.02;
    if (minRotationSpeed === undefined) minRotationSpeed = 0.01; 
    if (maxRotationSpeed === undefined) maxRotationSpeed = 0.03;
    
    //`randomFloat` and `randomInt` helper functions
    var randomFloat = function(min, max){return min + Math.random() * (max - min)},
        randomInt = function(min, max){return Math.floor(Math.random() * (max - min + 1)) + min};

    //An array to store the angles
    var angles = [];

    //A variable to store the current particle's angle
    var angle;

    //Figure out by how many radians each particle should be separated
    var spacing = (maxAngle - minAngle) / (numberOfParticles - 1);

    //Create an angle value for each particle and push that
    //value into the `angles` array
    for(var i = 0; i < numberOfParticles; i++) {

      //If `randomSpacing` is `true`, give the particle any angle
      //value between `minAngle` and `maxAngle`
      if (randomSpacing) {
        angle = randomFloat(minAngle, maxAngle);
        angles.push(angle);
      } 
      
      //If `randomSpacing` is `false`, space each particle evenly,
      //starting with the `minAngle` and ending with the `maxAngle`
      else {
        if (angle === undefined) angle = minAngle;
        angles.push(angle);
        angle += spacing;
      }
    }

    //Make a particle for each angle
    angles.forEach(function(angle){
      makeParticle(angle)
    });

    //Make the particle
    function makeParticle(angle) {

      //Create the particle using the supplied sprite function
      var particle = spriteFunction();

      //Display a random frame if the particle has more than 1 frame
      if (particle.frames.length > 0) {
        particle.gotoAndStop(randomInt(0, particle.frames.length - 1));
      }

      //Set the x and y position
      particle.x = x - particle.halfWidth;
      particle.y = y - particle.halfHeight;

      //Set a random width and height
      var size = randomInt(minSize, maxSize);
      particle.width = size;
      particle.height = size;

      //Set a random speed to change the scale, alpha and rotation
      particle.scaleSpeed = randomFloat(minScaleSpeed, maxScaleSpeed);
      particle.alphaSpeed = randomFloat(minAlphaSpeed, maxAlphaSpeed);
      particle.rotationSpeed = randomFloat(minRotationSpeed, maxRotationSpeed);

      //Set a random velocity at which the particle should move
      var speed = randomFloat(minSpeed, maxSpeed);
      particle.vx = speed * Math.cos(angle);
      particle.vy = speed * Math.sin(angle);

      //The particle's `update` method is called on each frame of the
      //game loop
      particle.updateParticle = function() {

        //Add gravity
        particle.vy += gravity;

        //Move the particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        //Change the particle's `scale`
        if (particle.scaleX - particle.scaleSpeed > 0) {
          particle.scaleX -= particle.scaleSpeed;
        }
        if (particle.scaleY - particle.scaleSpeed > 0) {
          particle.scaleY -= particle.scaleSpeed;
        }

        //Change the particle's rotation
        particle.rotation += particle.rotationSpeed;

        //Change the particle's `alpha`
        particle.alpha -= particle.alphaSpeed;

        //Remove the particle if its `alpha` reaches zero
        if (particle.alpha <= 0) {
          ga.remove(particle);
          ga.particles.splice(ga.particles.indexOf(particle), 1);
        }
      };

      //Push the particle into the `particles` array
      //The `particles` array needs to be updated by the game loop each
      //frame
      ga.particles.push(particle);
    }
  }

  //`updateParticles` loops through all the sprites in `ga.particles`
  //and runs their `updateParticles` functions.
  ga.updateParticles = function() {
    
    //Update all the particles in the game.
    if (ga.particles.length > 0) {
      for(var i = ga.particles.length - 1; i >= 0; i--) {
        var particle = ga.particles[i];
        particle.updateParticle();
      }
    }
  }

  //Push `updateParticles` into the `ga.updateFunctions` array so that
  //it runs inside Ga's game loop. (See the `ga.update` method in the 
  //`ga.js` file to see how this works.
  ga.updateFunctions.push(ga.updateParticles);
  
  /*
  emitter
  -------

  Use the `emitter` function to create a constant stream of particles
  at fixed intervals. The emitter is a simple timer that calls the 
  `particleEffect` function repeatedly at intervals in milliseconds that
  you define. Use the emitter's `play` and `stop` methods to start and 
  stop the particle stream.

  Here's how to use it to create particle emitter that emits star sprites
  a 100ms intervals when the pointer is pressed:

      //Create the emitter
      var particleStream = g.emitter(
        100,                                           //The interval
        function(){
          return g.particleEffect(                     //The particle function
            g.pointer.x,                               //x position
            g.pointer.y,                               //y position
            function(){                                //Particle sprite
              return g.sprite("images/star.png");
            }, 
            10,                                        //Number of particles
            0.1,                                       //Gravity
            false,                                     //Random spacing
            3.14, 6.28,                                //Min/max angle
            16, 32,                                    //Min/max size
            2, 5                                       //Min/max speed
          );
        }
      );

      //Play the particle stream when the pointer is pressed
      g.pointer.press = function(){
        particleStream.play();
        console.log(particleStream.playing)
      };

      //Stop the particle stream when the pointer is released
      g.pointer.release = function(){
        particleStream.stop();
        console.log(particleStream.playing)
      };
  */

  ga.emitter = function(interval, particleFunction) {
    var emitter = {},
        timerInterval = undefined;

    emitter.playing = false;

    function play() {
      if (!emitter.playing) {
        particleFunction();
        timerInterval = setInterval(emitParticle.bind(this), interval);
        emitter.playing = true;
      }
    }

    function stop() {
      if (emitter.playing) {
        clearInterval(timerInterval);
        emitter.playing = false;
      }
    }

    function emitParticle() {
      particleFunction();
    }

    emitter.play = play;
    emitter.stop = stop;
    return emitter;
  }

  /*
  tilingSprite
  ------------
  Use a `tilingSprite` to create a seamless scrolling effect.
  You could use it to create an infinite scrolling background.
  Scroll the sprite's tile pattern using `tileX` and `tileY` properties.
  For example, you could create a tiling sprite like this:

      box = g.tilingSprite(128, 128, "images/tile.png");

  Then in the game loop, scroll the x and y background position like this:

      box.tileY += 1;
      box.tileX += 1;
      
  The position of the box won't change, but the position of the image that it contains will.
  
  */

  ga.tilingSprite = function(width, height, source, x, y) {

    //Set the defaults.
    if (x === undefined) x = 0;
    if (y === undefined) y = 0;

    //Figure out the tile's width and height.
    var tileWidth, tileHeight;

    //If the source is a texture atlas frame, use its
    //`frame.w` and `frame.h` properties.
    if(ga.assets[source].frame) {
      tileWidth = ga.assets[source].frame.w;
      tileHeight = ga.assets[source].frame.h;
    }

    //If it's an image, use the image's 
    //`width` and `height` properties.
    else {
      tileWidth = ga.assets[source].width;
      tileHeight = ga.assets[source].height;
    }

    //Figure out the rows and columns.
    //The number of rows and columns should always be
    //one greater than the total number of tiles
    //that can fit in the rectangle. This give us one 
    //additional row and column that we can reposition
    //to create the infinite scroll effect.

    var columns, rows;

    //1. Columns
    //If the width of the rectangle is greater than the width of the tile,
    //calculate the number of tile columns.
    if (width >= tileWidth) {
      columns = Math.round(width / tileWidth) + 1;
    } 
    
    //If the rectangle's width is less than the width of the
    //tile, set the columns to 2, which is the minimum.
    else {
      columns = 2;
    }

    //2. Rows
    //Calculate the tile rows in the same way.
    if (height >= tileHeight) {
      rows = Math.round(height / tileHeight) + 1;
    } else {
      rows = 2; 
    }

    //Create a grid of sprites that's just one sprite larger
    //than the `totalWidth` and `totalHeight`.
    var tileGrid = ga.grid(
      columns, rows, tileWidth, tileHeight, false, 0, 0,
      function(){

        //Make a sprite from the supplied `source`.
        var tile = ga.sprite(source);
        return tile;
      }
    );

    //Declare the grid's private properties that we'll use to
    //help scroll the tiling background.
    tileGrid._tileX = 0;
    tileGrid._tileY = 0;

    //Create an empty rectangle sprite without a fill or stoke color.
    //Set it to the supplied `width` and `height`.
    var container = ga.rectangle(width, height, "none", "none");
    container.x = x;
    container.y = y;

    //Set the rectangle's `mask` property to `true`. This switches on `ctx.clip()`
    //In the rectangle sprite's `render` method.
    container.mask = true;

    //Add the tile grid to the rectangle container.
    container.addChild(tileGrid);

    //Define the `tileX` and `tileY` properties on the parent container
    //so that you can scroll the tiling background.
    Object.defineProperties(container, {
      tileX: {
        get: function() {
          return tileGrid._tileX;
        },

        set: function(value) {

          //Loop through all of the grid's child sprites.
          tileGrid.children.forEach(function(child){

            //Figure out the difference between the new position
            //and the previous position.
            var difference = value - tileGrid._tileX;
            
            //Offset the child sprite by the difference.
            child.x += difference;

            //If the x position of the sprite exceeds the total width
            //of the visible columns, reposition it to just in front of the 
            //left edge of the container. This creates the wrapping
            //effect.
            if (child.x > (columns - 1) * tileWidth) {
              child.x = 0 - tileWidth + difference;
            }

            //Use the same procedure to wrap sprites that 
            //exceed the left boundary.
            if (child.x < 0 - tileWidth - difference) {
              child.x = (columns - 1) * tileWidth;
            }
          });

          //Set the private `_tileX` property to the new value.
          tileGrid._tileX = value;
        },
        enumerable: true, configurable: true
      },
      tileY: {
        get: function() {
          return tileGrid._tileY;
        },

        //Follow the same format to wrap sprites on the y axis.
        set: function(value) {
          tileGrid.children.forEach(function(child){
            var difference = value - tileGrid._tileY;
            child.y += difference;
            if (child.y > (rows - 1) * tileHeight) child.y = 0 - tileHeight + difference;
            if (child.y < 0 - tileHeight - difference) child.y = (rows - 1) * tileHeight;
          });
          tileGrid._tileY = value;
        },
        enumerable: true, configurable: true
      }
    });

    //Return the rectangle container.
    return container;
  }
  
  /*
  ### burst - DEPRICATED! DO NOT USE! Use `particleEffect` and `emitter` instead.
  A versatile particle explosion effect. It has lots of little parameters to tweak for maaking
  all sorts of particle burst effects. Here's an example of how to use it:

    g.burst(
      sprite.x, sprite.y,   //x and y
      function(){           //A function that returns the sprite to use for the particle
        return g.sprite(g.frame("images/tileset.png", 112, 0, 16, 16));
      },
      g.randomInt(5, 10),      //numberOfParticles
      4, 16,                //size
      3, 0.5,               //speed
      0.01, 0.05,           //scale speed
      0.01, 0.02,           //alpha speed
      0.01, 0.03            //rotation speed
    );

  */

  ga.burst = function(
    x, y, 
    spriteFunction,
    numberOfParticles, 
    minSize, maxSize, 
    minSpeed, maxSpeed,
    minScaleSpeed, maxScaleSpeed,
    minAlphaSpeed, maxAlphaSpeed,
    minRotationSpeed, maxRotationSpeed
  ) {

    //Assign defaults
    x = x || 0;
    y = y || 0;
    spriteFunction = spriteFunction || function(){return ga.circle(10, "red")}
    minSize = minSize || 4;
    maxSize = maxSize || 16;
    numberOfParticles = numberOfParticles || 10;
    minSpeed = minSpeed || 0.1;
    maxSpeed = maxSpeed || 1;
    minScaleSpeed = minScaleSpeed || 0.01;
    maxScaleSpeed = maxScaleSpeed || 0.05;
    minAlphaSpeed = minAlphaSpeed || 0.02;
    maxAlphaSpeed = maxAlphaSpeed || 0.02;
    minRotationSpeed = minRotationSpeed || 0.01;
    maxRotationSpeed = maxRotationSpeed || 0.03;

    //Create an angle value between 0 and 360 for each particle
    var angle;
    for (angle = 0; angle < 360; angle += Math.round(360 / numberOfParticles)) {
      makeParticle();
    }

    //Make the particle
    function makeParticle() {

      //Create the particle using the supplied sprite function
      var particle = spriteFunction();

      //Set the x and y position
      particle.x = x - particle.halfWidth;
      particle.y = y - particle.halfHeight;

      //Set a random width and height
      var size = ga.randomFloat(minSize, maxSize);
      particle.width = size;
      particle.height = size;

      //Set a random speed to change the scale, alpha and rotation
      particle.scaleSpeed = ga.randomFloat(minScaleSpeed, maxScaleSpeed);
      particle.alphaSpeed = ga.randomFloat(minAlphaSpeed, maxAlphaSpeed);
      particle.rotationSpeed = ga.randomFloat(minRotationSpeed, maxRotationSpeed);

      //Set a random velocity at which the particle should move
      var speed = ga.randomFloat(minSpeed, maxSpeed);
      particle.vx = speed * Math.cos(angle * Math.PI / 180);
      particle.vy = speed * Math.sin(angle * Math.PI / 180);

      //The particle's `update` method is called on each frame of the
      //game loop
      particle.update = function(){

        //Move the particle
        particle.x += particle.vx;
        particle.y += particle.vy;

        //Change the particle's `scale`
        if (particle.scaleX - particle.scaleSpeed > 0) {
          particle.scaleX -= particle.scaleSpeed;
        }
        if (particle.scaleY - particle.scaleSpeed > 0) {
          particle.scaleY -= particle.scaleSpeed;
        }

        //Change the particle's rotation
        particle.rotation += particle.rotationSpeed;

        //Change the particle's `alpha`
        particle.alpha -= particle.alphaSpeed;

        //Remove the particle if its `alpha` reaches zero
        if (particle.alpha <= 0) {
          ga.remove(particle);
          ga.particles.splice(ga.particles.indexOf(particle), 1);
        }
      };

      //Push the particles into ga's `particles` array
      //The `ga.particles` array is updated by the game loop each
      //frame
      ga.particles.push(particle);
    }
  }


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

  ga.hitTestCircle = function(c1, c2, global) {
    var vx, vy, magnitude, totalRadii, hit;

    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

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

  ga.hitTestRectangle = function(r1, r2, global) {
    var hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

    //A variable to determine whether there's a collision
    hit = false;

    //Calculate the distance vector
    if (global) {
      vx = (r1.gx + r1.halfWidth) - (r2.gx + r2.halfWidth);
      vy = (r1.gy + r1.halfHeight) - (r2.gy + r2.halfHeight);
    } else {
      vx = r1.centerX - r2.centerX;
      vy = r1.centerY - r2.centerY;
    }

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
  hitTestCircleRectangle
  ----------------

  Use it to find out if a circular shape is touching a rectangular shape
  Parameters: 
  a. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
  b. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.

  */

  ga.hitTestCircleRectangle = function(c1, r1, global) {

    var region, collision, c1x, c1y, r1x, r1y;
    
    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

    //Use either global or local coordinates
    if (global) {
      c1x = c1.gx;
      c1y = c1.gy
      r1x = r1.gx;
      r1y = r1.gy;
    } else {
      c1x = c1.x;
      c1y = c1.y
      r1x = r1.x;
      r1y = r1.y;
    }

    //Is the circle above the rectangle's top edge?
    if (c1y < r1y - r1.halfHeight) {

      //If it is, we need to check whether it's in the 
      //top left, top center or top right
      //(Increasing the size of the region by 2 pixels slightly weights
      //the text in favor of a rectangle vs. rectangle collision test.
      //This gives a more natural looking result with corner collisions
      //when physics is added)
      if(c1x < r1x - 1 - r1.halfWidth) {
        region = "topLeft";
      }
      else if (c1x > r1x + 1 + r1.halfWidth) {
        region = "topRight";
      }
      else {
        region = "topMiddle";
      }
    }

    //The circle isn't above the top edge, so it might be
    //below the bottom edge
    else if (c1y > r1y + r1.halfHeight) {

      //If it is, we need to check whether it's in the bottom left,
      //bottom center, or bottom right
      if (c1x < r1x - 1 - r1.halfWidth) {
        region = "bottomLeft";
      }
      else if (c1x > r1x + 1 + r1.halfWidth) {
        region = "bottomRight";
      }
      else {
        region = "bottomMiddle";
      }
    }

    //The circle isn't above the top edge or below the bottom edge,
    //so it must be on the left or right side
    else {
      if (c1x < r1x - r1.halfWidth) {
        region = "leftMiddle";
      }
      else {
        region = "rightMiddle";
      }
    }

    //Is this the circle touching the flat sides
    //of the rectangle?
    if (region === "topMiddle"
    || region === "bottomMiddle"
    || region === "leftMiddle"
    || region === "rightMiddle") {

      //Yes, it is, so do a standard rectangle vs. rectangle collision test
      collision = ga.hitTestRectangle(c1, r1, global);  
    } 

    //The circle is touching one of the corners, so do a
    //circle vs. point collision test
    else {
      var point = {};

      switch (region) {
        case "topLeft": 
          point.x = r1x;
          point.y = r1y;
          break;
        
        case "topRight":
          point.x = r1x + r1.width;
          point.y = r1y;
          break;

        case "bottomLeft":
          point.x = r1x;
          point.y = r1y + r1.height;
          break;

        case "bottomRight":
          point.x = r1x + r1.width;
          point.y = r1y + r1.height;
      }
      
      //Check for a collision between the circle and the point
      collision = ga.hitTestCirclePoint(c1, point, global);
    }

    //Return the result of the collision.
    //The return value will be `undefined` if there's no collision
    if (collision) {
      return region;
    } else {
      return collision;
    }
  }; 

  /*
  hitTestCirclePoint
  ------------------

  Use it to find out if a circular shape is touching a point
  Parameters: 
  a. A sprite object with `centerX`, `centerY`, and `radius` properties.
  b. A point object with `x` and `y` properties.

  */

  ga.hitTestCirclePoint = function(c1, point, global) {
    
    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

    //A point is just a circle with a diameter of
    //1 pixel, so we can cheat. All we need to do is an ordinary circle vs. circle
    //Collision test. Just supply the point with the properties
    //it needs
    point.diameter = 1;
    point.radius = 0.5;
    point.centerX = point.x;
    point.centerY = point.y;
    point.gx = point.x;
    point.gy = point.y;
    return ga.hitTestCircle(c1, point, global); 
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

    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

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

    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

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

  ga.movingCircleCollision = function(c1, c2, global) {
    var combinedRadii, overlap, xSide, ySide,
        //`s` refers to the collision surface
        s = {},
        p1A = {}, p1B = {}, p2A = {}, p2B = {},
        hit = false;

    //Apply mass, if the circles have mass properties
    c1.mass = c1.mass || 1;
    c2.mass = c2.mass || 1;

    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

    //Calculate the vector between the circles’ center points
    if(global) {

      //Use global coordinates
      s.vx = (c2.gx + c2.radius) - (c1.gx + c1.radius);
      s.vy = (c2.gy + c2.radius) - (c1.gy + c1.radius);
    } else {

      //Use local coordinates
      s.vx = c2.centerX - c1.centerX;
      s.vy = c2.centerY - c1.centerY;
    }

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

  ga.multipleCircleCollision = function(arrayOfCircles, global) {

    //Set `global` to a default value of `false`
    if(global === undefined) global = false;

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
        ga.movingCircleCollision(c1, c2, global);
      }
    }
  };

  /*
  circlePointCollision
  --------------------

  Use it to bounce a circular sprite off a point.
  Parameters: 
  a. A sprite object with `centerX`, `centerY`, and `radius` properties.
  b. A point object with `x` and `y` properties.

  */

  ga.circlePointCollision = function(c1, point, bounce, global) {
    
    //Set `global` and `bounce` to a default values of `false`
    if(global === undefined) global = false;
    if(bounce === undefined) bounce = false;

    //A point is just a circle with a diameter of
    //1 pixel, so we can cheat. All we need to do is an ordinary circle vs. circle
    //Collision test. Just supply the point with the properties
    //it needs
    point.diameter = 1;
    point.radius = 0.5;
    point.centerX = point.x;
    point.centerY = point.y;
    point.gx = point.x;
    point.gy = point.y;
    return ga.circleCollision(c1, point, bounce, global); 
  }

  /*
  circleRectangleCollision
  ------------------------

  Use it to bounce a circular shape off a rectangular shape
  Parameters: 
  a. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
  b. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.

  */

  ga.circleRectangleCollision = function(c1, r1, bounce, global) {

    var region, collision, c1x, c1y, r1x, r1y;
    
    //Set `global` and `bounce` to a default values of `false`
    if(global === undefined) global = false;
    if(bounce === undefined) bounce = false;

    //Use either the global or local coordinates
    if (global) {
      c1x = c1.gx;
      c1y = c1.gy
      r1x = r1.gx;
      r1y = r1.gy;
    } else {
      c1x = c1.x;
      c1y = c1.y
      r1x = r1.x;
      r1y = r1.y;
    }

    //Is the circle above the rectangle's top edge?
    if(c1y < r1y - r1.halfHeight) {

      //If it is, we need to check whether it's in the 
      //top left, top center or top right
      if(c1x < r1x - 1 - r1.halfWidth) {
        region = "topLeft";
      }
      else if (c1x > r1x + 1 + r1.halfWidth) {
        region = "topRight";
      }
      else {
        region = "topMiddle";
      }
    }

    //The circle isn't above the top edge, so it might be
    //below the bottom edge
    else if (c1y > r1y + r1.halfHeight) {

      //If it is, we need to check whether it's in the bottom left,
      //bottom center, or bottom right
      if (c1x < r1x - 1 - r1.halfWidth) {
        region = "bottomLeft";
      }
      else if (c1x > r1x + 1 + r1.halfWidth) {
        region = "bottomRight";
      }
      else {
        region = "bottomMiddle";
      }
    }

    //The circle isn't above the top edge or below the bottom edge,
    //so it must be on the left or right side
    else {
      if (c1x < r1x - r1.halfWidth) {
        region = "leftMiddle";
      }
      else {
        region = "rightMiddle";
      }
    }

    //Is this the circle touching the flat sides
    //of the rectangle?
    if (region === "topMiddle"
    || region === "bottomMiddle"
    || region === "leftMiddle"
    || region === "rightMiddle") {

      //Yes, it is, so do a standard rectangle vs. rectangle collision test
      collision = ga.rectangleCollision(c1, r1, bounce, global);  
    } 

    //The circle is touching one of the corners, so do a
    //circle vs. point collision test
    else {
      var point = {};

      switch (region) {
        case "topLeft": 
          point.x = r1x;
          point.y = r1y;
          break;
        
        case "topRight":
          point.x = r1x + r1.width;
          point.y = r1y;
          break;

        case "bottomLeft":
          point.x = r1x;
          point.y = r1y + r1.height;
          break;

        case "bottomRight":
          point.x = r1x + r1.width;
          point.y = r1y + r1.height;
      }
      
      //Check for a collision between the circle and the point
      collision = ga.circlePointCollision(c1, point, bounce, global);
    }

    if (collision) {
      return region;
    } else {
      return collision;
    }
  }

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
    global = global || false;

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

    function findCollisionType(a, b) {

      //Are `a` and `b` both sprites?
      //(We have to check again if this function was called from
      //`spriteVsArray`)
      var aIsASprite = a.parent !== undefined,
          bIsASprite = b.parent !== undefined;

      if (aIsASprite && bIsASprite) {

        //Yes, but what kind of sprites?
        if(a.diameter && b.diameter) {

          //They're circles
          return circleVsCircle(a, b);
        } 
        else if (a.diameter && !b.diameter) {

          //The first one is a circle and the second is a rectangle
          return circleVsRectangle(a, b);
        } 
        else {

          //They're rectangles
          return rectangleVsRectangle(a, b);
        }
      }

      //They're not both sprites, so what are they?
      //Is `a` not a sprite and does it have x and y properties?
      else if (bIsASprite && !(a.x === undefined) && !(a.y === undefined)) {

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
        return ga.hitTestCircle(a, b, global);
      }

      //Yes, the circles should react to the collision
      else {

        //Are they both moving?
        if (a.vx + a.vy !== 0 && b.vx + b.vy !== 0) {

          //Yes, they are both moving
          //(moving circle collisions always bounce apart so there's
          //no need for the third, `bounce`, argument)
          return ga.movingCircleCollision(a, b, global);
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
        return ga.hitTestRectangle(a, b, global);
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

    function circleVsRectangle(a, b) {

      //If the rectangles shouldn't react to the collision, just
      //test to see if they're touching
      if(!react) {
        return ga.hitTestCircleRectangle(a, b, global);
      } 
      else {
        return ga.circleRectangleCollision(a, b, bounce, global);
      }
    }
  };

  //### 2D Tile based collision utilities

  //#### getIndex
  //The `getIndex` helper method
  //converts a sprite's x and y position to an array index number.
  //It returns a single index value that tells you the map array
  //index number that the sprite is in
  ga.getIndex = function(x, y, tilewidth, tileheight, mapWidthInTiles) {
    var index = {};

    //Convert pixel coordinates to map index coordinates
    index.x = Math.floor(x / tilewidth);
    index.y = Math.floor(y / tileheight);

    //Return the index number
    return index.x + (index.y * mapWidthInTiles);
  };

  /*
  #### getTile
  The `getTile` helper method
  converts a tile's index number into x/y screen
  coordinates, and capture's the tile's grid index (`gid`) number.
  It returns an object with `x`, `y`, `centerX`, `centerY`, `width`, `height`, `halfWidth`
  `halffHeight` and `gid` properties. (The `gid` number is the value that the tile has in the
  mapArray) This lets you use the returned object
  with the 2d geometric collision functions like `hitTestRectangle`
  or `rectangleCollision`

  The `world` object requires these properties:
  `x`, `y`, `tilewidth`, `tileheight` and `widthInTiles`
  */
  ga.getTile = function(index, mapArray, world) {
    var tile = {}
    tile.gid = mapArray[index];
    tile.width = world.tilewidth;
    tile.height = world.tileheight;
    tile.halfWidth = world.tilewidth / 2;
    tile.halfHeight = world.tileheight / 2;
    tile.x = ((index % world.widthInTiles) * world.tilewidth) + world.x;
    tile.y = ((Math.floor(index / world.widthInTiles)) * world.tileheight) + world.y;
    tile.gx = tile.x;
    tile.gy = tile.y;
    tile.centerX = tile.x + world.tilewidth / 2;
    tile.centery = tile.y + world.tileheight / 2;

    //Return the tile object
    return tile;
  };

  /*
  #### surroundingCells
  The `surroundingCells` helper method returns an array containing 9
  index numbers of map array cells around any given index number.
  Use it for an efficient broadphase/narrowphase collision test.
  The 2 arguments are the index number that represents the center cell,
  and the width of the map array.
  */

  ga.surroundingCells = function(index, widthInTiles) {
    return [
      index - widthInTiles - 1,
      index - widthInTiles,
      index - widthInTiles + 1,
      index - 1,
      index,
      index + 1,
      index + widthInTiles - 1,
      index + widthInTiles,
      index + widthInTiles + 1,
    ];
  };

  //#### getPoints
  /*
  The `getPoints` method takes a sprite and returns
  an object that tells you what all its corner points are.
  If the sprite has a `collisionArea` property that defines a
  smaller rectangular area inside the sprite, that collision
  area will be used istead of the sprite's dimensions. Here's
  How you could define a `collsionArea` on a sprite:

      elf.collisionArea = {x: 22, y: 44, width: 20, height: 20};

  */

  ga.getPoints = function(s) {
    var ca = s.collisionArea;
    if (ca !== undefined) {
      return {
        topLeft: {x: s.x + ca.x, y: s.y + ca.y},
        topRight: {x: s.x + ca.x + ca.width, y: s.y + ca.y},
        bottomLeft: {x: s.x + ca.x, y: s.y + ca.y + ca.height},
        bottomRight: {x: s.x + ca.x + ca.width, y: s.y + ca.y + ca.height}
      };
    } else {
      return {
        topLeft: {x: s.x, y: s.y},
        topRight: {x: s.x + s.width - 1, y: s.y},
        bottomLeft: {x: s.x, y: s.y + s.height - 1},
        bottomRight: {x: s.x + s.width - 1, y: s.y + s.height - 1}
      };
    }
  };

  //### hitTestTile
  /*
  `hitTestTile` checks for a
  collision between a sprite and a tile in any map array that you
  specify. It returns a `collision` object.
  `collision.hit` is a Boolean that tells you if a sprite is colliding
  with the tile that you're checking. `collision.index` tells you the
  map array's index number of the colliding sprite. You can check for
  a collision with the tile against "every" corner point on the
  sprite, "some" corner points, or the sprite's "center" point.
  `hitTestTile` arguments:
  sprite, array, collisionTileGridIdNumber, worldObject, spritesPointsToCheck
  The `world` object (the 4th argument) has to have these properties:
  `tileheight`, `tilewidth`, `widthInTiles`.
  */

  ga.hitTestTile = function(sprite, mapArray, gidToCheck, world, pointsToCheck) {

    //Assign "some" as the default value for `pointsToCheck`
    pointsToCheck = pointsToCheck || "some";

    //The collision object that will be returned by this function
    var collision = {};

    //Which points do you want to check?
    //"every", "some" or "center"?
    switch (pointsToCheck) {
      case "center":
        //`hit` will be true only if the center point is touching
        var point = {center: {x: sprite.centerX, y: sprite.centerY}};
        sprite.collisionPoints = point;
        collision.hit = Object.keys(sprite.collisionPoints).some(checkPoints);
        break;
      case "every":
        //`hit` will be true if every point is touching
        sprite.collisionPoints = ga.getPoints(sprite);
        collision.hit = Object.keys(sprite.collisionPoints).every(checkPoints);
        break;
      case "some":
        //`hit` will be true only if some points are touching
        sprite.collisionPoints = ga.getPoints(sprite);
        collision.hit = Object.keys(sprite.collisionPoints).some(checkPoints);
        break;
    }

    //Loop through the sprite's corner points to find out if they are inside
    //an array cell that you're interested in. Return `true` if they are

    function checkPoints(key) {

      //Get a reference to the current point to check.
      //(`topLeft`, `topRight`, `bottomLeft` or `bottomRight` )
      var point = sprite.collisionPoints[key];

      //Find the point's index number in the map array
      collision.index = ga.getIndex(
        point.x, point.y,
        world.tilewidth, world.tileheight, world.widthInTiles
      );

      //Find out what the gid value is in the map position
      //that the point is currently over
      collision.gid = mapArray[collision.index];

      //If it matches the value of the gid that we're interested, in
      //then there's been a collision
      if (collision.gid === gidToCheck) {
        return true;
      } else {
        return false;
      }
    }

    //Return the collision object.
    //`collision.hit` will be true if a collision is detected.
    //`collision.index` tells you the map array index number where the
    //collision occured
    return collision;
  };

  //### updateMap
  /*
  `updateMap` takes a map array and adds a sprite's grid index number (`gid`) to it. 
  It finds the sprite's new index position, and retuns the new map array.
  You can use it to do very efficient collision detection in tile based game worlds.
  `updateMap` arguments:
  array, singleSpriteOrArrayOfSprites, worldObject
  The `world` object (the 4th argument) has to have these properties:
  `tileheight`, `tilewidth`, `widthInTiles`.
  The sprite objects have to have have these properties:
  `centerX`, `centerY`, `index`, `gid` (The number in the array that represpents the sprite)
  Here's an example of how you could use `updateMap` in your game code like this:
  
      blockLayer.data = g.updateMap(blockLayer.data, blockLayer.children, world);

  The `blockLayer.data` array would now contain the new index position numbers of all the 
  child sprites on that layer.
  */

  ga.updateMap = function(mapArray, spritesToUpdate, world) {

    //First create a map a new array filled with zeros.
    //The new map array will be exactly the same size as the original
    var newMapArray = mapArray.map(function(gid) {
      gid = 0;
      return gid;
    });

    //Is `spriteToUpdate` an array of sprites?
    if(spritesToUpdate instanceof Array) {

      //Get the index number of each sprite in the `spritesToUpdate` array
      //and add the sprite's `gid` to the matching index on the map
      spritesToUpdate.forEach(function(sprite) {

        //Find the new index number
        sprite.index = ga.getIndex(
          sprite.centerX, sprite.centerY,
          world.tilewidth, world.tileheight, world.widthInTiles
        );

        //Add the sprite's `gid` number to the correct index on the map
        newMapArray[sprite.index] = sprite.gid;
      });
    }

    //Is `spritesToUpdate` just a single sprite?
    else {
      var sprite = spritesToUpdate;
      //Find the new index number
      sprite.index = ga.getIndex(
        sprite.centerX, sprite.centerY,
        world.tilewidth, world.tileheight, world.widthInTiles
      );

      //Add the sprite's `gid` number to the correct index on the map
      newMapArray[sprite.index] = sprite.gid;
    }

    //Return the new map array to replace the previous one
    return newMapArray;
  }

  /*
  Chapter 4: Sprite controllers
  -----------------------------
  */

  //### fourKeyController

  ga.fourKeyController = function(s, speed, up, right, down, left) {

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

  /*
  Chapter 6: Tiled editor importers
  ---------------------------------
  Ga lets you import JSON files created by the popular Tiled Editor game map and level editor.

  www.mapeditor.org

  Two functions called `makeTiledWorld` and `makeIsoTiledWorld` (for isometric maps, coming soon!) use this data to
  automatically build your game world for you.

  To prepare your Tiled Editor game world for use in Ga, give any significant thing a
  `name` property. Anything with a `name` property in Tiled Editor can
  be accessed in your code by its string name. Tiled Editor layers have a
  `name` property by default, and you can assign custom `name`
  properties to tiles and objects. Not everything needs a `name` property, just
  things that you want to specifically access in the world after its created.
  */

  /*
  ### makeTiledWorld
  */

  ga.makeTiledWorld = function(tiledMap, tileset) {

    //Create a group called `world` to contain all the layers, sprites
    //and objects from the `tiledMap`. The `world` object is going to be
    //returned to the main game program
    tiledMap = ga.json(tiledMap);
    var world = ga.group();
    world.tileheight = tiledMap.tileheight;
    world.tilewidth = tiledMap.tilewidth;

    //Calculate the `width` and `height` of the world, in pixels
    world.width = tiledMap.width * tiledMap.tilewidth;
    world.height = tiledMap.height * tiledMap.tileheight;

    //Get a reference to the world's height and width in
    //tiles, in case you need to know this later (you will!)
    world.widthInTiles = tiledMap.width;
    world.heightInTiles = tiledMap.height;

    //Create an `objects` array to store references to any
    //named objects in the map. Named objects all have
    //a `name` property that was assigned in Tiled Editor
    world.objects = [];

    //The optional spacing (padding) around each tile
    //This is to account for spacing around tiles
    //that's commonly used with texture atlas tilesets. Set the
    //`spacing` property when you create a new map in Tiled Editor
    var spacing = tiledMap.tilesets[0].spacing;

    //Figure out how many columns there are on the tileset.
    //This is the width of the image, divided by the width
    //of each tile, plus any optional spacing thats around each tile
    var numberOfTilesetColumns =
      Math.floor(
        tiledMap.tilesets[0].imagewidth
        / (tiledMap.tilewidth + spacing)
      );

    //Loop through all the map layers
    tiledMap.layers.forEach(function(tiledLayer){

      //Make a group for this layer and copy
      //all of the layer properties onto it.
      var layerGroup = ga.group();

      Object.keys(tiledLayer).forEach(function(key) {
        //Add all the layer's properties to the group, except the
        //width and height (because the group will work those our for
        //itself based on its content).
        if (key !== "width" && key !== "height") {
          layerGroup[key] = tiledLayer[key];
        }
      });

      //Set the width and height of the layer to
      //the `world`'s width and height
      //layerGroup.width = world.width;
      //layerGroup.height = world.height;

      //Translate `opacity` to `alpha`
      layerGroup.alpha = tiledLayer.opacity;

      //Add the group to the `world`
      world.addChild(layerGroup);

      //Push the group into the world's `objects` array
      //So you can access it later
      world.objects.push(layerGroup);

      //Is this current layer a `tilelayer`?
      if (tiledLayer.type === "tilelayer") {

        //Loop through the `data` array of this layer
        tiledLayer.data.forEach(function(gid, index) {
          var tileSprite, texture, mapX, mapY, tilesetX, tilesetY,
              mapColumn, mapRow, tilesetColumn, tilesetRow;
          //If the grid id number (`gid`) isn't zero, create a sprite
          if (gid !== 0) {
            //Figure out the map column and row number that we're on, and then
            //calculate the grid cell's x and y pixel position.
            mapColumn = index % world.widthInTiles;
            mapRow = Math.floor(index / world.widthInTiles);
            mapX = mapColumn * world.tilewidth;
            mapY = mapRow * world.tileheight;

            //Figure out the column and row number that the tileset
            //image is on, and then use those values to calculate
            //the x and y pixel position of the image on the tileset
            tilesetColumn = ((gid - 1) % numberOfTilesetColumns);
            tilesetRow = Math.floor((gid - 1) / numberOfTilesetColumns);
            tilesetX = tilesetColumn * world.tilewidth;
            tilesetY = tilesetRow * world.tileheight;

            //Compensate for any optional spacing (padding) around the tiles if
            //there is any. This bit of code accumlates the spacing offsets from the
            //left side of the tileset and adds them to the current tile's position
            if (spacing > 0) {
              tilesetX
                += spacing
                + (spacing * ((gid - 1) % numberOfTilesetColumns));
              tilesetY
                += spacing
                + (spacing * Math.floor((gid - 1) / numberOfTilesetColumns));
            }

            //Use the above values to create the sprite's image from
            //the tileset image
            texture = ga.frame(
              tileset, tilesetX, tilesetY,
              world.tilewidth, world.tileheight
            );

            //I've dedcided that any tiles that have a `name` property are important
            //and should be accessible in the `world.objects` array.

            var tileproperties = tiledMap.tilesets[0].tileproperties,
                key = String(gid - 1);

            //If the JSON `tileproperties` object has a sub-object that
            //matches the current tile, and that sub-object has a `name` property,
            //then create a sprite and assign the tile properties onto
            //the sprite
            if (tileproperties[key] && tileproperties[key].name) {

              //Make a sprite
              tileSprite = ga.sprite(texture);

              //Copy all of the tile's properties onto the sprite
              //(This includes the `name` property)
              Object.keys(tileproperties[key]).forEach(function(property) {

                //console.log(tileproperties[key][property])
                tileSprite[property] = tileproperties[key][property];
              });

              //Push the sprite into the world's `objects` array
              //so that you can access it by `name` later
              world.objects.push(tileSprite);
            }

            //If the tile doesn't have a `name` property, just use it to
            //create an ordinary sprite (it will only need one texture)
            else {
              tileSprite = ga.sprite(texture);
            }

            //Position the sprite on the map
            tileSprite.x = mapX;
            tileSprite.y = mapY;

            //Make a record of the sprite's index number in the array
            //(We'll use this for collision detection later)
            tileSprite.index = index;

            //Make a record of the sprite's `gid` on the tileset.
            //This will also be useful for collision detection later
            tileSprite.gid = gid;

            //Add the sprite to the current layer group
            layerGroup.addChild(tileSprite);
          }
        });
      }

      //Is this layer an `objectgroup`?
      if (tiledLayer.type === "objectgroup") {
        tiledLayer.objects.forEach(function(object) {
          //We're just going to capture the object's properties
          //so that we can decide what to do with it later

          //Get a reference to the layer group the object is in
          object.group = layerGroup;

          //Because this is an object layer, it doesn't contain any
          //sprites, just data object. That means it won't be able to
          //calucalte its own height and width. To help it out, give
          //the `layerGroup` the same `width` and `height` as the `world`
          layerGroup.width = world.width;
          layerGroup.height = world.height;

          //Push the object into the world's `objects` array
          world.objects.push(object);
        });
      }
    });

    //Search functions
    //`world.getObject` and `world.getObjects`  search for and return
    //any sprites or objects in the `world.objects` array.
    //Any object that has a `name` propery in
    //Tiled Editor will show up in a search.
    //`getObject` gives you a single object, `getObjects` gives you an array
    //of objects.
    //`getObject` returns the actual search function, so you
    //can use the following format to directly access a single object:
    //sprite.x = world.getObject("anySprite").x;
    //sprite.y = world.getObject("anySprite").y;

    world.getObject = function (objectName) {
      this.searchForObject = function() {
        var foundObject;
        world.objects.some(function(object) {
          if (object.name && object.name === objectName) {
            foundObject = object;
            return true;
          }
        });
        if (foundObject) {
          return foundObject;
        } else {
          console.log("There is no object with the property name: " + objectName);
        }
      };

      //Return the search function
      return this.searchForObject();
    };

    world.getObjects = function (namesOfObjects) {
      var objectNames = Array.prototype.slice.call(arguments);
      var foundObjects = [];
      world.objects.forEach(function(object) {
        if (object.name && objectNames.indexOf(object.name) !== -1) {
          foundObjects.push(object);
        }
      });
      if (foundObjects.length > 0) {
        return foundObjects;
      } else {
        console.log("I could not find those objects");
      }
      return foundObjects;
    };

    //That's it, we're done!
    //Finally, return the `world` object back to the game program
    return world;
  };

  /*
  Chapter 7: The fullscreen module
  ---------------------------------
  
  Ga has a very simple way of running a game fullscreen:

      g.enableFullscreen();

  Add that to your game code just after the `start` method. As soon as the user
  clicks or touches the game canvas, the game will enter fullscreen mode. The
  game will be aligned and centered in the screen. 
  
  To exit fullscreen mode, the user can press `esc` on the keyboard. Or, you can 
  define your own custom exit keys by providing ascii key code numbers as 
  `enableFullScreen`'s arguments, like this:

      g.enableFullscreen(88, 120);

  In this case pressing lowercase `x` (88) or uppercase `X` (120) will exit fullscreen 
  mode. If you choose to use fullscreen mode, make sure you inform your users
  of the keys they need to press to exit it! 
  
  Or, preferably, don't use fullscreen mode at all. Many users will panic when your
  game takes over their entire screen, and may not intuitively understand how to 
  exit fullscreen mode. So, instead, consider using Ga's more user-friendly
  `scaleToWindow` method (listed in the code above.) `scaleToWindow` scales the game
  to the maximum browser window size and center aligns it for the best fit, without
  removing the browser's UI.

  An important note about fullscreen mode: The WHATWG spec only allows fullscreen mode
  to be activated if a user interacts with an HTML element (https://fullscreen.spec.whatwg.org).
  That means you can't use any of Ga's button `press` or `release` actions to 
  launch fullscreen mode. That's because buttons are canvas based code objects, not HTML
  elements. You'll see in the code below that fullscreen mode is launched using an 
  event listener attached directly to Ga's canvas.

  (A Fullscreen API polyfill exists at the head of the `ga.js` file)

  */

  //`fullscreenScale` is used to track the size of the scaled canvas
  //Ga's update loop need to know this so that it can dynmaically
  //adjust `ga.scale` and `ga.pointer.scale` depending on whether
  //fullscreen mode is active. 
  ga.fullscreenScale = 1;

  //`requestFullscreen` is used by `enableFullscreen` to launch
  //fullscreen mode.
  ga.requestFullScreen = function() {
    if (!document.fullscreenEnabled) {
      ga.canvas.requestFullscreen();
    }
  };

  //`exitFullscreen` is used by `enableFullscreen` to exit
  //fullscreen mode.
  ga.exitFullScreen = function() {
    if (document.fullscreenEnabled) {
      document.exitFullscreen();
    }
  };

  //`alignFullscreen` is called by `enableFullscreen` to center and
  //align the canvas vertically or horizontally inside the users
  //screen. It also sets `ga.fullscreenScale` that Ga's `update` loop
  //uses to changed the values of `ga.scale` and `ga.pointer.scale`
  //when fullscreen mode is entered or exited.
  ga.alignFullscreen = function() {
    var scaleX, scaleY;
    
    //Scale the canvas to the correct size.
    //Figure out the scale amount on each axis.
    scaleX = screen.width / ga.canvas.width;
    scaleY = screen.height / ga.canvas.height;

    //Set the scale based on whichever value is less: `scaleX` or `scaleY`.
    ga.fullscreenScale = Math.min(scaleX, scaleY);

    //To center the canvas we need to inject some CSS
    //and into the HTML document's `<style>` tag. Some
    //browsers require an existing `<style>` tag to do this, so
    //if no `<style>` tag already exists, let's create one and
    //append it to the `<body>:
    var styleSheets = document.styleSheets;
    if (styleSheets.length === 0) {
      var divNode = document.createElement("div");
      divNode.innerHTML = "<style></style>";
      document.body.appendChild(divNode);
    }
    
    //Unfortunately we also need to do some browser detection
    //to inject the full screen CSS with the correct vendor 
    //prefix. So, let's find out what the `userAgent` is.
    //`ua` will be an array containing lower-case browser names.
    var ua = navigator.userAgent.toLowerCase(); 

    //Now Decide whether to center the canvas vertically or horizontally.
    //Wide canvases should be centered vertically, and 
    //square or tall canvases should be centered horizontally.

    if (ga.canvas.width > ga.canvas.height) {

      //Center vertically.
      //Add CSS to the stylesheet to center the canvas vertically.
      //You need a version for each browser vendor, plus a generic
      //version
      //(Unfortunately the CSS string cannot include line breaks, so
      //it all has to be on one long line.)
      if (ua.indexOf("safari") !== -1 || ua.indexOf("chrome") !== -1) {
        document.styleSheets[0].insertRule("canvas:-webkit-full-screen {position: fixed; width: 100%; height: auto; top: 0; right: 0; bottom: 0; left: 0; margin: auto; object-fit: contain}", 0);
      }
      else if (ua.indexOf("firefox") !== -1) {
        document.styleSheets[0].insertRule("canvas:-moz-full-screen {position: fixed; width: 100%; height: auto; top: 0; right: 0; bottom: 0; left: 0; margin: auto; object-fit: contain;}", 0);
      }
      else if (ua.indexOf("opera") !== -1) {
        document.styleSheets[0].insertRule("canvas:-o-full-screen {position: fixed; width: 100%; height: auto; top: 0; right: 0; bottom: 0; left: 0; margin: auto; object-fit: contain;}", 0);
      }
      else if (ua.indexOf("explorer") !== -1) {
        document.styleSheets[0].insertRule("canvas:-ms-full-screen {position: fixed; width: 100%; height: auto; top: 0; right: 0; bottom: 0; left: 0; margin: auto; object-fit: contain;}", 0);
      }
      else {
        document.styleSheets[0].insertRule("canvas:fullscreen {position: fixed; width: 100%; height: auto; top: 0; right: 0; bottom: 0; left: 0; margin: auto; object-fit: contain;}", 0);
      }
    } else {

      //Center horizontally.
      if (ua.indexOf("safari") !== -1 || ua.indexOf("chrome") !== -1) {
        document.styleSheets[0].insertRule("canvas:-webkit-full-screen {height: 100%; margin: 0 auto; object-fit: contain;}", 0);
      }
      else if (ua.indexOf("firefox") !== -1) {
        document.styleSheets[0].insertRule("canvas:-moz-full-screen {height: 100%; margin: 0 auto; object-fit: contain;}", 0);
      }
      else if (ua.indexOf("opera") !== -1) {
        document.styleSheets[0].insertRule("canvas:-o-full-screen {height: 100%; margin: 0 auto; object-fit: contain;}", 0);
      }
      else if (ua.indexOf("msie") !== -1) {
        document.styleSheets[0].insertRule("canvas:-ms-full-screen {height: 100%; margin: 0 auto; object-fit: contain;}", 0);
      }
      else {
        document.styleSheets[0].insertRule("canvas:fullscreen {height: 100%; margin: 0 auto; object-fit: contain;}", 0);
      }
    }
  };

  //### enableFullscreen
  /*
  Use `enterFullscreen` to make the browser display the game full screen.
  It automatically centers the game canvas for the best fit. Optionally supply any number of ascii
  keycodes as arguments to represent the keyboard keys that should exit fullscreen mode.
  */
  ga.enableFullscreen = function(exitKeyCodes) {

    //Get an array of the optional exit key codes.
    if (exitKeyCodes) exitKeyCodes = Array.prototype.slice.call(arguments);

    //Center and align the fullscreen element.
    ga.alignFullscreen();

    //Add mouse and touch listeners to the canvas to enable
    //fullscreen mode.
    ga.canvas.addEventListener("mouseup", ga.requestFullScreen, false);
    ga.canvas.addEventListener("touchend", ga.requestFullScreen, false);

    if (exitKeyCodes) {
      exitKeyCodes.forEach(function(keyCode) {
        window.addEventListener(
          "keyup",
          function(event){
            if (event.keyCode === keyCode) {
              ga.exitFullScreen();
            }
            event.preventDefault();
          }, 
          false
        );
      });
    }
  }

  //This next function checks to see if the game is in 
  //full screen mode. If it is, the game's scale is set
  //to `fullscreen.scale`. If not, and the canvas hasn't already
  //been scaled, the scale reverts back to 1.   
  ga.scaleFullscreen = function() {
    if(document.fullscreenEnabled) {
      ga.scale = ga.fullscreenScale;
      ga.pointer.scale = ga.fullscreenScale;
    } else {
      if (!ga.canvas.scaled) {
        ga.scale = 1;
        ga.pointer.scale = 1;
      }
    }
  }

  //Push `scaleFullscreen` into the `updateFunctions` array so that
  //it will be updated by Ga's `update` function on each frame of the
  //game loop.
  ga.updateFunctions.push(ga.scaleFullscreen);
  
//plugins ends
};
