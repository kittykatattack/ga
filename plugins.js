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

### Prologue: Polyfills

- Necessary polyfills for some of the API's used in this file. 

### Chapter 1: Utilities

`move`: Make a sprite or group move (or an array of them) by updating its velocity.
`distance`: The distance in pixels between the center point of two sprites.
`followEase`: Make a sprite ease to the position of another sprite.
`easeProperty`: Ease a single sprite property to another value.
`slide`: Ease a sprite to a specific position.
`fadeIn`: Fade in a sprite.
`fadeOut`: Fade out a sprite.
`fade`: Fades in or out.
`pulse`: Uses the `fade` method to make a sprite's alpha oscillate.
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

### Chapter 2: The tweening module 

`tweens`: An array to store all of Ga's current tweens.
`updateTweens`: A function that updates all the tweens each frame inside Ga's game loop.
`ease`: An object that stores references to useful easing functions.
`tweenProperty`: A generic low-level method that tweens any sprite property.
`slide`: Make a sprite slide from one x/y position to another.
`fadeIn`: Fade a sprite in.
`fadeOut`: Fade a sprite out.
`pulse`: Make a sprite fade in and out in a loop.
`makeTween`: A low-level function to help construct complex tweens.
`scale`: Smoothly change the scale of a sprite.
`breathe`: A breathing effect that changes the sprite's scale in a continuous loop.
`strobe`: A psychedelic flashing scale effect.
`wobble`: Make a sprite wobble like a plate of jelly.
`removeTween`: A universal method for remove a tween from Ga's engine.
`followCurve`: Make a sprite follow a bezier curve that you can specify.
`followPath`: Make a sprite follow a path of connected waypoints.
`walkCurve`: Make a sprite follow a path of connected curves.

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

### Chapter 8: Sound

`ga.actx`: The audio context.
`makeSound`: a method for loading and controling sound files.
`sound`: a method that returns a sound file object.
`soundEffect`: a versatile method for generating sound effects from pure code.
`impulseResponse`: A helper method for adding reverb to sounds.

*/

/*
Prologue
--------

Some necessary polyfills for some of the newer APIs used in this file
*/

/*
### Fixing the WebAudio API.
The WebAudio API is so new that it's API is not consistently implemented properly across
all modern browsers. Thankfully, Chris Wilson's Audio Context Monkey Patch script
normalizes the API for maximum compatibility.

https://github.com/cwilso/AudioContext-MonkeyPatch/blob/gh-pages/AudioContextMonkeyPatch.js

It's included here.
Thank you, Chris!

*/

(function (global, exports, perf) {
  'use strict';

  function fixSetTarget(param) {
    if (!param)	// if NYI, just return
      return;
    if (!param.setTargetAtTime)
      param.setTargetAtTime = param.setTargetValueAtTime;
  }

  if (window.hasOwnProperty('webkitAudioContext') &&
      !window.hasOwnProperty('AudioContext')) {
    window.AudioContext = webkitAudioContext;

    if (!AudioContext.prototype.hasOwnProperty('createGain'))
      AudioContext.prototype.createGain = AudioContext.prototype.createGainNode;
    if (!AudioContext.prototype.hasOwnProperty('createDelay'))
      AudioContext.prototype.createDelay = AudioContext.prototype.createDelayNode;
    if (!AudioContext.prototype.hasOwnProperty('createScriptProcessor'))
      AudioContext.prototype.createScriptProcessor = AudioContext.prototype.createJavaScriptNode;

    AudioContext.prototype.internal_createGain = AudioContext.prototype.createGain;
    AudioContext.prototype.createGain = function() {
      var node = this.internal_createGain();
      fixSetTarget(node.gain);
      return node;
    };

    AudioContext.prototype.internal_createDelay = AudioContext.prototype.createDelay;
    AudioContext.prototype.createDelay = function(maxDelayTime) {
      var node = maxDelayTime ? this.internal_createDelay(maxDelayTime) : this.internal_createDelay();
      fixSetTarget(node.delayTime);
      return node;
    };

    AudioContext.prototype.internal_createBufferSource = AudioContext.prototype.createBufferSource;
    AudioContext.prototype.createBufferSource = function() {
      var node = this.internal_createBufferSource();
      if (!node.start) {
        node.start = function ( when, offset, duration ) {
          if ( offset || duration )
            this.noteGrainOn( when, offset, duration );
          else
            this.noteOn( when );
        }
      }
      if (!node.stop)
        node.stop = node.noteOff;
      fixSetTarget(node.playbackRate);
      return node;
    };

    AudioContext.prototype.internal_createDynamicsCompressor = AudioContext.prototype.createDynamicsCompressor;
    AudioContext.prototype.createDynamicsCompressor = function() {
      var node = this.internal_createDynamicsCompressor();
      fixSetTarget(node.threshold);
      fixSetTarget(node.knee);
      fixSetTarget(node.ratio);
      fixSetTarget(node.reduction);
      fixSetTarget(node.attack);
      fixSetTarget(node.release);
      return node;
    };

    AudioContext.prototype.internal_createBiquadFilter = AudioContext.prototype.createBiquadFilter;
    AudioContext.prototype.createBiquadFilter = function() {
      var node = this.internal_createBiquadFilter();
      fixSetTarget(node.frequency);
      fixSetTarget(node.detune);
      fixSetTarget(node.Q);
      fixSetTarget(node.gain);
      return node;
    };

    if (AudioContext.prototype.hasOwnProperty( 'createOscillator' )) {
      AudioContext.prototype.internal_createOscillator = AudioContext.prototype.createOscillator;
      AudioContext.prototype.createOscillator = function() {
        var node = this.internal_createOscillator();
        if (!node.start)
          node.start = node.noteOn;
        if (!node.stop)
          node.stop = node.noteOff;
        fixSetTarget(node.frequency);
        fixSetTarget(node.detune);
        return node;
      };
    }
  }
}(window));

//### Fixing the Fullscreen API.
//The Fullscreen API is also in flux and has a quirky browser
//implementations. Here's a fix for it, thanks to Norman Paschke:
//https://github.com/neovov/Fullscreen-API-Polyfill/blob/master/fullscreen-api-polyfill.js

(function (doc) {
	// Use JavaScript script mode
	"use strict";

	/*global Element */

	var pollute = true,
		api,
		vendor,
		apis = {
			// http://dvcs.w3.org/hg/fullscreen/raw-file/tip/Overview.html
			w3: {
				enabled: "fullscreenEnabled",
				element: "fullscreenElement",
				request: "requestFullscreen",
				exit:    "exitFullscreen",
				events: {
					change: "fullscreenchange",
					error:  "fullscreenerror"
				}
			},
			webkit: {
				enabled: "webkitIsFullScreen",
				element: "webkitCurrentFullScreenElement",
				request: "webkitRequestFullScreen",
				exit:    "webkitCancelFullScreen",
				events: {
					change: "webkitfullscreenchange",
					error:  "webkitfullscreenerror"
				}
			},
			moz: {
				enabled: "mozFullScreen",
				element: "mozFullScreenElement",
				request: "mozRequestFullScreen",
				exit:    "mozCancelFullScreen",
				events: {
					change: "mozfullscreenchange",
					error:  "mozfullscreenerror"
				}
			},
			ms: {
				enabled: "msFullscreenEnabled",
				element: "msFullscreenElement",
				request: "msRequestFullscreen",
				exit:    "msExitFullscreen",
				events: {
					change: "MSFullscreenChange",
					error:  "MSFullscreenError"
				}
			}
		},
		w3 = apis.w3;

	// Loop through each vendor's specific API
	for (vendor in apis) {
		// Check if document has the "enabled" property
		if (apis[vendor].enabled in doc) {
			// It seems this browser support the fullscreen API
			api = apis[vendor];
			break;
		}
	}

	function dispatch( type, target ) {
		var event = doc.createEvent( "Event" );

		event.initEvent( type, true, false );
		target.dispatchEvent( event );
	} // end of dispatch()

	function handleChange( e ) {
		// Recopy the enabled and element values
		doc[w3.enabled] = doc[api.enabled];
		doc[w3.element] = doc[api.element];

		dispatch( w3.events.change, e.target );
	} // end of handleChange()

	function handleError( e ) {
		dispatch( w3.events.error, e.target );
	} // end of handleError()

	// Pollute only if the API doesn't already exists
	if (pollute && !(w3.enabled in doc) && api) {
		// Add listeners for fullscreen events
		doc.addEventListener( api.events.change, handleChange, false );
		doc.addEventListener( api.events.error,  handleError,  false );

		// Copy the default value
		doc[w3.enabled] = doc[api.enabled];
		doc[w3.element] = doc[api.element];

		// Match the reference for exitFullscreen
		doc[w3.exit] = doc[api.exit];

		// Add the request method to the Element's prototype
		Element.prototype[w3.request] = function () {
			return this[api.request].apply( this, arguments );
		};
	}

	// Return the API found (or undefined if the Fullscreen API is unavailable)
	return api;

}(document));

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
    if (sprites instanceof Array === false) {
      internal_move(sprites)
    } else {
      for (var i = 0; i < sprites.length; i++) {
        internal_move(sprites[i])
      }
    }
  };

  function internal_move(sprite) {
    sprite.x += sprite.vx | 0;
    sprite.y += sprite.vy | 0;
  }

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
    return setTimeout(callBack, duration);
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
  ###shakingSprites

  An array to store all the shaking sprites in the game
  */

  ga.shakingSprites = [];

  /*
  ###updateShakingSprites
  
  `updateShakingSprites` loops through all the sprites in `ga.particles`
  and runs their `updateParticles` functions.
  */

  ga.updateShakingSprites = function() {
    
    //Update all the shaking sprites
    if (ga.shakingSprites.length > 0) {
      for(var i = ga.shakingSprites.length - 1; i >= 0; i--) {
        var shakingSprite = ga.shakingSprites[i];
        if (shakingSprite.updateShake) shakingSprite.updateShake();
      }
    }
  }

  //Push `updateShakingSprites` into the `ga.updateFunctions` array so that
  //it runs inside Ga's game loop. (See the `ga.update` method in the 
  //`ga.js` file to see how this works.
  ga.updateFunctions.push(ga.updateShakingSprites);

  /*
  shake
  -----

  Used to create a shaking effect, like a screen shake.
  `shake` arguments: sprite, magnitude, angularShake?
  Use it like this:

      g.shake(sprite, 0.05, true);

  If `angularShake?` (the 3rd argument) is `true`, the sprite will shake around
  its axis. The `magnitude` will be the maximum value, in
  radians, that it should shake. 
  
  If `angularShake?` is `false` the shake effect will happen on the x/y axis. 
  
      g.shake(sprite, 16, false);

  In that case the magnitude will be the maximum amount of 
  displacement, in pixels.
  */

  ga.shake = function(sprite, magnitude, angular) {

    if (magnitude === undefined) magnitude = 16;
    if (angular === undefined) angular = false;

    //A counter to count the number of shakes
    var counter = 1;

    //The total number of shakes (there will be 1 shake per frame)
    var numberOfShakes = 10;

    //Capture the sprite's position and angle so you can
    //restore them after the shaking has finished
    var startX = sprite.x,
        startY = sprite.y,
        startAngle = sprite.rotation;

    //Divide the magnitude into 10 units so that you can 
    //reduce the amount of shake by 10 percent each frame
    var magnitudeUnit = magnitude / numberOfShakes;
    
    //The `randomInt` helper function
    var randomInt = function(min, max){
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    //Add the sprite to the `shakingSprites` array if it
    //isn't already there
    if(ga.shakingSprites.indexOf(sprite) === -1) {

      ga.shakingSprites.push(sprite);
      
      //Add an `updateShake` method to the sprite.
      //The `updateShake` method will be called each frame
      //in the game loop. The shake effect type can be either
      //up and down (x/y shaking) or angular (rotational shaking).
      sprite.updateShake = function(){
        if(angular) {
          angularShake();
        } else {
          upAndDownShake();
        }
      };
    }

    //The `upAndDownShake` function
    function upAndDownShake() {

      //Shake the sprite while the `counter` is less than 
      //the `numberOfShakes`
      if (counter < numberOfShakes) {

        //Reset the sprite's position at the start of each shake
        sprite.x = startX;
        sprite.y = startY;

        //Reduce the magnitude
        magnitude -= magnitudeUnit;

        //Randomly change the sprite's position
        sprite.x += randomInt(-magnitude, magnitude);
        sprite.y += randomInt(-magnitude, magnitude);

        //Add 1 to the counter
        counter += 1;
      }

      //When the shaking is finished, restore the sprite to its original 
      //position and remove it from the `shakingSprites` array
      if (counter >= numberOfShakes) {
        sprite.x = startX;
        sprite.y = startY;
        ga.shakingSprites.splice(ga.shakingSprites.indexOf(sprite), 1);
      }
    }
    
    //The `angularShake` function
    //First set the initial tilt angle to the right (+1) 
    var tiltAngle = 1;

    function angularShake() {
      if (counter < numberOfShakes) {

        //Reset the sprite's rotation
        sprite.rotation = startAngle;

        //Reduce the magnitude
        magnitude -= magnitudeUnit;

        //Rotate the sprite left or right, depending on the direction,
        //by an amount in radians that matches the magnitude
        sprite.rotation = magnitude * tiltAngle;
        counter += 1;

        //Reverse the tilt angle so that the sprite is tilted
        //in the opposite direction for the next shake
        tiltAngle *= -1;
      }

      //When the shaking is finished, reset the sprite's angle and
      //remove it from the `shakingSprites` array
      if (counter >= numberOfShakes) {
        sprite.rotation = startAngle;
        ga.shakingSprites.splice(ga.shakingSprites.indexOf(sprite), 1);
      }
    }
  };
 
  /*
  Chapter 2: The tweening module
  ---------------------------------------------------------

  Ga has some special tween functions to help you manage scene transitions
  or to make sprites move in a fixed or repeating way:

      `slide`: Make a sprite slide from one x/y position to another.
      `fadeIn`: Fade a sprite in.
      `fadeOut`: Fade a sprite out.
      `pulse`: Make a sprite fade in and out in a loop.
      `scale`: Smoothly change the scale of a sprite.
      `breathe`: A breathing effect that changes the sprite's scale in a loop.
      `strobe`: A psychedelic flashing scale effect.
      `wobble`: Make a sprite wobble like a plate of jelly.

  All these methods return a `tween` object. You
  attach an `onComplete` method to the `tween` object to do something
  when the tween has finished. It also has a Boolean `playing`
  property that tells you whether or not the tween is playing. Use
  `tween.pause()` and `tween.play()` to pause and play the tweens at
  any time. You can completely remove a tween with
  `ga.removeTween(tweenObject)`.

  Most of these methods have a `yoyo` Boolean argument that, if `true`,
  will make the sprite bounce back and
  forth between its start and end points, forever. You can supply an
  optional `delay` argument that defines how long, in milliseconds, the
  tween should hold its position until it bounces back again. 

  All of these special tweens are managed in Ga's `tweens` array. Ga's game loop
  calls each tween object's `update` function each frame.

  See the `scenesAndTweening` and `tweening.html` file in the `examples` folder for a demonstration of how
  to use these tweening methods.

  */

  /*
  ###tweens
  An array to store all the tweens in the game
  */

  ga.tweens = [];

  /*
  ###updateTweens
  `updateTweens` loops through all the sprites in `ga.particles`
  and runs their `updateParticles` functions.
  */

  ga.updateTweens = function() {
    
    //Update all the particles in the game.
    if (ga.tweens.length > 0) {
      for(var i = ga.tweens.length - 1; i >= 0; i--) {
        var tween = ga.tweens[i];
        if (tween) tween.update();
      }
    }
  }

  //Push `updateTweens` into the `ga.updateFunctions` array so that
  //it runs inside Ga's game loop. (See the `ga.update` method in the 
  //`ga.js` file to see how this works.
  ga.updateFunctions.push(ga.updateTweens);

  //###Easing functions
  //These are low-level functions that you won't use directly.
  //Instead, their used by the higher-level tweening functions.

  //Bezier curve
  ga.cubicBezier = function(t, a, b, c, d) {
    var t2 = t * t;
    var t3 = t2 * t;
    return a  
      + (-a * 3 + t * (3 * a - a * t)) * t
      + (3 * b + t * (-6 * b + b * 3 * t)) * t 
      + (c * 3 - c * 3 * t) * t2 + d * t3;
  }

  //The `ease` object. It stores all the easing functions
  var ease = {

    //Linear
    linear: function(x) {return x;},

    //Smoothstep
    smoothstep: function(x) {return x * x * (3 - 2 * x);},
    smoothstepSquared: function(x) {return Math.pow((x * x * (3 - 2 * x)), 2);},
    smoothstepCubed: function(x) {return Math.pow((x * x * (3 - 2 * x)), 3);},

    //Acceleration
    acceleration: function(x) {return x * x;},
    accelerationCubed: function(x) {return Math.pow(x * x, 3);},

    //Deceleration
    deceleration: function(x) {return 1 - Math.pow(1 - x, 2);},
    decelerationCubed: function(x) {return 1 - Math.pow(1 - x, 3);},

    //Sine
    sine: function(x) {return Math.sin(x * Math.PI / 2);},
    sineSquared: function(x) {return Math.pow(Math.sin(x * Math.PI / 2), 2);},
    sineCubed: function(x) {return Math.pow(Math.sin(x * Math.PI / 2), 2);},
    inverseSine: function(x) {return 1 - Math.sin((1 - x) * Math.PI / 2);},
    inverseSineSquared: function(x) {return 1 - Math.pow(Math.sin((1 - x) * Math.PI / 2), 2);},
    inverseSineCubed: function(x) {return 1 - Math.pow(Math.sin((1 - x) * Math.PI / 2), 3);},

    //Spline
    spline: function(t, p0, p1, p2, p3) {
      return 0.5 * (
        (2 * p1) +
        (-p0 + p2) * t +
        (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t +
        (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t
      );
    }
  };

  //###`tweenProperty`
  //A low-level function that you can use to tween any sprite
  //property. It's used by all the higher-level tween functions,
  //but you can use it to create your own custom tween effects.

  ga.tweenProperty = function(
    sprite,                  //Sprite object
    property,                //String property
    startValue,              //Tween start value
    endValue,                //Tween end value
    totalFrames,             //Duration in frames
    type,                    //The easing type
    yoyo,                    //Yoyo?
    delayBeforeRepeat        //Delay in milliseconds before repeating
  ) {

    //Set defaults
    if (totalFrames === undefined) totalFrames = 60;
    if (type === undefined) type = "smoothstep";
    if (yoyo === undefined) yoyo = false;
    if (delayBeforeRepeat === undefined) delayBeforeRepeat = 0;

    //Create the tween object
    var o = {};

    //If the tween is a bounce type (a spline), set the
    //start and end magnitude values
    var typeArray = type.split(" ");
    if (typeArray[0] === "bounce") {
      o.startMagnitude = parseInt(typeArray[1]);
      o.endMagnitude = parseInt(typeArray[2]);
    }

    //Use `o.start` to make a new tween using the current
    //end point values
    o.start = function(startValue, endValue) {

      //Clone the start and end values so that any possible references to sprite
      //properties are converted to ordinary numbers 
      o.startValue = JSON.parse(JSON.stringify(startValue));
      o.endValue = JSON.parse(JSON.stringify(endValue));
      o.playing = true;
      o.totalFrames = totalFrames;
      o.frameCounter = 0;

      //Add the tween to the global `tweens` array. The `tweens` array is
      //updated on each frame
      ga.tweens.push(o);
    };

    //Call `o.start` to start the tween
    o.start(startValue, endValue);

    //The `update` method will be called on each frame by the game loop.
    //This is what makes the tween move
    o.update = function() {
      
      var time, curvedTime;

      if (o.playing) {

        //If the elapsed frames are less than the total frames,
        //use the tweening formulas to move the sprite
        if (o.frameCounter < o.totalFrames) {

          //Find the normalized value
          var normalizedTime = o.frameCounter / o.totalFrames;

          //Select the correct easing function from the 
          //`ease` object’s library of easing functions

          //If it's not a spline, use one of the ordinary easing functions
          if (typeArray[0] !== "bounce") {
            curvedTime = ease[type](normalizedTime);
          } 
          
          //If it's a spline, use the `spline` function and apply the
          //2 additional `type` array values as the spline's start and
          //end points
          else {
            curvedTime = ease.spline(normalizedTime, o.startMagnitude, 0, 1, o.endMagnitude);
          }

          //Interpolate the sprite's property based on the curve
          sprite[property] = (o.endValue * curvedTime) + (o.startValue * (1 - curvedTime));

          o.frameCounter += 1;
        }

        //When the tween has finished playing, run the end tasks
        else {
          o.end(); 
        }
      }
    };
      
    //The `end` method will be called when the tween is finished
    o.end = function() {

      //Set `playing` to `false`
      o.playing = false;

      //Call the tween's `onComplete` method, if it's been assigned
      if (o.onComplete) o.onComplete();

      //Remove the tween from the `tweens` array
      ga.tweens.splice(ga.tweens.indexOf(o), 1);

      //If the tween's `yoyo` property is `true`, create a new tween
      //using the same values, but use the current tween's `startValue`
      //as the next tween's `endValue` 
      if (yoyo) {
        ga.wait(delayBeforeRepeat, function() {
          o.start(o.endValue, o.startValue);
        });
      }
    };

    //Pause and play methods
    o.play = function() {o.playing = true;};
    o.pause = function() {o.playing = false;};
    
    //Return the tween object
    return o;
  }

  /* High level tween functions */

  //###`fadeOut`
  //Fade a sprite out, over a duration in frames.
  ga.fadeOut = function(sprite, frames) {
    if (frames === undefined) frames = 60;
    return ga.tweenProperty(
      sprite, "alpha", sprite.alpha, 0, frames, "sine"
    );
  }

  //###`fadeIn`
  //Fade a sprite in, over a duration in frames.
  ga.fadeIn = function(sprite, frames) {
    if (frames === undefined) frames = 60;
    return ga.tweenProperty(
      sprite, "alpha", sprite.alpha, 1, frames, "sine"
    );
  }

  //`pulse`
  //Fades the sprite in and out at a steady rate over a duration in
  //frames. Set the `minAlpha` to something greater than 0 if you
  //don't want the sprite to fade away completely.
  ga.pulse = function(sprite, frames, minAlpha) {
    if (frames === undefined) frames = 60;
    if (minAlpha === undefined) minAlpha = 0;
    return ga.tweenProperty(
      sprite, "alpha", sprite.alpha, minAlpha, frames, "smoothstep", true
    );
  }

  //`makeTween` is a general function for making complex tweens
  //out of multiple `tweenProperty` functions. It's one argument,
  //`tweensToAdd` is an array containing multiple `tweenProperty` calls.
  //(See the `tweenProperty` function above for information on how it
  //works.)

  ga.makeTween = function(tweensToAdd) {

    //Create an object to manage the tweens
    var o = {};

    //Create a `tweens` array to store the new tweens
    o.tweens = [];

    //Make a new tween for each array
    tweensToAdd.forEach(function(tweenPropertyArguments) {
      
      //Use the tween property arguments to make a new tween
      var newTween = ga.tweenProperty(
        tweenPropertyArguments[0],
        tweenPropertyArguments[1],
        tweenPropertyArguments[2],
        tweenPropertyArguments[3],
        tweenPropertyArguments[4],
        tweenPropertyArguments[5],
        tweenPropertyArguments[6],
        tweenPropertyArguments[7]
      );

      //Push the new tween into this object's internal `tweens` array
      o.tweens.push(newTween);
    });

    //Add a counter to keep track of the
    //number of tweens that have completed their actions
    var completionCounter = 0;
    
    //`o.completed` will be called each time one of the tweens
    //finishes
    o.completed = function() {

      //Add 1 to the `completionCounter`
      completionCounter += 1;

      //If all tweens have finished, call the user-defined `onComplete`
      //method, if it's been assigned. Reset the `completionCounter`
      if (completionCounter === o.tweens.length) {
        if (o.onComplete) o.onComplete();
        completionCounter = 0;
      }
    }; 

    //Add `onComplete` methods to all tweens
    o.tweens.forEach(function(tween) {
      tween.onComplete = function() {o.completed();};
    });
    
    //Add pause and play methods to control all the tweens
    o.pause = function() {
      o.tweens.forEach(function(tween) {
        tween.playing = false;
      });
    };
    o.play = function() {
      o.tweens.forEach(function(tween) {
        tween.playing = true;
      });
    };

    //Return the tween object
    return o;
  }

  //###`slide`
  //Make a sprite slide from one x/y position to another.
  //Use `slide` like this:
  //var spriteSlide = g.slide(sprite, 400, 0, 60, "smoothstep", true, 0);
  
  ga.slide = function(
    sprite, endX, endY, 
    frames, type, yoyo, delayBeforeRepeat
  ) {

    //Set defaults
    if (frames === undefined) frames = 60;
    if (type === undefined) type = "smoothstep";
    if (yoyo === undefined) yoyo = false;
    if (delayBeforeRepeat === undefined) delayBeforeRepeat = 0;

    return ga.makeTween([ 

      //Create the x axis tween
      [sprite, "x", sprite.x, endX, frames, type, yoyo, delayBeforeRepeat],

      //Create the y axis tween
      [sprite, "y", sprite.y, endY, frames, type, yoyo, delayBeforeRepeat]

    ]);
  }

  //###`breathe`
  //Make a sprite appear to breathe, by changing its scale in a
  //continuous loop.
  //Use it like this:
  //var spriteBreathe = g.breathe(sprite, 1.2, 1.2, 60, true, 300);

  ga.breathe = function(
    sprite, endScaleX, endScaleY, 
    frames, yoyo, delayBeforeRepeat
  ) {

    //Set defaults
    if (frames === undefined) frames = 60;
    if (yoyo === undefined) yoyo = true;
    if (delayBeforeRepeat === undefined) delayBeforeRepeat = 0;

    return ga.makeTween([ 

      //Create the scaleX tween
      [
        sprite, "scaleX", sprite.scaleX, endScaleX, 
        frames, "smoothstepSquared", yoyo, delayBeforeRepeat
      ],

      //Create the scaleY tween
      [
        sprite, "scaleY", sprite.scaleY, endScaleY, 
        frames, "smoothstepSquared", yoyo, delayBeforeRepeat
      ]
    ]);
  }

  //###`scale` smoothly change a sprite's scale. Use it like this:
  //var spriteScale = g.scale(sprite, finalScaleX, finalScaleY, frames);

  ga.scale = function(sprite, endScaleX, endScaleY, frames) {
    
    //Set defaults
    if (frames === undefined) frames = 60;

    return ga.makeTween([ 

      //Create the scaleX tween
      [
        sprite, "scaleX", sprite.scaleX, endScaleX, 
        frames, "smoothstep", false
      ],

      //Create the scaleY tween
      [
        sprite, "scaleY", sprite.scaleY, endScaleY, 
        frames, "smoothstep", false
      ]
    ]);
  }

  //`strobe`
  //A rapid looping scale effect. Use it like this:
  //var spriteStrobe = g.strobe(sprite, 1.3, 10, 20, 10);
  
  ga.strobe = function(
    sprite, scaleFactor, startMagnitude, endMagnitude, 
    frames, yoyo, delayBeforeRepeat
  ) {
    
    //Set defaults
    if (scaleFactor === undefined) scaleFactor = 1.3;
    if (startMagnitude === undefined) startMagnitude = 10;
    if (endMagnitude === undefined) endMagnitude = 20;
    if (frames === undefined) frames = 10;
    if (yoyo === undefined) yoyo = true;
    if (delayBeforeRepeat === undefined) delayBeforeRepeat = 0;

    var bounce = "bounce " + startMagnitude + " " + endMagnitude; 

    return ga.makeTween([ 

      //Create the scaleX tween
      [
        sprite, "scaleX", sprite.scaleX, scaleFactor, frames, 
        bounce, yoyo, delayBeforeRepeat
      ],

      //Create the scaleY tween
      [
        sprite, "scaleY", sprite.scaleY, scaleFactor, frames, 
        bounce, yoyo, delayBeforeRepeat
      ]
    ]);
  }

  //###`wobble`
  //Make a sprite wobble like a plate of jelly. Use it like this:
  //var spriteWobble = g.wobble(sprite, 1.2, 1.2);

  ga.wobble = function(
    sprite, 
    scaleFactorX, 
    scaleFactorY, 
    frames,
    xStartMagnitude, 
    xEndMagnitude,
    yStartMagnitude, 
    yEndMagnitude,
    friction,
    yoyo,
    delayBeforeRepeat
  ) {

    //Set defaults
    if (scaleFactorX === undefined) scaleFactorX = 1.2;
    if (scaleFactorY === undefined) scaleFactorY = 1.2;
    if (frames === undefined) frames = 10;
    if (xStartMagnitude === undefined) xStartMagnitude = 10;
    if (xEndMagnitude === undefined) xEndMagnitude = 10;
    if (yStartMagnitude === undefined) yStartMagnitude = -10;
    if (yEndMagnitude === undefined) yEndMagnitude = -10;
    if (friction === undefined) friction = 0.98;
    if (yoyo === undefined) yoyo = true;
    if (delayBeforeRepeat === undefined) delayBeforeRepeat = 0;

    var bounceX = "bounce " + xStartMagnitude + " " + xEndMagnitude,
        bounceY = "bounce " + yStartMagnitude + " " + yEndMagnitude; 

    var o = ga.makeTween([ 

      //Create the scaleX tween
      [
        sprite, "scaleX", sprite.scaleX, scaleFactorX, frames, 
        bounceX, yoyo, delayBeforeRepeat
      ],

      //Create the scaleY tween
      [
        sprite, "scaleY", sprite.scaleY, scaleFactorY, frames, 
        bounceY, yoyo, delayBeforeRepeat
      ]
    ]);

    //Add some friction to the `endValue` at the end of each tween 
    o.tweens.forEach(function(tween) {
      tween.onComplete = function() {

        //Add friction if the `endValue` is greater than 1.
        if (tween.endValue > 1) {
          tween.endValue *= friction;

          //Set the `endValue` to 1 when the effect is finished and 
          //remove the tween from the global `tweens` array.
          if (tween.endValue <= 1) {
            tween.endValue = 1; 
            ga.removeTween(tween);
          }
        }
      };
    });

    return o;
  }
  /*
  ###removeTween
  A utility to remove tweens from the game

  */
  ga.removeTween = function(tweenObject) {

    //Remove the tween if `tweenObject` doesn't have any nested
    //tween objects
    if(!tweenObject.tweens) {
      tweenObject.pause();
      ga.tweens.splice(ga.tweens.indexOf(tweenObject), 1);
    
    //Otherwise, remove the nested tween objects
    } else {
      tweenObject.pause();
      tweenObject.tweens.forEach(function(element) {
        ga.tweens.splice(ga.tweens.indexOf(element), 1);
      });
    }
  }

  /*
  followCurve
  ------------
  */

  ga.followCurve = function(
    sprite,
    pointsArray,
    totalFrames, 
    type,
    yoyo, 
    delayBeforeRepeat
  ) {

    //Set defaults
    if (type === undefined) type = "smoothstep";
    if (yoyo === undefined) yoyo = false;
    if (delayBeforeRepeat === undefined) delayBeforeRepeat = 0;

    //Create the tween object
    var o = {};

    //If the tween is a bounce type (a spline), set the
    //start and end magnitude values
    var typeArray = type.split(" ");
    if (typeArray[0] === "bounce") {
      o.startMagnitude = parseInt(typeArray[1]);
      o.endMagnitude = parseInt(typeArray[2]);
    }

    //Use `tween.start` to make a new tween using the current
    //end point values
    o.start = function(pointsArray){
      o.playing = true;
      o.totalFrames = totalFrames;
      o.frameCounter = 0;

      //Clone the points array
      o.pointsArray = JSON.parse(JSON.stringify(pointsArray));

      //Add the tween to the global `tweens` array. The global `tweens` array is
      //updated on each frame
      ga.tweens.push(o);
    };

    //Call `tween.start` to start the first tween
    o.start(pointsArray);

    //The `update` method will be called on each frame by the game loop.
    //This is what makes the tween move
    o.update = function() {
      
      var normalizedTime, curvedTime, 
          p = o.pointsArray;

      if (o.playing) {

        //If the elapsed frames are less than the total frames,
        //use the tweening formulas to move the sprite
        if (o.frameCounter < o.totalFrames) {

          //Find the normalized value
          normalizedTime = o.frameCounter / o.totalFrames;

          //Select the correct easing function
          
          //If it's not a spline, use one of the ordinary tween
          //functions
          if (typeArray[0] !== "bounce") {
            curvedTime = ease[type](normalizedTime);
          } 
          
          //If it's a bounce type, use the `spine` function and apply the
          //2 additional `type` array values as the spline's start and
          //end points
          else {
            curvedTime = ease.spline(normalizedTime, o.startMagnitude, 0, 1, o.endMagnitude);
          }

          //Apply the Bezier curve to the sprite's position 
          sprite.x = ga.cubicBezier(curvedTime, p[0][0], p[1][0], p[2][0], p[3][0]);
          sprite.y = ga.cubicBezier(curvedTime, p[0][1], p[1][1], p[2][1], p[3][1]);
          
          //Add one to the `elapsedFrames`
          o.frameCounter += 1;
        }

        //When the tween has finished playing, run the end tasks
        else {
         o.end(); 
        }
      }
    };
      
    //The `end` method will be called when the tween is finished
    o.end = function() {

      //Set `playing` to `false`
      o.playing = false;

      //Call the tween's `onComplete` method, if it's been
      //assigned
      if (o.onComplete) o.onComplete();

      //Remove the tween from the global `tweens` array
      ga.tweens.splice(ga.tweens.indexOf(o), 1);

      //If the tween's `yoyo` property is `true`, reverse the array and
      //use it to create a new tween
      if (yoyo) {
        ga.wait(delayBeforeRepeat, function() {
          o.pointsArray = o.pointsArray.reverse();
          o.start(o.pointsArray);
        });
      }
    };

    //Pause and play methods
    o.pause = function() {
      o.playing = false;
    };
    o.play = function() {
      o.playing = true;
    };
    
    //Return the tween object
    return o;
  };


  ga.walkPath = function(
    sprite,                   //The sprite
    originalPathArray,        //A 2D array of waypoints
    totalFrames,              //The duration, in frames
    type,                     //The easing type
    loop,                     //Should the animation loop?
    yoyo,                     //Should the direction reverse?
    delayBetweenSections      //Delay, in milliseconds, between sections
  ) {
    
    //Set defaults
    if (totalFrames === undefined) totalFrames = 300;
    if (type === undefined) type = "smoothstep";
    if (loop === undefined) loop = false;
    if (yoyo === undefined) yoyo = false;
    if (delayBetweenSections === undefined) delayBetweenSections = 0;

    //Clone the path array so that any possible references to sprite
    //properties are converted into ordinary numbers 
    var pathArray = JSON.parse(JSON.stringify(originalPathArray));

    //Figure out the duration, in frames, of each path section by 
    //dividing the `totalFrames` by the length of the `pathArray`
    var frames = totalFrames / pathArray.length;
    
    //Set the current point to 0, which will be the first waypoint
    var currentPoint = 0;

    //Make the first path using the internal `makePath` function (below)
    var tween = makePath(currentPoint);

    //The `makePath` function creates a single tween between two points and
    //then schedules the next path to be made after it

    function makePath(currentPoint) {

      //Use the `makeTween` function to tween the sprite's
      //x and y position
      var tween = ga.makeTween([ 

        //Create the x axis tween between the first x value in the
        //current point and the x value in the following point
        [
          sprite, 
          "x", 
          pathArray[currentPoint][0], 
          pathArray[currentPoint + 1][0], 
          frames, 
          type
        ],

        //Create the y axis tween in the same way
        [
          sprite, 
          "y", 
          pathArray[currentPoint][1], 
          pathArray[currentPoint + 1][1], 
          frames, 
          type
        ]
      ]);

      //When the tween is complete, advance the `currentPoint` by one.
      //Add an optional delay between path segments, and then make the
      //next connecting path
      tween.onComplete = function() {

        //Advance to the next point
        currentPoint += 1;

        //If the sprite hasn't reached the end of the
        //path, tween the sprite to the next point
        if (currentPoint < pathArray.length - 1) {
          ga.wait(delayBetweenSections, function() {
            tween = makePath(currentPoint);
          });
        } 
        
        //If we've reached the end of the path, optionally
        //loop and yoyo it
        else {

          //Reverse the path if `loop` is `true`
          if (loop) {

            //Reverse the array if `yoyo` is `true`
            if (yoyo) pathArray.reverse();

            //Optionally wait before restarting
            ga.wait(delayBetweenSections, function() {

              //Reset the `currentPoint` to 0 so that we can
              //restart at the first point
              currentPoint = 0;

              //Set the sprite to the first point
              sprite.x = pathArray[0][0];
              sprite.y = pathArray[0][1];

              //Make the first new path
              tween = makePath(currentPoint);

              //... and so it continues!
            });
          }
        }
      };

      //Return the path tween to the main function
      return tween;
    }

    //Pass the tween back to the main program
    return tween;
  };

  ga.walkCurve = function(
    sprite,                  //The sprite
    pathArray,               //2D array of Bezier curves
    totalFrames,             //The duration, in frames
    type,                    //The easing type
    loop,                    //Should the animation loop?
    yoyo,                    //Should the direction reverse?
    delayBeforeContinue      //Delay, in milliseconds, between sections
  ) {

    //Set defaults
    if (totalFrames === undefined) totalFrames = 300;
    if (type === undefined) type = "smoothstep";
    if (loop === undefined) loop = false;
    if (yoyo === undefined) yoyo = false;
    if (delayBeforeContinue === undefined) delayBeforeContinue = 0;

    //Divide the `totalFrames` into sections for each part of the path
    var frames = totalFrames / pathArray.length;
    
    //Set the current curve to 0, which will be the first one
    var currentCurve = 0;

    //Make the first path
    var tween = makePath(currentCurve);

    function makePath(currentCurve) {

      //Use the custom `followCurve` function to make
      //a sprite follow a curve
      var tween = ga.followCurve(
        sprite, 
        pathArray[currentCurve],
        frames,
        type
      );

      //When the tween is complete, advance the `currentCurve` by one.
      //Add an optional delay between path segments, and then make the
      //next path
      tween.onComplete = function() {
        currentCurve += 1;
        if (currentCurve < pathArray.length) {
          ga.wait(delayBeforeContinue, function() {
            tween = makePath(currentCurve);
          });
        } 
        
        //If we've reached the end of the path, optionally
        //loop and reverse it
        else {
          if (loop) {
            if (yoyo) {

              //Reverse order of the curves in the `pathArray` 
              pathArray.reverse();

              //Reverse the order of the points in each curve
              pathArray.forEach(function(curveArray) {
                curveArray.reverse();
              });
            }

            //After an optional delay, reset the sprite to the
            //beginning of the path and make the next new path
            ga.wait(delayBeforeContinue, function() {
              currentCurve = 0;
              sprite.x = pathArray[0][0];
              sprite.y = pathArray[0][1];
              tween = makePath(currentCurve);
            });
          }
        }
      };

      //Return the path tween to the main function
      return tween;
    }
    
    //Pass the tween back to the main program
    return tween;
  };


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
    return bullet;
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

  ga.launchFullscreen = function(sprite) {
    if (ga.hitTestPoint(ga.pointer.position, sprite)) ga.enableFullscreen();
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

  /*
  Chapter 8: Sound
  ----------------
  */

  //Create an audio context.
  ga.actx = new AudioContext();

  /*

  ###makeSound

  `makeSound` is the function you want to use to load and play sound files.
  It creates and returns and WebAudio sound object with lots of useful methods you can
  use to control the sound. 
  You can use it to load a sound like this:

      var anySound = makeSound("sounds/anySound.mp3", loadHandler);

  The code above will load the sound and then call the `loadHandler`
  when the sound has finished loading. 
  (However, it's more convenient to load the sound file by pre-loading it in Ga's
  assets array, so I don't recommend loading sounds
  like this unless you need more low-level control.)

  After the sound has been loaded you can access and use it like this:

      function loadHandler() {
        anySound.loop = true;
        anySound.pan = 0.8;
        anySound.volume = 0.5;
        anySound.play();
        anySound.pause();
        anySound.playFrom(second);
        anySound.restart();
        anySound.setReverb(2, 2, false);
        anySound.setEcho(0.2, 0.2, 0);
        anySound.playbackRate = 0.5;
        anySound.fadeOut(timeInSeconds);
        anySound.fadeIn(timeInSeconds);
        anySound.fade(targetVolume, timeInSeconds);
      }
  */

  ga.makeSound = function(source, loadHandler) {

    //The sound object that this function returns.
    var o = {};

    //The audio context
    var actx = ga.actx

    //Set the default properties.
    o.volumeNode = ga.actx.createGain();

    //Create the pan node using the effcient `createStereoPanner`
    //method, if it's available.
    if (!actx.createStereoPanner) {
      o.panNode = actx.createPanner();
    } else {
      o.panNode = actx.createStereoPanner();
    }
    o.delayNode = actx.createDelay();
    o.feedbackNode = actx.createGain();
    o.filterNode = actx.createBiquadFilter();
    o.convolverNode = actx.createConvolver();
    o.soundNode = null;
    o.buffer = null;
    o.source = null;
    o.loop = false;
    o.playing = false;

    //The function that should run when the sound is loaded.
    o.loadHandler = undefined;

    //Values for the `pan` and `volume` getters/setters.
    o.panValue = 0;
    o.volumeValue = 1;

    //Values to help track and set the start and pause times.
    o.startTime = 0;
    o.startOffset = 0;

    //Set the playback rate.
    o.playbackRate = 1;

    //Echo properties.
    o.echo = false;
    o.delayValue = 0.3;
    o.feebackValue = 0.3;
    o.filterValue = 0;

    //Reverb properties
    o.reverb = false;
    o.reverbImpulse = null;
    
    //The sound object's methods.
    o.play = function() {

      //Set the start time (it will be `0` when the sound
      //first starts.
      o.startTime = actx.currentTime;

      //Create a sound node.
      o.soundNode = actx.createBufferSource();

      //Set the sound node's buffer property to the loaded sound.
      o.soundNode.buffer = o.buffer;

      //Set the playback rate
      o.soundNode.playbackRate.value = this.playbackRate;

      //Connect the sound to the pan, connect the pan to the
      //volume, and connect the volume to the destination.
      o.soundNode.connect(o.volumeNode);

      //If there's no reverb, bypass the convolverNode
      if (o.reverb === false) {
        o.volumeNode.connect(o.panNode);
      } 

      //If there is reverb, connect the `convolverNode` and apply
      //the impulse response
      else {
        o.volumeNode.connect(o.convolverNode);
        o.convolverNode.connect(o.panNode);
        o.convolverNode.buffer = o.reverbImpulse;
      }
      
      //Connect the `panNode` to the destination to complete the chain.
      o.panNode.connect(actx.destination);

      //Add optional echo.
      if (o.echo) {

        //Set the values.
        o.feedbackNode.gain.value = o.feebackValue;
        o.delayNode.delayTime.value = o.delayValue;
        o.filterNode.frequency.value = o.filterValue;

        //Create the delay loop, with optional filtering.
        o.delayNode.connect(o.feedbackNode);
        if (o.filterValue > 0) {
          o.feedbackNode.connect(o.filterNode);
          o.filterNode.connect(o.delayNode);
        } else {
          o.feedbackNode.connect(o.delayNode);
        }

        //Capture the sound from the main node chain, send it to the
        //delay loop, and send the final echo effect to the `panNode` which
        //will then route it to the destination.
        o.volumeNode.connect(o.delayNode);
        o.delayNode.connect(o.panNode);
      }

      //Will the sound loop? This can be `true` or `false`.
      o.soundNode.loop = o.loop;

      //Finally, use the `start` method to play the sound.
      //The start time will either be `0`,
      //or a later time if the sound was paused.
      o.soundNode.start(
        0, o.startOffset % o.buffer.duration
      );

      //Set `playing` to `true` to help control the
      //`pause` and `restart` methods.
      o.playing = true;
    };

    o.pause = function() {
      //Pause the sound if it's playing, and calculate the
      //`startOffset` to save the current position.
      if (o.playing) {
        o.soundNode.stop(0);
        o.startOffset += actx.currentTime - o.startTime;
        o.playing = false;
      }
    };

    o.restart = function() {
      //Stop the sound if it's playing, reset the start and offset times,
      //then call the `play` method again.
      if (o.playing) {
        o.soundNode.stop(0);
      }
      o.startOffset = 0;
      o.play();
    };

    o.playFrom = function(value) {
      if (o.playing) {
        o.soundNode.stop(0);
      }
      o.startOffset = value;
      o.play();
    };

    o.setEcho = function(delayValue, feedbackValue, filterValue) {
      if (delayValue === undefined) delayValue = 0.3;
      if (feedbackValue === undefined) feedbackValue = 0.3;
      if (filterValue === undefined) filterValue = 0;
      o.delayValue = delayValue;
      o.feebackValue = feedbackValue;
      o.filterValue = filterValue;
      o.echo = true;
    };

    o.setReverb = function(duration, decay, reverse) {
      if (duration === undefined) duration = 2;
      if (decay === undefined) decay = 2;
      if (reverse === undefined) reverse = false;
      o.reverbImpulse = ga.impulseResponse(duration, decay, reverse, actx);
      o.reverb = true;
    };

    //A general purpose `fade` method for fading sounds in or out.
    //The first argument is the volume that the sound should
    //fade to, and the second value is the duration, in seconds,
    //that the fade should last.
    o.fade = function(endValue, durationInSeconds) {
      if (o.playing) {
        o.volumeNode.gain.linearRampToValueAtTime(
          o.volumeNode.gain.value, actx.currentTime
        );
        o.volumeNode.gain.linearRampToValueAtTime(
          endValue, actx.currentTime + durationInSeconds
        );
      }
    };

    //Fade a sound in, from an intial volume level of zero.
    o.fadeIn = function(durationInSeconds) {
      
      //Set the volume to 0 so that you can fade
      //in from silence
      o.volumeNode.gain.value = 0;
      o.fade(1, durationInSeconds);
    
    };

    //Fade a sound out, from its current volume level to zero.
    o.fadeOut = function(durationInSeconds) {
      o.fade(0, durationInSeconds);
    };
    
    //Volume and pan getters/setters.
    Object.defineProperties(o, {
      volume: {
        get: function() {
          return o.volumeValue;
        },
        set: function(value) {
          o.volumeNode.gain.value = value;
          o.volumeValue = value;
        },
        enumerable: true, configurable: true
      },

      //The pan node uses the high-effciency stereo panner, if it's
      //available. But, because this is a new addition to the 
      //WebAudio spec, it might not be available on all browsers.
      //So the code checks for this and uses the older 3D panner
      //if 2D isn't available.
      pan: {
        get: function() {
          if (!actx.createStereoPanner) {
            return o.panValue;
          } else {
            return o.panNode.pan.value;
          }
        },
        set: function(value) {
          if (!actx.createStereoPanner) {
            //Panner objects accept x, y and z coordinates for 3D
            //sound. However, because we're only doing 2D left/right
            //panning we're only interested in the x coordinate,
            //the first one. However, for a natural effect, the z
            //value also has to be set proportionately.
            var x = value,
                y = 0,
                z = 1 - Math.abs(x);
            o.panNode.setPosition(x, y, z);
            o.panValue = value;
          } else {
            o.panNode.pan.value = value;
          }
        },
        enumerable: true, configurable: true
      }
    });

    //The `load` method. It will call the `loadHandler` passed
    //that was passed as an argument when the sound has loaded.
    o.load = function() {
      var xhr = new XMLHttpRequest();

      //Use xhr to load the sound file.
      xhr.open("GET", source, true);
      xhr.responseType = "arraybuffer";
      xhr.addEventListener("load", function() {

        //Decode the sound and store a reference to the buffer.
        actx.decodeAudioData(
          xhr.response,
          function(buffer) {
            o.buffer = buffer;
            o.hasLoaded = true;

            //This next bit is optional, but important.
            //If you have a load manager in your game, call it here so that
            //the sound is registered as having loaded.
            if (loadHandler) {
              loadHandler();
            }
          },

          //Throw an error if the sound can't be decoded.
          function(error) {
            throw new Error("Audio could not be decoded: " + error);
          }
        );
      });

      //Send the request to load the file.
      xhr.send();
    };

    //Load the sound.
    o.load();

    //Return the sound object.
    return o;
  };

  //### sound
  //A convenience method that lets you access loaded sounds by their file names.
  ga.sound = function(soundFileName){
    return ga.assets[soundFileName];
  };  
  
  /*
  ###soundEffect

  The `soundEffect` function lets you generate your sounds and musical notes from scratch
  (Reverb effect requires the `impulseResponse` function that you'll see further ahead in this file)

  To create a custom sound effect, define all the parameters that characterize your sound. Here's how to
  create a laser shooting sound:

      soundEffect(
        1046.5,           //frequency
        0,                //attack
        0.3,              //decay
        "sawtooth",       //waveform
        1,                //Volume
        -0.8,             //pan
        0,                //wait before playing
        1200,             //pitch bend amount
        false,            //reverse bend
        0,                //random pitch range
        25,               //dissonance
        [0.2, 0.2, 2000], //echo: [delay, feedback, filter]
        undefined         //reverb: [duration, decay, reverse?]
      );

  Experiment by changing these parameters to see what kinds of effects you can create, and build
  your own library of custom sound effects for games.
  */
  ga.soundEffect = function(
    frequencyValue,      //The sound's fequency pitch in Hertz
    attack,              //The time, in seconds, to fade the sound in
    decay,               //The time, in seconds, to fade the sound out
    type,                //waveform type: "sine", "triangle", "square", "sawtooth"
    volumeValue,         //The sound's maximum volume
    panValue,            //The speaker pan. left: -1, middle: 0, right: 1
    wait,                //The time, in seconds, to wait before playing the sound
    pitchBendAmount,     //The number of Hz in which to bend the sound's pitch down
    reverse,             //If `reverse` is true the pitch will bend up
    randomValue,         //A range, in Hz, within which to randomize the pitch
    dissonance,          //A value in Hz. It creates 2 dissonant frequencies above and below the target pitch
    echo,                //An array: [delayTimeInSeconds, feedbackTimeInSeconds, filterValueInHz]
    reverb               //An array: [durationInSeconds, decayRateInSeconds, reverse]
  ) {

    //Set the default values
    if (frequencyValue === undefined) frequencyValue = 200;
    if (attack === undefined) attack = 0;
    if (decay === undefined) decay = 1;
    if (type === undefined) type = "sine";
    if (volumeValue === undefined) volumeValue = 1;
    if (panValue === undefined) panValue = 0;
    if (wait === undefined) wait = 0;
    if (pitchBendAmount === undefined) pitchBendAmount = 0;
    if (reverse === undefined) reverse = false;
    if (randomValue === undefined) randomValue = 0;
    if (dissonance === undefined) dissonance = 0;
    if (echo === undefined) echo = undefined;
    if (reverb === undefined) reverb = undefined;

    //The audio context
    var actx = ga.actx;

    //Create an oscillator, gain and pan nodes, and connect them
    //together to the destination
    var oscillator, volume, pan;
    oscillator = actx.createOscillator();
    volume = actx.createGain();
    if (!actx.createStereoPanner) {
      pan = actx.createPanner();
    } else {
      pan = actx.createStereoPanner();
    }
    oscillator.connect(volume);
    volume.connect(pan);
    pan.connect(actx.destination);

    //Set the supplied values
    volume.gain.value = volumeValue;
    if (!actx.createStereoPanner) {
      pan.setPosition(panValue, 0, 1 - Math.abs(panValue));
    } else {
      pan.pan.value = panValue; 
    }
    oscillator.type = type;

    //Optionally randomize the pitch. If the `randomValue` is greater
    //than zero, a random pitch is selected that's within the range
    //specified by `frequencyValue`. The random pitch will be either
    //above or below the target frequency.
    var frequency;
    var randomInt = function(min, max){
      return Math.floor(Math.random() * (max - min + 1)) + min
    };
    if (randomValue > 0) {
      frequency = randomInt(
        frequencyValue - randomValue / 2,
        frequencyValue + randomValue / 2
      );
    } else {
      frequency = frequencyValue;
    }
    oscillator.frequency.value = frequency;

    //Apply effects
    if (attack > 0) fadeIn(volume);
    fadeOut(volume);
    if (pitchBendAmount > 0) pitchBend(oscillator);
    if (echo) addEcho(volume);
    if (reverb) addReverb(volume);
    if (dissonance > 0) addDissonance();

    //Play the sound
    play(oscillator);

    //The helper functions:
    
    function addReverb(volumeNode) {
      var convolver = actx.createConvolver();
      convolver.buffer = ga.impulseResponse(reverb[0], reverb[1], reverb[2], actx);
      volumeNode.connect(convolver);
      convolver.connect(pan);
    }

    function addEcho(volumeNode) {

      //Create the nodes
      var feedback = actx.createGain(),
          delay = actx.createDelay(),
          filter = actx.createBiquadFilter();

      //Set their values (delay time, feedback time and filter frequency)
      delay.delayTime.value = echo[0];
      feedback.gain.value = echo[1];
      if (echo[2]) filter.frequency.value = echo[2];

      //Create the delay feedback loop, with
      //optional filtering
      delay.connect(feedback);
      if (echo[2]) {
        feedback.connect(filter);
        filter.connect(delay);
      } else {
        feedback.connect(delay);
      }

      //Connect the delay loop to the oscillator's volume
      //node, and then to the destination
      volumeNode.connect(delay);

      //Connect the delay loop to the main sound chain's
      //pan node, so that the echo effect is directed to
      //the correct speaker
      delay.connect(pan);
    }

    //The `fadeIn` function
    function fadeIn(volumeNode) {

      //Set the volume to 0 so that you can fade
      //in from silence
      volumeNode.gain.value = 0;

      volumeNode.gain.linearRampToValueAtTime(
        0, actx.currentTime + wait
      );
      volumeNode.gain.linearRampToValueAtTime(
        volumeValue, actx.currentTime + wait + attack
      );
    }

    //The `fadeOut` function
    function fadeOut(volumeNode) {
      volumeNode.gain.linearRampToValueAtTime(
        volumeValue, actx.currentTime + attack + wait
      );
      volumeNode.gain.linearRampToValueAtTime(
        0, actx.currentTime + wait + attack + decay
      );
    }

    //The `pitchBend` function
    function pitchBend(oscillatorNode) {

      //If `reverse` is true, make the note drop in frequency. Useful for
      //shooting sounds

      //Get the frequency of the current oscillator
      var frequency = oscillatorNode.frequency.value;

      //If `reverse` is true, make the sound drop in pitch
      if (!reverse) {
        oscillatorNode.frequency.linearRampToValueAtTime(
          frequency, 
          actx.currentTime + wait
        );
        oscillatorNode.frequency.linearRampToValueAtTime(
          frequency - pitchBendAmount, 
          actx.currentTime + wait + attack + decay
        );
      }

      //If `reverse` is false, make the note rise in pitch. Useful for
      //jumping sounds
      else {
        oscillatorNode.frequency.linearRampToValueAtTime(
          frequency, 
          actx.currentTime + wait
        );
        oscillatorNode.frequency.linearRampToValueAtTime(
          frequency + pitchBendAmount, 
          actx.currentTime + wait + attack + decay
        );
      }
    }

    //The `addDissonance` function
    function addDissonance() {

      //Create two more oscillators and gain nodes
      var d1 = actx.createOscillator(),
          d2 = actx.createOscillator(),
          d1Volume = actx.createGain(),
          d2Volume = actx.createGain();

      //Set the volume to the `volumeValue`
      d1Volume.gain.value = volumeValue;
      d2Volume.gain.value = volumeValue;

      //Connect the oscillators to the gain and destination nodes
      d1.connect(d1Volume);
      d1Volume.connect(actx.destination);
      d2.connect(d2Volume);
      d2Volume.connect(actx.destination);

      //Set the waveform to "sawtooth" for a harsh effect
      d1.type = "sawtooth";
      d2.type = "sawtooth";

      //Make the two oscillators play at frequencies above and
      //below the main sound's frequency. Use whatever value was
      //supplied by the `dissonance` argument
      d1.frequency.value = frequency + dissonance;
      d2.frequency.value = frequency - dissonance;

      //Fade in/out, pitch bend and play the oscillators
      //to match the main sound
      if (attack > 0) {
        fadeIn(d1Volume);
        fadeIn(d2Volume);
      }
      if (decay > 0) {
        fadeOut(d1Volume);
        fadeOut(d2Volume);
      }
      if (pitchBendAmount > 0) {
        pitchBend(d1);
        pitchBend(d2);
      }
      if (echo) {
        addEcho(d1Volume);
        addEcho(d2Volume);
      }
      if (reverb) {
        addReverb(d1Volume);
        addReverb(d2Volume);
      }
      play(d1);
      play(d2);
    }

    //The `play` function
    function play(node) {
      node.start(actx.currentTime + wait);
    }
  };

  /*
  impulseResponse
  ---------------

  The `makeSound` and `soundEffect` functions uses `impulseResponse`  to help create an optional reverb effect.  
  It simulates a model of sound reverberation in an acoustic space which 
  a convolver node can blend with the source sound. Make sure to include this function along with `makeSound`
  and `soundEffect` if you need to use the reverb feature.
  */
  ga.impulseResponse = function(duration, decay, reverse, actx) {

    //The length of the buffer.
    var length = actx.sampleRate * duration;

    //Create an audio buffer (an empty sound container) to store the reverb effect.
    var impulse = actx.createBuffer(2, length, actx.sampleRate);

    //Use `getChannelData` to initialize empty arrays to store sound data for
    //the left and right channels.
    var left = impulse.getChannelData(0),
        right = impulse.getChannelData(1);

    //Loop through each sample-frame and fill the channel
    //data with random noise.
    for (var i = 0; i < length; i++){

      //Apply the reverse effect, if `reverse` is `true`.
      var n;
      if (reverse) {
        n = length - i;
      } else {
        n = i;
      }

      //Fill the left and right channels with random white noise which
      //decays exponentially.
      left[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      right[i] = (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
    }

    //Return the `impulse`.
    return impulse;
  };
//plugins ends
};
