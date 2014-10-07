// ==ClosureCompiler==
// @output_file_name default.js
// @compilation_level SIMPLE_OPTIMIZATIONS
// @language ECMASCRIPT5
// @fileoverview
// @suppress {checkTypes | globalThis | checkVars}
// ==/ClosureCompiler==

/*
Welcome to Ga's source code!
============================

If you're reading this to find out how to use Ga, you've come to the wrong place.
You should take a look inside the `examples` folder.
There's a lot of cool stuff inside the `examples` folder, so check it out!
But if you want to find out how Ga works, this is the place to be.

This source code is organized into chapters.
Yes, chapters.
Just think of it like *Lord of the Rings* or maybe *Harry Potter* and you'll be fine.
Actually, come to think of it, maybe it's more like *50 Shades of Grey*.

Everything is in one big, hulking gainormous file.
Why?
Because `One Thing` is better than `Many Things`.
Just use your text editor's search function to find what you're looking for.
Courage, my love, you can do it!

Table of contents
-----------------

*Prologue: Fixing the WebAudio API*

`AudioContextMonkeyPatch.js`: Chris Wilson's cross browser patch for the WebAudio API.

*Chapter 1: The game engine*

`GA`:The global GA object.
`ga`: A convenience function used to launch Ga.
`Ga.create`: All the code that the Ga engine depends on.
`ga.gameLoop`: the engine's game loop.
`ga.update`: Calls the renderer, updates buttons and drag-and-drop objects each frame.
`ga.start`: Used to get the engine up and running.
`ga.pause`: pause the game loop.
`ga.resume`: resume the game loop.
`ga.hidePointer`: hide the pointer.
`ga.showPointer`: show the pointer.
`ga.fps`: get and set the game's frames per second.
`ga.backgroundColor`: Set the canvas background color.

*Chapter 2: Sprites*

`makeDisplayObject`: Assigns all the basic properties common to all sprite types.
`makeStage`: Create the stage object, which is the parent container for all the sprites.
`ga.remove`: A global convenience method that will remove any sprite from its parent.
`makeCircular`: Adds `diameter` and `radius` properties to sprites if a sprite's `circular` property is set to `true`.
`ga.group`: Creates a parent group containter that lets you compose game scenes or composite sprites.
`ga.rectangle`: A basic colored rectangle sprite.
`ga.circle`: A basic colored circle sprite.`
`ga.line`: A line with start and end points.
`ga.text`: Single line dynamic text.
`ga.frame`: A function that returns an object defining the position of a sub-image in an Image object tileset.
`ga.frames`: Lets you define a whole series of sub-images in a tileset.
`ga.filmstrip:` Automatically returns an array of sub-image x and y coordinates for an animated image sequence.
`ga.sprite`: Creates a sprite from an image, `frame`, `filmstrip`, or a frame from a texture atlas.
`ga.button`: An interactive button with `up` `over` and `down` states. Optional `press` and `release` actions.
`makeInteractive`: Assigns `press` and `release` actions to sprites and adds pointer interactivity.
`ga.image`: Access Image objects by their file names.
`ga.json`: Access JSON files by their file names.
`ga.addStatePlayer`: Adds `play`, `stop`, `show`, and `playSequence` methods to sprites.

*Chapter 3: Rendering*

`ga.render`: Ga's canvas rendering method.

*Chapter 4: Ga's helper objects and methods*

`ga.assets`: All the game's assets (files) are stored in this object, and it has a `load` method that manages asset loading.
`makePointer`: Makes a universal pointer object for the mouse and touch.
`keyboard`: A method that creates `key` objects that listen for keyboard events.
`makeKeys`: Used by Ga to create built-in references to the arrow keys and space bar.
`byLayer`: An array sort method that's called when a sprite's `layer` property is changed.

*Chapter 5: Sound*

`ga.makeSound`: creates and returns a WebAudio sound sprite.
`ga.sound`: Access sound files by their file names.

*/

/*
Prologue: Fixing the WebAudio API
--------------------------

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


/*
Chapter 1: The game engine
--------------------------

This fist chapter is all about the Ga's game engine code. This is the code that
launches Ga, sets the defaults, creates a canvas element, starts loading asssets,
setups up the current game state,
and generally gets things up and running. This is probably the best place to start
to learn how the engine works.

*/

//### GA
//`GA` is the global instance of the program.
var GA = GA || {};

//Set `plugins` and `custom` to an intial value of `undefined` to make
//Google Closure Compiler happy
GA.plugins = undefined;
GA.custom = undefined;

//### ga
//The `ga` convenience function is just a nice quick way to create an
//instance of Ga without having the call `Ga.create()` It's really not
//necessary, but I like it!
function ga(width, height, setup, assetsToLoad, load){
  return GA.create(width, height, setup, assetsToLoad, load);
}

//### GA.create
//The entire Ga program exists inside the `Ga.create` method. It
//creates and returns a new instance of Ga, along with all the core
//game engine functions. However, Ga won't actually start until you
//call the `start` method from the applicaiton code, as you can see in
//all the examples (in the `examples` folder).

GA.create = function(width, height, setup, assetsToLoad, load) {

  //The `ga` object is returned by this function. All the game
  //engine's methods and properties are going to be attached to it.
  var ga = {};

  /*
  ### Initialize the game engine
  All of Ga's intializtion code happens here.
  */

  //Make the canvas element and add it to the DOM.
  var dips = 1;//window.devicePixelRatio;
  ga.canvas = document.createElement("canvas");
  ga.canvas.setAttribute("width", width * dips);
  ga.canvas.setAttribute("height", height * dips);
  ga.canvas.style.backgroundColor = "black";
  document.body.appendChild(ga.canvas);

  //Create the context as a property of the canvas.
  ga.canvas.ctx = ga.canvas.getContext("2d");

  //Make the `stage`. The `stage` is the root container group
  //for all the sprites and other groups.
  ga.stage = makeStage();

  //Initialize the pointer.
  ga.pointer = makePointer();

  //Make the keyboard keys (arrow keys and space bar.)
  ga.key = makeKeys();

  //Create an audio context.
  ga.actx = new AudioContext();

  //An array to hold all the button sprites.
  ga.buttons = [];

  //Set `dragAndDrop` to `false` by default
  //(Change it to `true` and set the `draggable` property on sprites
  //to `true` to enable drag and drop.
  ga.dragAndDrop = false;

  //An array to store the draggable sprites.
  ga.draggableSprites = [];

  //An array to store the tweening functions.
  ga.tweens = [];
  
  //An array to store the particles.
  ga.particles = [];
  
  //Set the game `state`.
  ga.state = undefined;

  //Set the user-defined `load` and `setup` states.
  ga.load = load || undefined;
  ga.setup = setup || undefined;

  //The `setup` function is required, so throw an error if it's
  //missing.
  if(ga.setup === undefined) {
    throw new Error(
      "Please supply the setup function in the constructor"
    );
  }

  //Get the user-defined array that lists the assets
  //that have to load.
  ga.assetFilePaths = assetsToLoad || undefined;

  //A Boolean to let us pause the game.
  ga.paused = false;

  //The upper-limit frames per second that the game should run at.
  //Ga defaults to 60 fps.
  //Use the `fps` getter/setter to modify this value.
  ga._fps = 60;
  ga._startTime = Date.now();
  ga._frameDuration = 1000 / ga._fps;
  ga._lag = 0;

  //Should the sprite's rendered frame positions be extrapolated between
  //logic update frames for smooth rendering at low framerates?
  //(Setting it to true makes animation smooth but physics less precise)
  ga.extrapolate = false;

  /*
  The canvas's x and y scale. These are set by getters and setter in
  the code ahead. The scale is used in the `makeInteractive`
  function for correct hit testing between the pointer and sprites
  in a scaled canvas. Here's some application code you can use to
  scale the Ga canvas to fit into the maximum size of the browser
  window.

      var scaleX = g.canvas.width / window.innerWidth,
          scaleY = g.canvas.height / window.innerHeight,
          //Or, scale to the height
          //scaleX = window.innerWidth / g.canvas.width,
          //scaleY = window.innerHeight / g.canvas.height,
          scaleToFit = Math.min(scaleX, scaleY);
    
      g.canvas.style.transformOrigin = "0 0";
      g.canvas.style.transform = "scale(" + scaleToFit + ")";

      //Set Ga's scale
      g.scale = scaleToFit;

  */
  ga.scale = 1;

  /*
  ### Core game engine methods
  This next sections contains all the important methods that the game engine needs to do its work.
  */
  
  //### gameLoop
  //The engine's game loop. Ga uses a fixed timestep for logic update
  //and rendering. This is mainly for simplicity. I'll probably
  //migrate to a "fixed timestep / variable rendering" with
  //interpolation in the 
  //next major update. For a working example, see:
  //jsbin.com/tolime/1/edit
  //If the `fps` isn't set, the maximum framerate is used.
  //Use Ga's `fps` getter/setter (in the code ahead) to change the framerate
  function gameLoop() {
    requestAnimationFrame(gameLoop, ga.canvas);
    if (ga._fps === undefined) {
      //Run the code for each frame.
      update();
    }
    //If `fps` has been set, clamp the frame rate to that upper limit.
    else {
      //Calcuate the time that has elapsed since the last frame
      var current = Date.now(),
          elapsed = current - ga._startTime;
      
      if (elapsed > 1000) elapsed = ga._frameDuration;
      //For interpolation:
      ga._startTime = current;
      //Add the elapsed time to the lag counter
      ga._lag += elapsed;
      //Update the frame if the lag counter is greater than or
      //equal to the frame duration
      while (ga._lag >= ga._frameDuration){  
        //Update the logic
        update();
        //Reduce the lag counter by the frame duration
        ga._lag -= ga._frameDuration;
      }
      //Calculate the lag offset and use it to render the sprites
      var lagOffset = ga._lag / ga._frameDuration;
      ga.render(ga.canvas, lagOffset);
    }
  }
  
  
  //The old game loop. Yay, archeology!
  /*
  function gameLoop() {
    //If `fps` hasn't been set, the loop will try to run at the maximum
    //frame rate that `requestAnimationFrame` can run on the host
    //system. (This is usually around 60fps, but it depends on the
    //host system's screen refresh rate.)
    if (!ga._fps) {
      //If `fps` hasn't been set, run at the maximum frame rate.
      requestAnimationFrame(gameLoop, ga.canvas);
      //Run the code for each frame.
      update();
    }
    //If `fps` has been set, clamp the frame rate to that upper limit.
    else {
      setTimeout(function() {
        requestAnimationFrame(gameLoop);
        update();
      }, 1000 / ga._fps);
    }
  }
  */


  //### update
  //The things that should happen in the game loop.
  function update() {
    //Run the current game `state` function if it's been defined and
    //the game isn't `paused`.
    if(ga.state && !ga.paused) {
      ga.state();
    }

    //Render the canvas.
    //ga.render(ga.canvas);

    //Update all the buttons in the game.
    if (ga.buttons.length > 0) {
      ga.canvas.style.cursor = "auto";
      for(var i = ga.buttons.length - 1; i >= 0; i--) {
        var button = ga.buttons[i];
        button.update(ga.pointer, ga.canvas);
        if (button.state === "over" || button.state === "down") {
          //If the button (or interactive sprite) isn't the actual
          //stage itself, change the cursor to a pointer.
          if(!button.stage) {
            ga.canvas.style.cursor = "pointer";
          }
        }
      }
    }

    //Update all the tween functions in the game.
    if (ga.tweens.length > 0) {
      for(var j = ga.tweens.length - 1; j >= 0; j--) {
        var tween = ga.tweens[j];
        tween.update();
      }
    }

    //Update all the particles in the game.
    if (ga.particles.length > 0) {
      for(var k = ga.particles.length - 1; k >= 0; k--) {
        var particle = ga.particles[k];
        particle.update();
      }
    }
    
    //Update the pointer for drag and drop.
    if(ga.dragAndDrop) {
      ga.pointer.updateDragAndDrop();
    }
  }

  //### start
  //The `start` method that gets the whole engine going. This needs to
  //be called by the user from the game application code, right after
  //Ga is isntantiated.
  ga.start = function() {
    if (ga.assetFilePaths) {
      //Use the supplied file paths to load the assets then run
      //the user-defined `setup` function.
      ga.assets.whenLoaded = function() {
        //Clear the game `state` function for now to stop the loop.
        ga.state = undefined;
        //Call the `setup` function that was supplied by the user in
        //Ga's constructor.
        ga.setup();
      };
      ga.assets.load(ga.assetFilePaths);
      //While the assets are loading, set the user-defined `load`
      //function as the game state. That will make it run in a loop.
      //You can use the `load` state to create a loading progress bar.
      if (ga.load) {
        ga.state = ga.load;
      }
    }
    //If there aren't any assets to load,
    //just run the user-defined `setup` function.
    else {
      ga.setup();
    }
    //Start the game loop.
    gameLoop();
  };

  //### pause and resume
  //Next are a few convenience methods for interacting with the game engine.
  //This `pause` and `resume` methods start and stop the game loop to
  //allow you to run functions that should only execute once.
  ga.pause = function() {
    ga.paused = true;
  };
  ga.resume = function() {
    ga.paused = false;
  };
  //### hidePointer and showPointer
  //Use `hidePointer` and `showPointer` to hide and display the
  //pointer.
  ga.hidePointer = function() {
    ga.canvas.style.cursor = "none";
  };
  ga.showPointer = function() {
    ga.canvas.style.cursor = "auto";
  };

  //Getters and setters for various game engine properties.
  Object.defineProperties(ga, {
    //### fps
    //The `fps` getter/setter. Use it to set the frame rate.
    fps: {
      get: function() {
        return ga._fps;
      },
      set: function(value) {
        ga._fps = value;
        ga._startTime = Date.now();
        ga._frameDuration = 1000 / ga._fps;
      },
      enumerable: true, configurable: true
    },
    //### backgroundColor
    //Set the background color.
    backgroundColor: {
      set: function(value) {
        ga.canvas.style.backgroundColor = value;
      },
      enumerable: true, configurable: true
    }
  });

  /*
  Chapter 2: Sprites

  This chapter contains all the code for Ga's scene graph and sprite system. Ga has 6 built-in sprite types
  that have a wide range of applications for making games.

  - `circle`: Circles with fill and stroke colors.
  - `rectangle`: Rectangles with fill and stroke colors.
  - `line`: Lines with a color, width, and start and end points.
  - `text`: Single line dynamic text objects.
  - `sprite`: A versatile sprite that can be made from a single image, a frame in a texture atlas,
  a series of frames in sequence on a tileset or a series of frames in a texture atlas.
  - `button`: An interactive button with three states (up, over and down)
  and user-definable `press` and `release` actions.

  All sprites can be nested inside other sprites with an `addChild` method, and parent
  sprites have their own local coordinate system. Compose them together to make really complex game objects.

  There are also two special sprites:

  - `group`: This is a generic parent container is just used to group related sprites together.
  Its `width` and `height` can be assigned manually but, if they aren't, the group's `width`
  and `height` will match the area taken up by its children.
  - `stage`: this is a special group that is created by the Ga engine when it's initialized. The
  `stage` is the root container that contains everything in the game.

  Use these building blocks for making most of the kinds of things you'll need in your games.
  When sprites are created, they're assigned all of their basic properties with the help of a method called
  `makeDisplayObject`. This gives the sprites all their default properties. After `makeDisplayObject` runs,
  each sprite type is customized but their own constructor methods.
  */


  //### makeDisplayObject
  //`makeDisplayObject` assigns properties that are common for all the sprite types.
  function makeDisplayObject (o) {
    //Initialize the position
    o.x = 0;
    o.y = 0;
    //Initialize the velocity.
    o.vx = 0;
    o.vy = 0;
    //Initialize the `width` and `height`.
    o.width = 0;
    o.height = 0;
    //The sprite's width and height scale factors.
    o.scaleX = 1;
    o.scaleY = 1;
    //The sprite's pivot point, which is its center of rotation.
    //This is a percentage between 0.01 and 0.99.
    o.pivotX = 0.5;
    o.pivotY = 0.5;
    //The sprite's rotation and visibility.
    o.rotation = 0;
    o.visible = true;
    //Leave the sprite's `parent` as `undefined` for now.
    //(Most will be added as children to the `stage` at a later step.)
    o.parent = undefined;
    //Is this the `stage` object? This will be `false` for every
    //sprite, except the `stage`.
    o.stage = false;
    //Optional drop shadow properties.
    //Set `shadow` to `true` if you want the sprite to display a
    //shadow.
    o.shadow = false;
    o.shadowColor = "rgba(100, 100, 100, 0.5)";
    o.shadowOffsetX = 3;
    o.shadowOffsetY = 3;
    o.shadowBlur = 3;
    //Optional blend mode
    o.blendMode = undefined;
    //The sprite's private properties that are just used for internal
    //calculations. All these properties will be changed or accessed through a matching getter/setter
    o._alpha = 1;
    o._draggable = undefined;
    //The sprite's depth layer.
    o._layer = 0;
    //Is the sprite circular? If it is, it will be given a `radius`
    //and `diameter`.
    o._circular = false;
    //Is the sprite `interactive`? If it is, it can become clickable
    //or touchable.
    o._interactive = false;
    //properties to store the x and y positions from the previous
    //frame. Use for rendering interpolation
    o._oldX = undefined;
    o._oldY = undefined;

    //Add the sprite's container properties so that you can have
    //a nested parent/child scene graph hierarchy.
    //Create a `children` array that contains all the
    //in this container.
    o.children = [];
    //The `addChild` method lets you add sprites to this container.
    o.addChild = function(sprite) {
      //Remove the sprite from its current parent, if it has one, and
      //the parent isn't already this object
      if (sprite.parent) {
        sprite.parent.removeChild(sprite);
      }
      //Make this object the sprite's parent and
      //add it to this object's `children` array.
      sprite.parent = o;
      o.children.push(sprite);
      //Calculate the sprite's new width and height
      //o.calculateSize();
    };
    //The `removeChild` method lets you remove a sprite from its
    //parent container.
    o.removeChild = function(sprite) {
      if(sprite.parent === o) {
        o.children.splice(o.children.indexOf(sprite), 1);
      } else {
        throw new Error(sprite + "is not a child of " + o);
      }
      //Calculate the sprite's new width and height
      //o.calculateSize();
    };
    //Dynamically calculate the width and height of the sprite based
    //on the size and position of the children it contains
    /*
    o.calculateSize = function() {
      //Calculate the width based on the size of the largest child
      //that this sprite contains
      if (o.children.length > 0 && o.stage === false) {
        for(var i = 0; i < o.children.length - 1; i++) {
          var child = o.children[i];
          if (child.x + child.width > o.width) {
            o.width = child.x + child.width;
          }
          if (child.y + child.height > o.height) {
            o.height = child.y + child.height;
          }
        }
      }
    };
    */
    //Swap the depth layer positions of two child sprites
    o.swapChildren = function(child1, child2) {
      var index1 = o.children.indexOf(child1),
          index2 = o.children.indexOf(child2);
      if (index1 !== -1 && index2 !== -1) {
        //Swap the indexes
        child1.childIndex = index2;
        child2.childIndex = index1;
        //Swap the array positions
        o.children[index1] = child2;
        o.children[index2] = child1;
      } else {
        throw new Error(child + " Both objects must be a child of the caller " + o);
      }
    }
    //`add` and `remove` convenience methods let you add and remove
    //many sprites at the same time.
    o.add = function(spritesToAdd) {
      var sprites = Array.prototype.slice.call(arguments);
      if(sprites.length > 1) {
        sprites.forEach(function(sprite) {
          o.addChild(sprite);
        });
      } else {
        o.addChild(sprites[0]);
      }
    };
    o.remove = function(spritesToRemove) {
      var sprites = Array.prototype.slice.call(arguments);
      if(sprites.length > 1) {
        sprites.forEach(function(sprite) {
          o.removeChild(sprite);
        });
      } else {
        o.removeChild(sprites[0]);
      }
    };
    //A `setPosition` convenience function to let you set the
    //x any y position of a sprite with one line of code.
    o.setPosition = function(x, y) {
      o.x = x;
      o.y = y;
    };

    //The `put` methods are conveniences that help you position a
    //another sprite in and around this sprite.
    //First, get a short form reference to the sprite to make the code more
    //easier to read
    var a = o;
    //Center a sprite inside this sprite. `xOffset` and `yOffset`
    //arguments determine by how much the other sprite's position
    //should be offset from the center. These methods use the
    //sprites' global coordinates (`gx` and `gy`).
    //In all these functions, `b` is the second sprite that is being
    //positioned relative to the first sprite (this one), `a`.
    //Center `b` inside `a`.
    o.putCenter = function(b, xOffset, yOffset) {
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
      b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;
    };
    //Position `b` above `a`.
    o.putTop = function(b, xOffset, yOffset) {
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
      b.y = (a.x - b.height) + yOffset;
    };
    //Position `b` to the right of `a`.
    o.putRight = function(b, xOffset, yOffset) {
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      b.x = (a.x + a.width) + xOffset;
      b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;
    };
    //Position `b` below `a`.
    o.putBottom = function(b, xOffset, yOffset) {
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
      b.y = (a.y + a.height) + yOffset;
    };
    //Position `b` to the left of `a`
    o.putLeft = function(b, xOffset, yOffset) {
      xOffset = xOffset || 0;
      yOffset = yOffset || 0;
      b.x = (a.x - b.width) + xOffset;
      b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;
    };

    //Getters and setters for the sprite's internal properties.
    Object.defineProperties(o, {
      //`gx` and `gy` getters and setters represent the sprite's
      //global coordinates.
      gx: {
        get: function() {
          if (this.parent) {
            //The sprite's global x position is a combination of
            //its local x value and its parent's global x value
            return this.x + this.parent.gx;
          } else {
            return this.x;  
          }
        },
        enumerable: true, configurable: true
      },
      gy: {
        get: function() {
          if (this.parent) {
            return this.y + this.parent.gy;
          } else {
            return this.y;
          }
        },
        enumerable: true, configurable: true
      },
      //A `position` getter. It's a convenience that lets you get and
      //set the sprite's position as an object with x and y values.
      position: {
        get: function() {
          return {x: o.x, y: o.y};
        },
        enumerable: true, configurable: true
      },
      //An `alpha` getter/setter. The sprite's `alpha` (transparency) should match its
      //parent's `alpha` value.
      alpha: {
        get: function() {
          //Find out the sprite's alpha relative to its parent's alpha
          var relativeAlpha = o.parent._alpha * o._alpha;
          return relativeAlpha;
        },
        set: function(value) {
          o._alpha = value;
        },
        enumerable: true, configurable: true
      },
      //The sprite's `halfWidth` and `halfHeight`.
      halfWidth: {
        get: function() {
          return o.width / 2;
        },
        enumerable: true, configurable: true
      },
      halfHeight: {
        get: function() {
          return o.height / 2;
        },
        enumerable: true, configurable: true
      },
      //The width and height are calculated by multiplying
      //the base width by the sprite's x and y scale factors.
      /*
      width: {
        get: function() {
          //Return the width, multiplied by the scale factor
          return o._width; 
        },
        set: function(value){
          o._width = value;
        },
        enumerable: true, configurable: true
      },
      height: {
        get: function() {
          //Return the height, multiplied by the scale factor
          return o._height;
        },
        set: function(value){
          o._height = value;
        },
        enumerable: true, configurable: true
      },
      */
      //The sprite's center point.
      centerX: {
        get: function() {
          return o.x + o.halfWidth;
        },
        enumerable: true, configurable: true
      },
      centerY: {
        get: function() {
          return o.y + o.halfHeight;
        },
        enumerable: true, configurable: true
      },
      //The sprite's depth layer. All sprites and groups have their depth layer
      //set to `0` when their first created. If you want to force a
      //sprite to appear above another sprite, set its `layer` to a
      //higher number.
      layer: {
        get: function() {
          return o._layer;
        },
        set: function(value) {
          o._layer = value;
          o.parent.children.sort(byLayer);
        },
        enumerable: true, configurable: true
      },
      //The `circular` property lets you define whether a sprite
      //should be interpreted as a circular object. If you set
      //`circular` to `true`, the sprite is sent to the `makeCircular`
      //function where its given `radius` and `diameter` properties.
      circular: {
        get: function() {
          return o._circular;
        },
        set: function(value) {
          //Give the sprite `diameter` and `radius` properties
          //if `circular` is `true`.
          if (value === true && o._circular === false) {
            makeCircular(o);
            o._circular = true;
          }
          //Remove the sprite's `diameter` and `radius` properties
          //if `circular` is `false`.
          if (value === false && o._circular === true) {
            delete o.diameter;
            delete o.radius;
            o._circular = false;
          }
        },
        enumerable: true, configurable: true
      },
      //Is the sprite draggable by the pointer? If `draggable` is set
      //to `true`, the sprite is added to Ga's `draggableSprites`
      //array. All the sprites in `draggableSprites` are updated each
      //frame to check whether they're being dragged.
      draggable: {
        get: function() {
          return o._draggable;
        },
        set: function(value) {
          //If it's `true` push the sprite into the `draggableSprites`
          //array.
          if (value === true) {
            ga.draggableSprites.push(o);
            o._draggable = true;
          }
          //If it's `false`, remove it from the `draggableSprites` array.
          if (value === false) {
            ga.draggableSprites.splice(ga.draggableSprites.indexOf(o), 1);
          }
        },
        enumerable: true, configurable: true
      },
      //Is the sprite interactive? If `interactive` is set to `true`,
      //the sprite is run through the `makeInteractive` method.
      //`makeInteractive` makes the sprite sensitive to pointer
      //actions. It also adds the sprite to the Ga's `buttons` array,
      //which is updated each frame in the `ga.update` method.
      interactive: {
        get: function() {
          return o._interactive;
        },
        set: function(value) {
          if (value === true) {
            //Add interactive properties to the sprite
            //so that it can act like a button.
            makeInteractive(o);
            o._interactive = true;
          }
          if (value === false) {
            //Remove the sprite's reference from the game engine's
            //`buttons` array so that it it's no longer affected
            //by mouse and touch interactivity.
            ga.buttons.splice(ga.buttons.indexOf(o), 1);
            o._interactive = false;
          }
        },
        enumerable: true, configurable: true
      },
      //The `localBounds` and `globalBounds` methods return an object
      //with `x`, `y`, `width`, and `height` properties that define
      //the dimensions and position of the sprite. This is a convenience
      //to help you set or test boundaries without having to know
      //these numbers or request them specifically in your code.
      localBounds: {
        get: function() {
          var rectangle = {
            x: 0,
            y: 0,
            width: o.width,
            height: o.height
          };
          return rectangle;
        },
        enumerable: true, configurable: true
      },
      globalBounds: {
        get: function() {
          rectangle = {
            x: o.gx,
            y: o.gy,
            width: o.gx + o.width,
            height: o.gy + o.height
          };
          return rectangle;
        },
        enumerable: true, configurable: true
      },
      //`empty` is a convenience property that will return `true` or
      //`false` depending on whether or not this sprite's `children`
      //array is empty.
      empty: {
        get: function() {
          if (o.children.length === 0) {
            return true;
          } else {
            return false;
          }
        },
        enumerable: true, configurable: true
      }
    });
  };

  //### remove
  //`remove` is a global convenience method that will
  //remove any sprite, or an argument list of sprites, from its parent.
  ga.remove = function(spritesToRemove) {
    var sprites = Array.prototype.slice.call(arguments);
    if(sprites.length > 1) {
      sprites.forEach(function(sprite) {
        sprite.parent.removeChild(sprite);
      });
    } else {
      sprites[0].parent.removeChild(sprites[0]);
    }
  };

  //### makeCircular
  //The `makeCircular` function is run whenever a sprite's `circular`
  //property is set to `true`.
  //Add `diameter` and `radius` properties to circular sprites.
  function makeCircular(o) {
    Object.defineProperties(o, {
      diameter: {
        get: function() {
          return o.width;
        },
        set: function(value) {
          o.width = value;
          o.height = value;
        },
        enumerable: true, configurable: true
      },
      radius: {
        get: function() {
          return o.width / 2;
        },
        set: function (value) {
          o.width = value * 2;
          o.height = value * 2;
        },
        enumerable: true, configurable: true
      }
    });
  }

  //### makeStage
  //`makeStage` is called when Ga initializes. It creates a group
  //object called `stage` which will become the parent of all the other sprites
  //and groups.
  function makeStage() {
    var o = {};
    makeDisplayObject(o);
    //Flag this as being the `stage` object. There can
    //only be one stage
    o.stage = true;
    //Set the stage to the same height and width as the canvas
    //and position it at the top left corner
    o.width = ga.canvas.width;
    o.height = ga.canvas.height;
    o.x = 0;
    o.y = 0;
    //Make the stage its own parent
    o.parent = undefined;
    return o;
  }

  //### group
  //A `group` is a special kind of display object that doesn't have any
  //visible content. Instead, you can use it as a parent container to
  //group other sprites. Supply any number of
  //sprites to group as arguments, or don't supply any arguments if
  //you want to create an empty group. (You can always add sprites to
  //the group later using `addChild`).
  ga.group = function(spritesToGroup) {
    var o = {};
    //Make the group a display object.
    makeDisplayObject(o);

    //Add custom `addChild` and `removeChild` methods that calculate
    //the size of group based on its contents
    o.addChild = function(sprite) {
      if (sprite.parent) {
        sprite.parent.removeChild(sprite);
      }
      sprite.parent = o;
      o.children.push(sprite);
      o.calculateSize();
    };
    o.removeChild = function(sprite) {
      if(sprite.parent === o) {
        o.children.splice(o.children.indexOf(sprite), 1);
      } else {
        throw new Error(sprite + "is not a child of " + o);
      }
      o.calculateSize();
    };
    //Dynamically calculate the width and height of the sprite based
    //on the size and position of the children it contains
    o.calculateSize = function() {
      //Calculate the width based on the size of the largest child
      //that this sprite contains
      if (o.children.length > 0 && o.stage === false) {
        for(var i = 0; i < o.children.length - 1; i++) {
          var child = o.children[i];
          if (child.x + child.width > o.width) {
            o.width = child.x + child.width;
          }
          if (child.y + child.height > o.height) {
            o.height = child.y + child.height;
          }
        }
      }
    };
    //Add the group to the `stage`
    ga.stage.addChild(o);
    //Group any sprites that were passed to the group's arguments
    //(Important!: This bit of code needs to happen after adding the group to the stage)
    if (spritesToGroup) {
      var sprites = Array.prototype.slice.call(arguments);
      sprites.forEach(function(sprite) {
        o.addChild(sprite);
      });
    }
    //Return the group
    return o;
  };

  //### rectangle
  //`rectangle` creates and returns a basic rectangular shape.
  //arguments: width, height, fillColor, borderColor, widthOfBorder,
  //xPosition, yPosition.
  ga.rectangle = function (width, height, fillStyle, strokeStyle, lineWidth, x, y) {
    var o = {};
    //Make this a display object.
    makeDisplayObject(o);
    //Set the defaults.
    o.width = width || 32;
    o.height = height || 32;
    o.fillStyle = fillStyle || "red";
    o.strokeStyle = strokeStyle || "none";
    o.lineWidth = lineWidth || 0;
    //Add the sprite to the stage.
    ga.stage.addChild(o);
    //Set the sprite's getters.
    o.x = x || 0;
    o.y = y || 0;
    //Add a `render` method that explains to the canvas how to draw
    //a rectangle.
    o.render = function(ctx) {
      ctx.strokeStyle = o.strokeStyle;
      ctx.lineWidth = o.lineWidth;
      ctx.fillStyle = o.fillStyle;
      ctx.beginPath();
      //Draw the rectangle around the context's center `0` point.
      ctx.rect(
        -o.width * o.pivotX, 
        -o.height * o.pivotY, 
        o.width, 
        o.height
      );
      ctx.closePath();
      if (o.strokeStyle !== "none") ctx.stroke();
      if (o.fillStyle !== "none") ctx.fill();
    };
    //Return the rectangle.
    return o;
  };

  //### circle
  //`circle` returns a basic colored circle.
  //arguments: diameter, fillColor, outlineColor, borderColor,
  //xPosition, yPosition
  ga.circle = function(diameter, fillStyle, strokeStyle, lineWidth, x, y) {
    var o = {};
    //Make this a display object.
    makeDisplayObject(o);
    //Set the defaults.
    o.width = diameter || 32;
    o.height = diameter || 32;
    o.fillStyle = fillStyle || "red";
    o.strokeStyle = strokeStyle || "none";
    o.lineWidth = lineWidth || "none";
    //Add the sprite to the stage.
    ga.stage.addChild(o);
    //Set the sprite's getters.
    o.x = x || 0;
    o.y = y || 0;
    //Add `diameter` and `radius` getters and setters.
    makeCircular(o);
    //Add a `render` method that explains to the canvas how to draw
    //a circle.
    o.render = function(ctx) {
      ctx.strokeStyle = o.strokeStyle;
      ctx.lineWidth = o.lineWidth;
      ctx.fillStyle = o.fillStyle;
      ctx.beginPath();
      ctx.arc(
        o.radius + (-o.diameter * o.pivotX),  
        o.radius + (-o.diameter * o.pivotY), 
        o.radius, 
        0, 2*Math.PI, false
      );
      ctx.closePath();
      if (o.strokeStyle !== "none") ctx.stroke();
      if (o.fillStyle !== "none") ctx.fill();
    };
    //Return the circle sprite.
    return o;
  };

  //### line
  //`line` creates and returns a line with a start and end points.
  //arguments: lineColor, lineWidth, startX, startY, endX, endY.
  ga.line = function(strokeStyle, lineWidth, ax, ay, bx, by) {
    var o = {};
    o.test = "line";
    //Add basic properties to the sprite.
    makeDisplayObject(o);
    //Set the defaults.
    if (!ax && ax !== 0) ax = 0;
    if (!ay && ay !== 0) ay = 0;
    if (!bx && bx !== 0) bx = 32;
    if (!by && by !== 0) by = 32;
    o.ax = ax;
    o.ay = ay;
    o.bx = bx;
    o.by = by;
    o.strokeStyle = strokeStyle || "red";
    o.lineWidth = lineWidth || 1;
    //The `lineJoin` style.
    //Options are "round", "mitre" and "bevel".
    o.lineJoin = "round";
    //Add the sprite to the stage.
    ga.stage.addChild(o);
    //Measure the width and height of the line, and its
    //figure out its top left corner x y position.
    /*
    Object.defineProperties(o, {
      //Calculate the `width` and `height` properties.
      width: {
        get: function() {
          return Math.abs(o.bx - o.ax);
        },
        enumerable: true, configurable: true
      },
      height: {
        get: function() {
          return Math.abs(o.by - o.ay);
        },
        enumerable: true, configurable: true
      },
    
      //Calculate the line's global `x` and `y` properties (the line's top left
      //corner.) This will let you reposition the line using `x` and
      //`y` without changing its length.
      x: {
        get: function() {
          //return Math.min(o.ax, o.bx);
        },
        set: function(value) {
          //Find the current x value (the x point closest to the
          //left.)
          var currentX = o.x;
          //Figure out the difference between the current
          //x value and the new x value.
          var offset = value - currentX;
          //Find the line's start and end x points. Assign the new
          //value to the start point and the offset to the end point.
          if (o.ax === currentX) {
            o.ax = value;
            o.bx += offset;
          } else {
            o.bx = value;
            o.ax += offset;
          }
        },
        enumerable: true, configurable: true
      },
    
      y: {
        get: function() {
          //return Math.min(o.ay, o.by);
        },
        set: function(value) {
          //Find the current y value (the y point closest to the top)
          var currentY = o.y;
          //Figure out the difference between the current
          //y value and the new y value
          var offset = value - currentY;
          //Find the line's start and end y points. Assign the new
          //value to the start point and the offset to the end point.
          if (o.ay === currentY) {
            o.ay = value;
            o.by += offset;
          } else {
            o.by = value;
            o.ay += offset;
          }
        },
        enumerable: true, configurable: true
      }
    });
    */
    //Add a `render` method that explains to the canvas how to draw
    //a line.
    o.render = function(ctx) {
      ctx.strokeStyle = o.strokeStyle;
      ctx.lineWidth = o.lineWidth;
      ctx.lineJoin = o.lineJoin;
      ctx.beginPath();
      ctx.moveTo(o.ax, o.ay);
      ctx.lineTo(o.bx, o.by);
      /*
      //Draw the line correctly depending on its orientation
      //around the 4 quadrants of the origin point.
      if (o.ax >= o.bx) {
        if(o.ay >= o.by) {
          ctx.moveTo(-o.halfWidth, -o.halfHeight);
          ctx.lineTo(o.halfWidth, o.halfHeight);
        } else {
          ctx.moveTo(-o.halfWidth, o.halfHeight);
          ctx.lineTo(o.halfWidth, -o.halfHeight);
        }
      } else {
        if(o.ay >= o.by) {
          ctx.moveTo(-o.halfWidth, o.halfHeight);
          ctx.lineTo(o.halfWidth, -o.halfHeight);
        } else {
          ctx.moveTo(-o.halfWidth, -o.halfHeight);
          ctx.lineTo(o.halfWidth, o.halfHeight);
        }
      }
      */
      ctx.closePath();
      if (o.strokeStyle !== "none") ctx.stroke();
      if (o.fillStyle !== "none") ctx.fill();
    };
    //Return the line.
    return o;
  };

  //### text
  //`text` creates and returns a single line of dynamic text.
  //arguments: stringContent, font, fontColor, xPosition, yPosition.
  ga.text = function(content, font, fillStyle, x, y) {
    var o = {};
    //Add the basic sprite properties.
    makeDisplayObject(o);
    //Set the defaults.
    o.content = content || "Hello!";
    o.font = font || "12px sans-serif";
    o.fillStyle = fillStyle || "red";
    o.textBaseline = "top";
    //Measure the width and height of the text
    Object.defineProperties(o, {
      width: {
        get: function() {
          return ga.canvas.ctx.measureText(o.content).width;
        },
        enumerable: true, configurable: true
      },
      height: {
        get: function() {
          return ga.canvas.ctx.measureText("M").width;
        },
        enumerable: true, configurable: true
      }
    });
    //Add the sprite to the stage.
    ga.stage.addChild(o);
    //Set the object's x and y setters.
    o.x = x || 0;
    o.y = y || 0;
    //Add a `render` method that explains to the canvas how to draw text.
    o.render = function(ctx) {
      ctx.strokeStyle = o.strokeStyle;
      ctx.lineWidth = o.lineWidth;
      ctx.fillStyle = o.fillStyle;
      ctx.translate(-o.width * o.pivotX, -o.height * o.pivotY)
      ctx.font = o.font;
      ctx.textBaseline = o.textBaseline;
      ctx.fillText(
        o.content,
        0,
        0
      );
    };
    //Return the text sprite.
    return o;
  };

  //### frame
  //The `frame` method returns and object that defines
  //in the position and size of a sub-image in a tileset. Use it if you
  //want to create a sprite from a sub-image inside an Image object.
  //arguments: sourceString, xPostionOfSubImage, yPositionOfSubImage,
  //widthOfSubImage, heightOfSubImage.
  ga.frame = function(source, x, y, width, height) {
    var o = {};
    o.image = source;
    o.x = x;
    o.y = y;
    o.width = width;
    o.height = height;
    return o;
  };

  //### frames
  //The `frames` function returns and object that defines
  //the position and size of many sub-images in a single tileset image.
  //arguments: sourceString, 2DArrayOfXandYPositions, widthOfSubImage,
  //heightOfSubImage.
  ga.frames = function(source, arrayOfPositions, width, height) {
    var o = {};
    o.image = source;
    o.data = arrayOfPositions;
    o.width = width;
    o.height = height;
    return o;
  };

  //### filmstrip
  //If you have a complex animation in a single image, you can use the
  //`filmstrip` method to automatically create an array of x,y
  //coordinates for each animation frame.
  //`filmstrip` arguments:
  //imageName, frameWidth, frameHeight, spacing
  //(The last `spacing` argument should be included if there's any
  //default spacing (padding) around tileset images.)
  ga.filmstrip = function(imageName, frameWidth, frameHeight, spacing){
    var image = g.assets[imageName],
        positions = [],
        //Find out how many columns and rows there are in the image.
        columns = image.width / frameWidth,
        rows = image.height / frameHeight,
        //Find the total number of frames.
        numberOfFrames = columns * rows;

    for(var i = 0; i < numberOfFrames; i++) {
      //Find the correct row and column for each frame
      //and figure out its x and y position.
      var x, y;
      x = (i % columns) * frameWidth;
      y = Math.floor(i / columns) * frameHeight;

      //Compensate for any optional spacing (padding) around the tiles if
      //there is any. This bit of code accumulates the spacing offsets from the
      //left side of the tileset and adds them to the current tile's position.
      if (spacing && spacing > 0) {
        x += spacing + (spacing * i % columns);
        y += spacing + (spacing * Math.floor(i / columns));
      }

      //Add the x and y value of each frame to the `positions` array.
      positions.push([x, y]);
    }
    //Create and return the animation frames using the `frames` method.
    return ga.frames(imageName, positions, frameWidth, frameHeight);
  };

  //### sprite
  //`sprite` creates and returns a sprite using a JavaScript Image object, a tileset
  //`frame`, a `filmstrip`, or a frame from a texture atlas (in
  //standard Texture Packer format).
  //arguments: sourceString.
  ga.sprite = function(source) {
    var o = {};
    //Make this a display object.
    makeDisplayObject(o);
    o.frames = [];
    o.loop = true;
    o._currentFrame = 0;
    //This next part is complicated. The code has to figure out what
    //the source is referring to, and then assign its properties
    //correctly to the sprite's properties. Read carefully!
    //If no `source` is provided, alert the user.
    if (source === undefined) throw new Error("Sprites require a source");
    //If the source is just an ordinary string, use it to create the
    //sprite.
    if (!source.image) {
      //If the source isn't an array, then it must be a single image.
      if(!(source instanceof Array)) {
        //Is the string referring to a tileset frame from a Texture Packer JSON
        //file, or is it referring to a JavaScript Image object? Let's find out.
        if (ga.assets[source] instanceof Image) {
          //Cool, it's just an ordinary Image object. That's easy.
          o.source = ga.assets[source];
          o.sourceX =  0;
          o.sourceY =  0;
          o.width = o.source.width;
          o.height = o.source.height;
          o.sourceWidth = o.source.width;
          o.sourceHeight = o.source.height;
        }
        //No, it's not an Image object. So it must be a tileset frame
        //from a texture atlas.
        else {
          //Use the texture atlas's properties to assign the sprite's
          //properties.
          o.tilesetFrame = ga.assets[source];
          o.source = o.tilesetFrame.source;
          o.sourceX = o.tilesetFrame.frame.x;
          o.sourceY = o.tilesetFrame.frame.y;
          o.width = o.tilesetFrame.frame.w;
          o.height = o.tilesetFrame.frame.h;
          o.sourceWidth = o.tilesetFrame.frame.w;
          o.sourceHeight = o.tilesetFrame.frame.h;
        }
      //The source is an array. But what kind of array? Is it an array
      //Image objects or an array of texture atlas frame ids?
      } else {
        if (ga.assets[source[0]] && ga.assets[source[0]].source) {
          //The source is an array of frames on a texture atlas tileset.
          o.frames = source;
          o.source = ga.assets[source[0]].source;
          o.sourceX = ga.assets[source[0]].frame.x;
          o.sourceY = ga.assets[source[0]].frame.y;
          o.width = ga.assets[source[0]].frame.w;
          o.height = ga.assets[source[0]].frame.h;
          o.sourceWidth = ga.assets[source[0]].frame.w;
          o.sourceHeight = ga.assets[source[0]].frame.h;
        }
        //It must be an array of image objects
        else {
          o.frames = source;
          o.source = ga.assets[source[0]];
          o.sourceX = 0;
          o.sourceY = 0;
          o.width = o.source.width;
          o.height = o.source.height;
          o.sourceWidth = o.source.width;
          o.sourceHeight = o.source.height;
        }
      }
    }
    //If the source contains an `image` sub-property, this must
    //be a `frame` object that's defining the rectangular area of an inner sub-image
    //Use that sub-image to make the sprite. If it doesn't contain a
    //`data` property, then it must be a single frame.
    else if(source.image && !source.data) {
      //Throw an error if the source is not an image file.
      if (!(ga.assets[source.image] instanceof Image)) {
        throw new Error(source.image + " is not an image file");
      }
      o.source = ga.assets[source.image];
      o.sourceX = source.x;
      o.sourceY = source.y;
      o.width = source.width;
      o.height = source.height;
      o.sourceWidth = source.width;
      o.sourceHeight = source.height;
    }
    //If the source contains an `image` sub-property
    //and a `data` property, then it contains multiple frames
    else if(source.image && source.data) {
      o.source = ga.assets[source.image];
      o.frames = source.data;
      //Set the sprite to the first frame
      o.sourceX = o.frames[0][0];
      o.sourceY = o.frames[0][1];
      o.width = source.width;
      o.height = source.height;
      o.sourceWidth = source.width;
      o.sourceHeight = source.height;
    }
    //Add a `gotoAndStop` method to go to a specific frame.
    o.gotoAndStop = function(frameNumber) {
      if (o.frames.length > 0) {
        //If each frame is an array, then the frames were made from an
        //ordinary Image object using the `frames` method.
        if (o.frames[0] instanceof Array) {
          o.sourceX = o.frames[frameNumber][0];
          o.sourceY = o.frames[frameNumber][1];
        }
        //If each frame isn't an array, and it has a sub-object called `frame`,
        //then the frame must be a texture atlas id name.
        //In that case, get the source position from the `frame` object.
        else if (g.assets[o.frames[frameNumber]].frame) {
          o.sourceX = g.assets[o.frames[frameNumber]].frame.x;
          o.sourceY = g.assets[o.frames[frameNumber]].frame.y;
        }
        //If neither of the above are true, then each frame must be
        //an individual Image object
        else {
          o.source = g.assets[o.frames[frameNumber]];
          o.sourceX = 0;
          o.sourceY = 0;
          o.width = o.source.width;
          o.height = o.source.height;
          o.sourceWidth = o.source.width;
          o.sourceHeight = o.source.height;
        }
        //Set the `_currentFrame` value.
        o._currentFrame = frameNumber;
      } else {
        throw new Error("Frame number " + frameNumber + "doesn't exist");
      }
    };
    //Add a getter for the `_currentFrames` property.
    if (o.frames.length > 0) {
      Object.defineProperty(o, "currentFrame", {
        get: function() {
          return o._currentFrame;
        },
        enumerable: false, configurable: false
      });
    }
    //Add the sprite to the stage
    ga.stage.addChild(o);
    //Set the sprite's getters
    o.x = 0;
    o.y = 0;
    //If the sprite has more than one frame, add a state player
    if (o.frames.length > 0) ga.addStatePlayer(o);
    //A `render` method that describes how to draw the sprite
    o.render = function(ctx) {
      ctx.drawImage(
        o.source,
        o.sourceX, o.sourceY,
        o.sourceWidth, o.sourceHeight,
        -o.width * o.pivotX,
        -o.height * o.pivotY,
        o.width, o.height
      );
    };
    //Return the sprite
    return o;
  };

  //### button
  //`button` creates and returns a button with `up`, `over` and `down`
  //states. You can also assign custom `press` and `release` methods.
  //arguments: sourceString (The same as an ordinary sprite.)
  ga.button = function(source){
    //First, make an ordinary sprite.
    var o = ga.sprite(source);
    //Assign this as a "button" subtype.
    o.subtype = "button";
    //Make it interactive (see ahead).
    makeInteractive(o);
    //Return it.
    return o;
  };

  //### makeInteractive
  //The `makeInteractive` function lets you assign `press`, `release`, `over`, `tap`
  //and `out` actions to sprites.
  //Also tells you the pointer's state of interaction with the sprite.
  //`makeInteractive` is called on a sprite when a sprite's
  //`interactive` property is set to `true`.
  function makeInteractive(o) {
    //The `press` and `release` methods. They're `undefined`
    //for now, but they'll be defined in the game program.
    o.press = o.press || undefined;
    o.release = o.release || undefined;
    //The `state` property tells you button's
    //current state. Set its initial state to "up".
    o.state = "up";
    //The `action` property tells you whether its being pressed or
    //released.
    o.action = "";
    //`pressed` is a Boolean that helps track whether or not
    //the button has been pressed down.
    o.pressed = false;
    //`hoverOver` is a Boolean which checkes whether the pointer
    //has hoverd over the button.
    o.hoverOver = false;
    //Add the button into the global `buttons` array so that it
    //can be updated by the game engine.
    ga.buttons.push(o);

    //The `update` method will be called each frame inside
    //Ga's game loop.
    o.update = function(pointer, canvas) {
      //Figure out if the pointer is touching the button.
      var hit = ga.pointer.hitTestSprite(o);
      //1. Figure out the current state.
      if (pointer.isUp) {
        //Up state.
        o.state = "up";
        //Show the first frame, if this is a button.
        if (o.subtype === "button") o.show(0);
      }
      //If the pointer is touching the button, figure out
      //if the over or down state should be displayed.
      if (hit) {
        //Over state.
        o.state = "over";
        //Show the second frame if this sprite has
        //3 frames and it's button.
        if (o.frames && o.frames.length === 3 && o.subtype === "button") {
          o.show(1);
        }
        //Down state.
        if (pointer.isDown) {
          o.state = "down";
          //Show the third frame if this sprite is a button and it
          //has only three frames, or show the second frame if it
          //only has two frames.
          if(o.subtype === "button") {
            if (o.frames.length === 3) {
              o.show(2);
            } else {
              o.show(1);
            }
          }
        }
      }

      //Run the correct button action.
      //a. Run the `press` method if the button state is "down" and
      //the button hasn't already been pressed.
      if (o.state === "down") {
        if (!o.pressed) {
          if (o.press) o.press();
          o.pressed = true;
          o.action = "pressed";
        }
      }
      //b. Run the `release` method if the button state is "over" and
      //the button has been pressed.
      if (o.state === "over") {
        if (o.pressed) {
          if (o.release) o.release();
          o.pressed = false;
          o.action = "released";
          //If the pointer was tapped and the user assigned a `tap`
          //method, call the `tap` method
          if (ga.pointer.tapped && o.tap) o.tap();
        }
        //Run the `over` method if it has been assigned
        if (!o.hoverOver) {
          if (o.over) o.over();
          o.hoverOver = true;
        }
      }
      //c. Check whether the pointer has been released outside
      //the button's area. If the button state is "up" and it's
      //already been pressed, then run the `release` method.
      if (o.state === "up") {
        if (o.pressed) {
          if (o.release) o.release();
          o.pressed = false;
          o.action = "released";
        }
        //Run the `out` method if it has been assigned
        if (o.hoverOver) {
          if (o.out) o.out();
          o.hoverOver = false;
        }
      }
    };
  }

  //A convenience method that lets you access Images by their file names.
  ga.image = function(imageFileName){
    return ga.assets[imageFileName];
  };

  //A convenience method that lets you access JSON files by their file names.
  ga.json = function(jsonFileName){
    return ga.assets[jsonFileName];
  };

  //### addStatePlayer
  //`addStatePlayer` adds a state manager and keyframe animation player for
  //sprites with more than one frame. Its called automatically when
  //`sprite`s are created.
  ga.addStatePlayer = function(sprite) {
    var frameCounter = 0,
        numberOfFrames = 0,
        startFrame = 0,
        endFrame = 0,
        timerInterval = undefined,
        playing = false;

    //The `show` function (to display static states.)
    function show(frameNumber) {
      //Reset any possible previous animations.
      reset();
      //Find the new state on the sprite.
      //If `frameNumber` is a number, use that number to go to the
      //correct frame.
      if (typeof frameNumber !== "string") {
        sprite.gotoAndStop(frameNumber);
      }
      //If `frameNumber` is string that describes a sprite's frame id,
      //then go to the index number that matches that id name.
      else {
        sprite.gotoAndStop(sprite.frames.indexOf(frameNumber));
      }
    }

    //The `play` function plays all the sprites frames.
    function play() {
      playSequence([0, sprite.frames.length - 1]);
    }

    //The `stop` function stops the animation at the current frame.
    function stop() {
      reset();
      sprite.gotoAndStop(sprite.currentFrame);
    }

    //The `playSequence` function, to play a sequence of frames.
    function playSequence(sequenceArray) {
      //Reset any possible previous animations.
      reset();
      //Figure out how many frames there are in the range.
      startFrame = sequenceArray[0];
      endFrame = sequenceArray[1];
      numberOfFrames = endFrame - startFrame;
      //Compensate for two edge cases:
      //1. if the `startFrame` happens to be `0`.
      if (startFrame === 0) {
        numberOfFrames += 1;
        frameCounter += 1;
      }
      //2. if only a two-frame sequence was provided.
      if(numberOfFrames === 1){
        numberOfFrames = 2;
        frameCounter += 1;
      };
      //Calculate the frame rate. Set a default fps of 12.
      if (!sprite.fps) sprite.fps = 12;
      var frameRate = 1000 / sprite.fps;
      //Set the sprite to the starting frame.
      sprite.gotoAndStop(startFrame);
      //If the state isn't already playing, start it.
      if(!playing) {
        timerInterval = setInterval(advanceFrame.bind(this), frameRate);
        playing = true;
      }
    }

    //`advanceFrame` is called by `setInterval` to display the next frame
    //in the sequence based on the `frameRate`. When frame sequence
    //reaches the end, it will either stop it or loop it.
    function advanceFrame() {
      //Advance the frame if `frameCounter` is less than
      //the state's total frames.
      if (frameCounter < numberOfFrames) {
        //Advance the frame.
        sprite.gotoAndStop(sprite.currentFrame + 1);
        //Update the frame counter.
        frameCounter += 1;
      } else {
        //If we've reached the last frame and `loop`
        //is `true`, then start from the first frame again.
        if (sprite.loop) {
          sprite.gotoAndStop(startFrame);
          frameCounter = 1;
        }
      }
    }

    function reset() {
      //Reset `playing` to `false`, set the `frameCounter` to 0,
      //and clear the `timerInterval`.
      if (timerInterval !== undefined && playing === true) {
        playing = false;
        frameCounter = 0;
        startFrame = 0;
        endFrame = 0;
        numberOfFrames = 0;
        clearInterval(timerInterval);
      }
    }

    //Add the `show`, `play`, `playing`, `stop` and `playSequence` methods to the sprite.
    sprite.show = show;
    sprite.play = play;
    sprite.stop = stop;
    sprite.playing = playing;
    sprite.playSequence = playSequence;
  };


  /*
  Rendering
  -------

  The render method that displays all the sprites on the canvas.
  Ga uses it inside the game loop to render the sprites like this:

      ga.render(canvasContext);

  */

  ga.render = function(canvas, lagOffset) {
    //Get a reference to the context.
    var ctx = canvas.ctx;
    //Clear the canvas.
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Display the all the sprites.
    for (var i = 0; i < ga.stage.children.length; i++) {
      var sprite = ga.stage.children[i];
      //Only draw sprites if they're visible and inside the
      //area of the canvas.
      displaySprite(sprite);
    }
    function displaySprite(sprite) {
      if (
        sprite.visible
        && sprite.gx < canvas.width
        && sprite.gx + sprite.width > -1
        && sprite.gy < canvas.height
        && sprite.gy + sprite.height > -1
      ) {
        //Save the current context state.
        ctx.save();
        //calculate the render position for interpolation
        /*
        if(sprite._oldX === undefined) sprite._oldX = sprite.gx;
        if(sprite._oldY === undefined) sprite._oldY = sprite.gy;
        sprite.renderX = (sprite.gx - sprite._oldX) * lagOffset + sprite._oldX;
        sprite.renderY = (sprite.gy - sprite._oldY) * lagOffset + sprite._oldY;
        */
        /*
        if(sprite._oldX === undefined) sprite._oldX = sprite.x;
        if(sprite._oldY === undefined) sprite._oldY = sprite.y;
        sprite.renderX = (sprite.x - sprite._oldX) * lagOffset + sprite._oldX;
        sprite.renderY = (sprite.y - sprite._oldY) * lagOffset + sprite._oldY;
        */
        //sprite.renderX = sprite.x + sprite.vx * lagOffset,
        //sprite.renderY = sprite.y + sprite.vy * lagOffset;
        //sprite.renderX = sprite.vx * lagOffset + (sprite.x - sprite.vx);
        //sprite.renderY = sprite.vy * lagOffset + (sprite.y - sprite.vy);
        if (ga.extrapolate) {
          sprite.renderX = sprite.vx * lagOffset + sprite.x;
          sprite.renderY = sprite.vy * lagOffset + sprite.y;
        } else {
          sprite.renderX = sprite.x;
          sprite.renderY = sprite.y;
        }
        /*
        previousX = (sprite.x - sprite.vx) * (1 - lagOffset);
        previousY = (sprite.y - sprite.vy) * (1 - lagOffset);
        sprite.renderX = sprite.x * lagOffset + previousX//((sprite.x - sprite.vx) * (1 - lagOffset));
        sprite.renderY = sprite.y * lagOffset + previousY//((sprite.y - sprite.vy) * (1 - lagOffset));
        */
        //if(!sprite.parent.renderX) sprite.parent.renderX = sprite.parent.gx;
        //if(!sprite.parent.renderY) sprite.parent.renderY = sprite.parent.gy;
        //If the sprite's parent is the stage, position the sprite
        //relative to the top left corner of the canvas
      
        /*
        if (sprite.parent.stage === true) {
          ctx.translate(
            sprite.renderX + sprite.halfWidth,
            sprite.renderY + sprite.halfHeight
          );
        //If the sprite's parent isn't the stage, position the sprite
        //relative to the sprite's parent's center point
        } else {
          ctx.translate(
            sprite.renderX + sprite.halfWidth - sprite.parent.renderX - sprite.parent.halfWidth,
            sprite.renderY + sprite.halfHeight - sprite.parent.renderY - sprite.parent.halfHeight
          );
        }
        */
        ctx.translate(
          sprite.renderX + (sprite.width * sprite.pivotX),
          sprite.renderY + (sprite.height * sprite.pivotY)
        );

        //The same code without interpolation
        /*
        ctx.translate(
          sprite.x + (sprite.width * sprite.pivotX),
          sprite.y + (sprite.height * sprite.pivotY)
        );
        */
        /*  
        if (sprite.parent.stage === true) {
          ctx.translate(
            sprite.gx + sprite.halfWidth,
            sprite.gy + sprite.halfHeight
          );
        //If the sprite's parent isn't the stage, position the sprite
        //relative to the sprite's parent's center point
        } else {
          ctx.translate(
            sprite.gx + sprite.halfWidth - sprite.parent.gx - sprite.parent.halfWidth,
            sprite.gy + sprite.halfHeight - sprite.parent.gy - sprite.parent.halfHeight
          );
        }
        */
        //Set the alpha
        ctx.globalAlpha = sprite.alpha;
        //Rotate the sprite using its `rotation` value.
        ctx.rotate(sprite.rotation);
        //Scale the sprite using its `scaleX` and scaleY` properties.
        ctx.scale(sprite.scaleX, sprite.scaleY);
        //Add a shadow if the sprite's `shadow` property is `true`.
        if(sprite.shadow) {
          ctx.shadowColor = sprite.shadowColor;
          ctx.shadowOffsetX = sprite.shadowOffsetX;
          ctx.shadowOffsetY = sprite.shadowOffsetY;
          ctx.shadowBlur = sprite.shadowBlur;
        } 
        //Add an optional blend mode
        if (sprite.blendMode) ctx.globalCompositeOperation = sprite.blendMode;
        //Use the sprite's custom `render` method to figure out how to
        //draw the sprite. This is only run if the sprite actually has
        //a `render` method. Most do, but `group` sprites don't and
        //neither does the `stage` object.
        if (sprite.render) sprite.render(ctx);
        //If the sprite contains child sprites in its
        //`children` array, display them by calling this very same
        //`displaySprite` function again.
        if (sprite.children && sprite.children.length > 0) {
          //Reset the context back to the parent sprite's top left corner
          ctx.translate(-sprite.width * sprite.pivotX, -sprite.height * sprite.pivotY);
          for (var j = 0; j < sprite.children.length; j++) {
            //Find the sprite's child
            var child = sprite.children[j];
            //display the child
            displaySprite(child);
          }
        }
        //The context's original position will only be restored after
        //the child sprites have been rendered. This is why the children have
        //the same rotation and alpha as the parents.
        ctx.restore();
        //Capture the sprite's current positions to use as 
        //the previous position on the next frame (used for
        //interpolation)
        /*
        sprite._oldX = sprite.gx;
        sprite._oldY = sprite.gy;
        */
        sprite._oldX = sprite.x;
        sprite._oldY = sprite.y;
      }
    }
  }

  /*
  Chapter 4: Ga's helper objects and methods
  ------------------------------------------
  */

  //### asset
  //All the game engine's assets are stored in this object and it has
  //a `load` method that manages asset loading. You can load assets at
  //any time during the game by using the `asset.load` method.
  ga.assets = {
    //Properties to help track the assets being loaded.
    toLoad: 0,
    loaded: 0,

    //File extensions for different types of assets.
    imageExtensions: ["png", "jpg", "gif"],
    fontExtensions: ["ttf", "otf", "ttc", "woff"],
    audioExtensions: ["mp3", "ogg", "wav", "webm"],
    jsonExtensions: ["json"],

    //The callback function that should run when all assets have loaded.
    //Assign this when you load the fonts, like this: `assets.whenLoaded = makeSprites;`.
    whenLoaded: undefined,

    //The load method creates and loads all the assets. Use it like this:
    //`assets.load(["images/anyImage.png", "fonts/anyFont.otf"]);`.

    load: function(sources) {
      console.log("Loading assets...");
      //Get a reference to this asset object so we can
      //refer to it in the `forEach` loop ahead.
      var self = this;
      //Find the number of files that need to be loaded.
      self.toLoad = sources.length;
      sources.forEach(function(source){
        //Find the file extension of the asset.
        var extension = source.split('.').pop();

        //#### Images
        //Load images that have file extensions that match
        //the `imageExtensions` array.
        if (self.imageExtensions.indexOf(extension) !== -1) {
          //Create a new image and add a loadHandler
          var image = new Image();
          image.addEventListener("load", self.loadHandler.bind(self), false);
          //Get the image file name.
          image.name = source;
          //If you just want the file name and the extension, you can
          //get it like this:
          //image.name = source.split("/").pop();
          //Assign the image as a property of the assets object so
          //we can access it like this: `assets["images/imageName.png"]`.
          self[image.name] = image;
          //Set the image's src property so we can start loading the image.
          image.src = source;
        }

        //#### Fonts
        //Load fonts that have file extensions that match the `fontExtensions` array.
        else if (self.fontExtensions.indexOf(extension) !== -1) {
          //Use the font's file name as the `fontFamily` name.
          var fontFamily = source.split("/").pop().split(".")[0];
          //Append an `@afont-face` style rule to the head of the HTML
          //document. It's kind of a hack, but until HTML5 has a
          //proper font loading API, it will do for now.
          var newStyle = document.createElement('style');
          var fontFace =  "@font-face {font-family: '" + fontFamily + "'; src: url('" + source + "');}";
          newStyle.appendChild(document.createTextNode(fontFace));
          document.head.appendChild(newStyle);
          //Tell the loadHandler we're loading a font.
          self.loadHandler();
        }

        //#### Sounds
        //Load audio files that have file extensions that match
        //the `audioExtensions` array.
        else if (self.audioExtensions.indexOf(extension) !== -1) {
          //Create a sound sprite.
          var soundSprite = ga.makeSound(source, self.loadHandler.bind(self));
          //Get the sound file name.
          soundSprite.name = source;
          //If you just want to extract the file name with the
          //extension, you can do it like this:
          //soundSprite.name = source.split("/").pop();
          //Assign the sound as a property of the assets object so
          //we can access it like this: `assets["sounds/sound.mp3"]`.
          self[soundSprite.name] = soundSprite;
        }

        //#### JSON
        //Load JSON files that have file extensions that match
        //the `jsonExtensions` array.
        else if (self.jsonExtensions.indexOf(extension) !== -1) {
          //Create a new `xhr` object and an object to store the file.
          var xhr = new XMLHttpRequest();
          var file = {};
          //Use xhr to load the JSON file.
          xhr.open("GET", source, true);
          xhr.addEventListener("readystatechange", function() {
            //Check to make sure the file has loaded properly.
            if (xhr.status === 200 && xhr.readyState === 4) {
              //Convert the JSON data file into an ordinary object.
              file = JSON.parse(xhr.responseText);
              //Get the file name.
              file.name = source;
              //Assign the file as a property of the assets object so
              //we can access it like this: `assets["file.json"]`.
              self[file.name] = file;
              //Texture Packer support.
              //If the file has a `frames` property then its in Texture
              //Packer format.
              if (file.frames) {
                //Create the tileset frames.
                self.createTilesetFrames(file, source);
              } else {
                //Alert the load handler that the file has loaded.
                self.loadHandler();
              }
            }
          });
          //Send the request to load the file.
          xhr.send();
        }

        //Display a message if a file type isn't recognized.
        else {
          console.log("File type not recognized: " + source);
        }
      });
    },

    //#### createTilesetFrames
    //`createTilesetFrames` parses the JSON file  texture atlas and loads the frames
    //into this `assets` object.
    createTilesetFrames: function(json, source) {
      var self = this;
      //Get the image's file path.
      var baseUrl = source.replace(/[^\/]*$/, '');
      var image = new Image();
      image.addEventListener("load", loadImage, false);
      image.src = baseUrl + json.meta.image;
      function loadImage() {
        //Assign the image as a property of the `assets` object so
        //we can access it like this:
        //`assets["images/imageName.png"]`.
        self[baseUrl+json.meta.image] = image;
        //Loop through all the frames.
        Object.keys(json.frames).forEach(function(tilesetImage){
          //console.log(json.frames[image].frame);
          //The `frame` object contains all the size and position
          //data.
          //Add the frame to the asset object so that we
          //can access it like this: `assets["frameName.png"]`.
          self[tilesetImage] = json.frames[tilesetImage];
          //Get a reference to the source so that it will be easy for
          //us to access it later.
          self[tilesetImage].source = image;
          //console.log(self[tilesetImage].source)
        });
        //Alert the load handler that the file has loaded.
        self.loadHandler();
      }
    },

    //#### loadHandler
    //The `loadHandler` will be called each time an asset finishes loading.
    loadHandler: function () {
      var self = this;
      self.loaded += 1;
      console.log(self.loaded);
      //Check whether everything has loaded.
      if (self.toLoad === self.loaded) {
        //If it has, run the callback function that was assigned to the `whenLoaded` property
        console.log("Assets finished loading");
        //Reset `loaded` and `toLoaded` so we can load more assets
        //later if we want to.
        self.toLoad = 0;
        self.loaded = 0;
        self.whenLoaded();
      }
    }
  };

  //### makePointer
  //Makes a pointer object that unifies touch and mouse interactivity.
  //The pointer has `x` and `y` properties and `isUp`, `isDown` and
  //`tapped` Boolean states.
  function makePointer(){
    var o = {};
    o.x = 0;
    o.y = 0;
    //Add `centerX` and `centerY` getters so that we
    //can use the pointer's coordinates with easing
    //and collision functions.
    Object.defineProperties(o, {
      /*
      x: {
        get: function() {
          o._x * ga.scaleX;
        },
        enumerable: true, configurable: true
      },
      y: {
        get: function() {
          o._y * ga.scaleY;
        },
        enumerable: true, configurable: true
      },
      */
      centerX: {
        get: function() {
          return o.x;
        },
        enumerable: true, configurable: true
      },
      centerY: {
        get: function() {
          return o.y;
        },
        enumerable: true, configurable: true
      },
      //`position` returns an object with x and y properties that
      //contain the pointer's position.
      position: {
        get: function() {
          return {x: o.x, y: o.y};
        },
        enumerable: true, configurable: true
      }
    });
    //Booleans to track the pointer state.
    o.isDown = false;
    o.isUp = true;
    o.tapped = false;
    //Properties to help measure the time between up and down states.
    o.downTime = 0;
    o.elapsedTime = 0;
    //A `dragSprite` property to help with drag and drop.
    o.dragSprite = null;
    //The drag offsets to help drag sprites.
    o.dragOffsetX = 0;
    o.dragOffsetY = 0;

    //The pointer's mouse `moveHandler`
    o.moveHandler = function(event) {
      //Get the element that's firing the event.
      var element = event.target;
      //Find the pointer’s x and y position (for mouse).
      //Subtract the element's top and left offset from the browser window.
      o.x = (event.pageX - element.offsetLeft);
      o.y = (event.pageY - element.offsetTop);
    };

    //The pointer's `touchmoveHandler`.
    o.touchmoveHandler = function(event) {
      //Find the touch point's x and y position.
      o.x = (event.targetTouches[0].pageX - ga.canvas.offsetLeft);
      o.y = (event.targetTouches[0].pageY - ga.canvas.offsetTop);
      //Prevent the canvas from being selected.
      event.preventDefault();
    };

    //The pointer's `downHandler`.
    o.downHandler = function(event) {
      //Set the down states.
      o.isDown = true;
      o.isUp = false;
      o.tapped = false;
      //Capture the current time.
      o.downTime = Date.now();
    };

    //The pointer's `touchstartHandler`.
    o.touchstartHandler = function(event) {
      //Find the touch point's x and y position.
      o._x = event.targetTouches[0].pageX - ga.canvas.offsetLeft;
      o._y = event.targetTouches[0].pageY - ga.canvas.offsetTop;
      //Prevent the canvas from being selected.
      event.preventDefault();
      //Set the down states.
      o.isDown = true;
      o.isUp = false;
      o.tapped = false;
      //Capture the current time.
      o.downTime = Date.now();
    };

    //The pointer's `upHandler`.
    o.upHandler = function(event) {
      //Figure out how much time the pointer has been down.
      o.elapsedTime = Math.abs(o.downTime - Date.now());
      //If it's less than 200 milliseconds, it must be a tap or click.
      if (o.elapsedTime <= 200) {
        o.tapped = true;
      }
      o.isUp = true;
      o.isDown = false;
    };

    //The pointer's `touchendHandler`.
    o.touchendHandler = function(event) {
      //Figure out how much time the pointer has been down.
      o.elapsedTime = Math.abs(o.downTime - Date.now());
      //If it's less than 200 milliseconds, it must be a tap or click.
      if (o.elapsedTime <= 200) {
        o.tapped = true;
      }
      o.isUp = true;
      o.isDown = false;
    };

    //Bind the events to the handlers.
    //Mouse events.
    ga.canvas.addEventListener(
      "mousemove", o.moveHandler.bind(o), false
    );
    ga.canvas.addEventListener(
      "mousedown", o.downHandler.bind(o), false
    );
    ga.canvas.addEventListener(
      "mouseup", o.upHandler.bind(o), false
    );
    //Add a `mouseup` event to the `window` object as well to
    //catch a mouse button release outside of the canvas area.
    window.addEventListener(
      "mouseup", o.upHandler.bind(o), false
    );
    //Touch events.
    ga.canvas.addEventListener(
      "touchmove", o.touchmoveHandler.bind(o), false
    );
    ga.canvas.addEventListener(
      "touchstart", o.touchstartHandler.bind(o), false
    );
    ga.canvas.addEventListener(
      "touchend", o.touchendHandler.bind(o), false
    );
    //Add a `touchend` event to the `window` object as well to
    //catch a mouse button release outside of the canvas area.
    window.addEventListener(
      "touchend", o.touchendHandler.bind(o), false
    );
    //Disable the default pan and zoom actions on the `canvas`.
    ga.canvas.style.touchAction = "none";

    //`hitTestSprite` figures out if the pointer is touching a sprite.
    o.hitTestSprite = function(sprite) {
      var hit = false;
      //Is the sprite rectangular?
      if (!sprite.circular) {
        //Get the position of the sprite's edges using global
        //coordinates.
        var left = sprite.gx * ga.scale,
            right = (sprite.gx + sprite.width) * ga.scale,
            top = sprite.gy * ga.scale,
            bottom = (sprite.gy + sprite.height) * ga.scale;

        //Find out if the point is intersecting the rectangle.
        hit = o.x > left && o.x < right && o.y > top && o.y < bottom;
      }
      //Is the sprite circular?
      else {
        //Find the distance between the point and the
        //center of the circle.
        var vx = o.x - ((sprite.gx + sprite.halfWidth) * ga.scale),
            vy = o.y - ((sprite.gy + sprite.halfHeight) * ga.scale),
            magnitude = Math.sqrt(vx * vx + vy * vy);

        //The point is intersecting the circle if the magnitude
        //(distance) is less than the circle's radius.
        hit = magnitude < sprite.radius;
      }
      return hit;
    };

    o.updateDragAndDrop = function() {
      if (o.isDown) {
        //Capture the co-ordinates at which the pointer was
        //pressed down and find out if it's touching a sprite.
        if (o.dragSprite === null) {
          //Loop through the draggable sprites in reverse to start searching at the bottom of the stack.
          for (var i = ga.draggableSprites.length - 1; i > -1; i--) {
            var sprite = ga.draggableSprites[i];
            //Check for a collision with the pointer using `hitTestPoint`.
            if (o.hitTestSprite(sprite) && sprite.draggable) {
              //Calculate the difference between the pointer's
              //position and the sprite's position.
              o.dragOffsetX = o.x - sprite.gx;
              o.dragOffsetY = o.y - sprite.gy;
              //Set the sprite as the pointer's `dragSprite` property.
              o.dragSprite = sprite;
              //The next two lines re-order the `sprites` array so that the
              //selected sprite is displayed above all the others.
              //First, splice the sprite out of its current position in
              //its parent's `children` array.
              var children = sprite.parent.children;
              children.splice(children.indexOf(sprite), 1);
              //Next, push the `dragSprite` to the end of its `children` array so that it's
              //displayed last, above all the other sprites.
              children.push(sprite);
              break;
            }
          }
        } else {
          //If the pointer is down and it has a `dragSprite`, make the sprite follow the pointer's
          //position, with the calculated offset.
          o.dragSprite.x = o.x - o.dragOffsetX;
          o.dragSprite.y = o.y - o.dragOffsetY;
        }
      }
      //If the pointer is up, drop the `dragSprite` by setting it to `null`.
      if (o.isUp) {
        o.dragSprite = null;
      }
      //Change the mouse arrow pointer to a hand if it's over a
      //sprite.
      ga.draggableSprites.some(function(sprite) {
        if (o.hitTestSprite(sprite) && sprite.draggable) {
          ga.canvas.style.cursor = "pointer";
          return true;
        } else {
          ga.canvas.style.cursor = "auto";
          return false;
        }
      });
    }

    //Return the pointer.
    return o;
  }

  /*
  ### keyboard
  The `keyboard` function creates `key` objects
  that listen for keyboard events. Create a new key object like
  this:

     var keyObject = g.keyboard(asciiKeyCodeNumber);

  Then assign `press` and `release` methods like this:

    keyObject.press = function() {
      //key object pressed
    };
    keyObject.release = function() {
      //key object released
    };

  Keyboard objects also have `isDown` and `isUp` Booleans that you can check.
  */

  function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = function(event) {
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };

    //The `upHandler`
    key.upHandler = function(event) {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };

    //Attach event listeners
    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
  }

  /*
  ### makeKeys
  `makeKeys` is called when Ga is initialized. It pre-defines the
  arrow keys and space bar so that you can use them right away in
  your games like this:

      g.key.leftArrow.press = function() {
        //left arrow pressed.
      };
      g.key.leftArrow.release = function() {
        //left arrow released.
      };

  The keyboard objects that `makeKeys` creates are:

      key.leftArrow
      key.upArrow
      key.rightArrow
      key.downArrow
      key.space

  */

  function makeKeys () {
    var o = {};
    //Assign the arrow keys and the space bar
    o.leftArrow = keyboard(37);
    o.upArrow = keyboard(38);
    o.rightArrow = keyboard(39);
    o.downArrow = keyboard(40);
    o.space = keyboard(32);
    return o;
  }

  //### byLayer
  //`byLayer` is an array sort method that's called when a sprite's
  //`layer` property is changed.
  function byLayer(a, b) {
    //return a.layer - b.layer;
    if (a.layer < b.layer) {
      return -1;
    } else if (a.layer > b.layer) {
      return 1;
    } else {
      return 1;
    }
  }


  /*
  Chapter 5: Sound
  ----------------

  ###makeSound
  `makeSound` creates and returns and WebAudio sound sprite. It's
  called by `assets.load` when sounds are loaded into the Ga engine.
  After the sound is loaded you can access and use it like this:

      var anySound = g.sound("sounds/anyLoadedSound.wav");
      anySound.loop = true;
      anySound.pan = 0.8;
      anySound.volume = 0.5;
      anySound.play();
      anySound.pause();
      anySound.playFrom(second);
      anySound.restart();

  */

  ga.makeSound = function(source, loadHandler) {
    var o = {};
    //Set the default properties.
    //The `ga.actx` audio context is created when Ga is initialized.
    o.actx = ga.actx;
    o.volumeNode = o.actx.createGain();
    o.panNode = o.actx.createPanner();
    o.panNode.panningModel = "equalpower";
    o.soundNode = undefined;
    o.buffer = undefined;
    o.source = undefined;
    o.loop = false;
    o.isPlaying = false;
    //The function that should run when the sound is loaded.
    o.loadHandler = undefined;
    //Values for the `pan` and `volume` getters/setters.
    o.panValue = 0;
    o.volumeValue = 1;
    //Values to help track and set the start and pause times.
    o.startTime = 0;
    o.startOffset = 0;
    //The sound object's methods.
    o.play = function() {
      //Set the start time (it will be `0` when the sound
      //first starts.
      o.startTime = o.actx.currentTime;
      //Create a sound node.
      o.soundNode = o.actx.createBufferSource();
      //Set the sound node's buffer property to the loaded sound.
      o.soundNode.buffer = o.buffer;
      //Connect the sound to the pan, connect the pan to the
      //volume, and connect the volume to the destination.
      o.soundNode.connect(o.panNode);
      o.panNode.connect(o.volumeNode);
      o.volumeNode.connect(o.actx.destination);
      //Will the sound loop? This can be `true` or `false`.
      o.soundNode.loop = o.loop;
      //Finally, use the `start` method to play the sound.
      //The start time will either be `0`,
      //or a later time if the sound was paused.
      o.soundNode.start(
        0, o.startOffset % o.buffer.duration
      );
      //Set `isPlaying` to `true` to help control the
      //`pause` and `restart` methods.
      o.isPlaying = true;
    };
    o.pause = function() {
      //Pause the sound if it's playing, and calculate the
      //`startOffset` to save the current position.
      if (o.isPlaying) {
        o.soundNode.stop(0);
        o.startOffset += o.actx.currentTime - o.startTime;
        o.isPlaying = false;
      }
    };
    o.restart = function() {
      //Stop the sound if it's playing, reset the start and offset times,
      //then call the `play` method again.
      if (o.isPlaying) {
        o.soundNode.stop(0);
      }
      o.startOffset = 0;
      o.play();
    };
    o.playFrom = function(value) {
      if (o.isPlaying) {
        o.soundNode.stop(0);
      }
      o.startOffset = value;
      o.play();
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
      pan: {
        get: function() {
          return o.panValue;
        },
        set: function(value) {
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
        o.actx.decodeAudioData(
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

  //Make the `keyboard` and `makeDisplayObject` functions public.
  ga.keyboard = keyboard;
  ga.makeDisplayObject = makeDisplayObject;

  //Initialize the plugins, if they exist.
  if (GA.plugins !== undefined) GA.plugins(ga);

  //Install any user-defined plugins or custom initialization code.
  if (GA.custom !== undefined) GA.custom(ga);

  //Return `ga`.
  return ga;
};

