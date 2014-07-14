function GA(width, height, setup, assetsToLoad, load) {
  var ga = {};

  /*
  Intilaize the game engine
  -------------------------
  */

  //Make the canvas element and add it to the DOM
  ga.canvas = document.createElement("canvas");
  ga.canvas.setAttribute("width", width);
  ga.canvas.setAttribute("height", height);
  ga.canvas.style.backgroundColor = "black";
  document.body.appendChild(ga.canvas);
  
  //Create the context as a property of the canvas
  ga.canvas.ctx = ga.canvas.getContext("2d");

  //Make the stage
  ga.stage = group();
 
  //Initialize the pointer 
  ga.pointer = makePointer();

  //Make the keyboard keys (arrow keys and space bar)
  ga.key = makeKeys();

  //Create an audio context
  ga.actx = new AudioContext();

  //An array to hold all the button sprites
  ga.buttons = [];

  //Set the game `state`
  ga.state = undefined;

  //Set the user-defined `load` and `setup` states
  ga.load = load || undefined;
  ga.setup = setup || undefined;

  //The `setup` function is required, so throw an error if it's
  //missing
  if(ga.setup === undefined) {
    throw new Error(
      "Please supply the setup function in the constructor"
    );
  }

  //Get the user-defined array that lists the assets 
  //that have to load
  ga.assetFilePaths = assetsToLoad || undefined;

  //A Boolean to let us pause the game
  ga.paused = false;

  //The upper-limit frames per second that the game should run at
  //If `_fps` is undefined, the game will attempt to run at the 
  //maximum frame rate permitted by `requestAnimationFrame`
  //Use the `fps` getter/setter to modify ga value;
  ga._fps = undefined;
  

  /*
  Core game engine methods
  ------------------------
  */

  //The engine's game loop
  function gameLoop() {
    requestAnimationFrame(gameLoop, ga.canvas);
    //If `fps` hasn't been set, run at the maximum frame rate.
    if (!ga._fps) {
      //Run the code for each frame.
      update();
    }
    //If `fps` has been set, clamp the frame rate to that upper limit
    else {
      if (Date.now() >= ga._startTime){  
        //Run the code for each frame. 
        update();
        //Set the new start time for the next frame, 
        //which will be 66 milliseconds ahead of the current time
        ga._startTime = Date.now() + ga._frameDuration;
      }
    }
  }
  //The things that should happen in the game loop
  function update() {
    //Run the current game state if it's been defined and
    //the game isn't paused
    if(ga.state && !ga.paused) {
      ga.state();
    }

    //Render the canvas
    ga.render(ga.canvas);

    //Update all the buttons in the game
    if (ga.buttons.length > 0) {
      ga.canvas.style.cursor = "auto";
      for(var i = 0; i < ga.buttons.length; i++) {
        var button = ga.buttons[i];
        button.update(ga.pointer, ga.canvas);
        if (button.state === "over" || button.state === "down") {
          ga.canvas.style.cursor = "pointer";
        }
      }
    }
  }

  //The `start` method that gets the whole engine going
  ga.start = function() {
    if (ga.assetFilePaths) {
      //Use the supplied file paths to load the assets then run
      //the user-defined `setup` function
      ga.assets.whenLoaded = function() {
        //Clear the game state for now to stop the loop
        ga.state = undefined;
        //Call the `setup` function
        ga.setup();
      };
      ga.assets.load(ga.assetFilePaths);
      //While the assets are loading, set the user-defined `load`
      //function as the game state. That will make it run in a loop
      if (ga.load) {
        ga.state = ga.load;
      }
    }
    //If there aren't any assets to load, 
    //just run the user-defined `setup` functions
    else {  
      ga.setup();
    }
    //Start the game loop
    gameLoop();
  };

  //Some convenience methods for interacting with the game engine.
  //`pause` and `resume` methods. They start and stop the game loop to
  //allow you to run functions that should only execute once.
  ga.pause = function() {
    ga.paused = true;
  };
  ga.resume = function() {
    ga.paused = false;
  };
  //Use `hidePointer` and `showPointer` to hide and display the
  //pointer
  ga.hidePointer = function() {
    ga.canvas.style.cursor = "none";
  };
  ga.showPointer = function() {
    ga.canvas.style.cursor = "auto";
  };

  //Getters and setters for various game engine properties
  Object.defineProperties(ga, {
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
    //Set the background color
    backgroundColor: {
      set: function(value) {
        ga.canvas.style.backgroundColor = value;
      }, 
      enumerable: true, configurable: true
    }
  });

  /*
  Display objects
  ---------------
  */

  function makeContainer(o) {
    //Create a `children` array that contains all the 
    //in this container
    o.children = [];
    //Push the `children` array in to the global `sprites` array
    //The `addChild` function lets you add sprites to this container
    o.addChild = function(sprite) {
      //Remove the sprite from its current parent, if it has one
      if (sprite.parent) {
        sprite.parent.removeChild(sprite);
      }
      //Make this object the sprite's parent and 
      //add it to this object's `children` array
      sprite.parent = o;
      o.children.push(sprite);
    };
    o.removeChild = function(sprite) {
      if(sprite.parent === o) {
        o.children.splice(o.children.indexOf(sprite), 1);
      } else {
        throw new Error(sprite + "is not a child of " + o);
      }
    };
    //`add` and `remove` convenience functions to add and remove
    //many sprites at the same time
    o.add = function(spritesToAdd) {
      var sprites = Array.prototype.slice.call(arguments);
      sprites.forEach(function(sprite) {
        o.addChild(sprite);
      });
    };
    o.remove = function(spritesToRemove) {
      var sprites = Array.prototype.slice.call(arguments);
      sprites.forEach(function(sprite) {
        o.removeChild(sprite);
      });
    };
  }

  function group(spritesToGroup) {
    var o = {};
    o.type = "group";
    //Make the group a container object
    makeContainer(o);
    //Set the group's `width` and `height` to 0
    o.width = 0;
    o.height = 0;
    //Add the common sprite properties to the group
    //the group has a `width` and `height` of 0, so 
    //no properties using `width` or `height` should be used.
    addProperties(o);
    //Add the group to the `stage`, if the stage exists
    if(ga.stage) {
      ga.stage.addChild(o);
    }
    //Group any sprites that were passed to the group's argumnents
    //(Important!: This needs to be done after adding the group to the stage)
    if (spritesToGroup) {
      var sprites = Array.prototype.slice.call(arguments);
      sprites.forEach(function(sprite) {
        o.addChild(sprite);
      });
    }
    //Return the group
    return o;
  }

  //Common properties for all the display objects
  function addProperties(sprite) {
    sprite.vx = 0; 
    sprite.vy = 0;
    sprite.parent = undefined;
    sprite._rotation = 0;
    sprite._visible = true;
    sprite._alpha = 1;
    sprite._x = 0;
    sprite._y = 0;
    sprite._layer = 0;
    sprite._draggable = undefined;
    sprite._circular = false;
    //Make it a container object so that you can use
    //`addChild` and `removeChild` to create composite objects
    makeContainer(sprite);

    //A `position` object that lets you set the sprite's `x` and `y`
    //values using `sprite.position.set(xValue, yValue)`.
    //`sprite.position.get()` returns an object containing the 
    //sprite's `x` and `y` values.
    sprite.position = {
      set: function(x, y){
        sprite.x = x;
        sprite.y = y;
      },
      get: function() {
        var o = {};
        o.x = sprite.x;
        o.y = sprite.y;
        return o;
      }
    };

    //Getters and setters for various game engine properties
    Object.defineProperties(sprite, {
      //`x` and `y` getters and setters move child sprites
      x: {
        get: function() {
          return this._x;
        },
        set: function(value) {
          var currentX = this.x;
          if (this.children && this.children.length > 0) {
            this.children.forEach(function(child) {
              //The offset is equal to the difference between the 
              //container's `currentX` position and its new `value`
              var offset = value - currentX;
              child.x += offset;
            });
          }
          //Set the new x value
          this._x = value;
        },
        enumerable: true, configurable: true
      },
      y: {
        get: function() {
          return this._y;
        },
        set: function(value) {
          var currentY = this.y;
          if (this.children && this.children.length > 0) {
            this.children.forEach(function(child) {
              //The offset is equal to the difference between the 
              //container's `currentX` position and its new `value`
              var offset = value - currentY;
              child.y += offset;
            });
          }
          //Set the new x value
          this._y = value;
        },
        enumerable: true, configurable: true
      },
      //`alpha` getter/setter
      alpha: {
        get: function() {
          return this._alpha;
        },
        set: function(value) {
          if (this.children && this.children.length > 0) {
            this.children.forEach(function(child) {
              child.alpha = value;
            });
          }
          //Set the new x value
          this._alpha = value;
        },
        enumerable: true, configurable: true
      },
      //`visible` getter/setter
      visible: {
        get: function() {
          return this._visible;
        },
        set: function(value) {
          if (this.children && this.children.length > 0) {
            this.children.forEach(function(child) {
              child.visible = value;
            });
          }
          //Set the new x value
          this._visible = value;
        },
        enumerable: true, configurable: true
      },
      //`rotation` getter/setter
      rotation: {
        get: function() {
          return this._rotation;
        },
        set: function(value) {
          if (this.children && this.children.length > 0) {
            this.children.forEach(function(child) {
              /*
              child.rotation = value;
              var radius = ga.distance(child, child.parent), 
                  angle = value;
              var vx = child.centerX - child.parent.centerX;
              var vy = child.centerY - child.parent.centerY;
             //child.x = Math.cos(angle) * vx - Math.sin(angle) * vy + child.parent.centerX;
             //child.y = Math.sin(angle) * vx + Math.cos(angle) * vy + child.parent.centerY;
             */
            });
          }
          //Set the new x value
          this._rotation = value;
        },
        enumerable: true, configurable: true
      },
      halfWidth: {
        get: function() {
          return this.width / 2;
        },
        enumerable: true, configurable: true
      },
      halfHeight: {
        get: function() {
          return this.height / 2;
        },
        enumerable: true, configurable: true
      },
      centerX: {
        get: function() {
          return this.x + this.halfWidth;
        },
        enumerable: true, configurable: true
      },
      centerY: {
        get: function() {
          return this.y + this.halfHeight;
        },
        enumerable: true, configurable: true
      },
      layer: {
        get: function() {
          return this._layer;
        },
        set: function(value) {
          this._layer = value;
          this.parent.children.sort(byLayer);          
        },
        enumerable: true, configurable: true
      },
      circular: {
        get: function() {
          return this._circular;
        },
        set: function(value) {
          //Give the sprite `diameter` and `radius` properties
          //if `circular` is `true`
          if (value === true && this._circular === false) {
            makeCircular(this);
            this._circular = true;
          }
          //Remove the sprite's `diameter` and `radius` properties
          //if `circular` is `false`
          if (value === false && this._circular === true) {
            delete this.diameter;
            delete this.radius;
            this._circular = false;
          }
        },
        enumerable: true, configurable: true
      }
    });
  }

  //Add `diameter` and `radius` properties to circular sprites
  function makeCircular(sprite) {
    Object.defineProperties(sprite, {
      diameter: {
        get: function() {
          return this.width;
        },
        set: function(value) {
          this.width = value;
          this.height = value;
        },
        enumerable: true, configurable: true
      },
      radius: {
        get: function() {
          return this.width / 2;
        },
        set: function (value) {
          this.width = value * 2;
          this.height = value * 2;
        }, 
        enumerable: true, configurable: true
      }
    });
  }


  //rectangle
  ga.rectangle = function (width, height, fillStyle, strokeStyle, lineWidth, x, y) {
    var o = {};
    o.type = "rectangle";
    //Set defaults
    o.width = width || 32;
    o.height = height || 32;
    o.fillStyle = fillStyle || "red";
    o.strokeStyle = strokeStyle || "none";
    o.lineWidth = lineWidth || 0;
    //Add extra sprite properties
    addProperties(o);
    //Set the sprite's getters
    o.x = x || 0;
    o.y = y || 0;
    //Add the sprite to the stage
    ga.stage.addChild(o);
    return o;
  };

  //circle
  ga.circle = function(diameter, fillStyle, strokeStyle, lineWidth, x, y) {
    var o = {};
    o.type = "circle";
    //Set defaults
    o.width = diameter || 32;
    o.height = diameter || 32;
    o.fillStyle = fillStyle || "red";
    o.strokeStyle = strokeStyle || "none";
    o.lineWidth = lineWidth || "none";
    //Add some extra properties to the sprite
    addProperties(o);
    //Set the sprite's getters
    o.x = x || 0;
    o.y = y || 0;
    //Add `diameter` and `radius` getters and setters
    makeCircular(o);
    //Make it a container object
    makeContainer(o);
    //Add the sprite to the stage
    ga.stage.addChild(o);
    return o;
  };

  //line
  ga.line = function(strokeStyle, lineWidth, ax, ay, bx, by) {
    var o = {};
    o.type = "line";
    //Set defaults
    o.ax = ax || 0;
    o.ay = ay || 0;
    o.bx = bx || 32;
    o.by = by || 32;
    o.strokeStyle = strokeStyle || "red";
    o.lineWidth = lineWidth || 1;
    o.visible = true;
    o.alpha = 1;
    //Measure the width and height of the line
    Object.defineProperties(o, {
      //Calculate the `width` and `height` properties
      width: {
        get: function() {
          return o.bx - o.ax; 
        },
        enumerable: true, configurable: true
      },
      height: {
        get: function() {
          return o.by - o.ay;
        },
        enumerable: true, configurable: true
      },
      //Calculate the `x` and `y` properties
      x: {
        get: function() {
          return Math.min(o.ax, o.bx);
        },
        enumerable: true, configurable: true
      },
      y: {
        get: function() {
          return Math.min(o.ay, o.by);
        },
        enumerable: true, configurable: true
      }
    });
    //Add the sprite to the stage
    ga.stage.addChild(o);
    return o;
  };

  //text
  ga.text = function(content, font, fillStyle, x, y) {
    var o = {};
    o.type = "text";
    //Set defaults
    o.content = content || "Hello!";
    o.font = font || "12px sans-serif";
    o.fillStyle = fillStyle || "red";
    o.textBaseline = "top";
    o.x = x || 0;
    o.y = y || 0;
    o.vx = 0;
    o.vy = 0;
    o.visible = true;
    o.alpha = 1;
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
    //A `position` object that lets you set the sprite's `x` and `y`
    //values using `sprite.position.set(xValue, yValue)`.
    //`sprite.position.get()` returns an object containing the 
    //sprite's `x` and `y` values.
    o.position = {
      set: function(x, y){
        o.x = x;
        o.y = y;
      },
      get: function() {
        var point = {};
        point.x = o.x;
        point.y = o.y;
        return point;
      }
    };
    //Add the sprite to the stage
    ga.stage.addChild(o);
    return o;
  };

  //The `frame` function returns and object that defines
  //in the position and size of a sub-image in a tilseet
  ga.frame = function(source, x, y, width, height) {
    var o = {};
    o.image = source;
    o.x = x;
    o.y = y;
    o.width = width;
    o.height = height;
    return o;
  };
  
  //The `frames` function returns and object that defines
  //in the position and size of a sub-image in a tilseet
  ga.frames = function(source, arrayOfPositions, width, height) {
    var o = {};
    o.image = source;
    o.data = arrayOfPositions;
    o.width = width;
    o.height = height;
    return o;
  };

  //If you have a complex animation in a single image,  you can use 
  //`filmStrip` to autmatically create an array of x,y
  //coordinates for each animation frame.
  //`filmStrip` arguments:
  //imageName, frameWidth, frameHeight
  ga.filmStrip = function(imageName, frameWidth, frameHeight){
    var image = g.assets[imageName],
        positions = [],
        //Find out how many columns and rows there are in the image
        columns = image.width / frameWidth,
        rows = image.height / frameHeight,
        //Find the total number of frames
        numberOfFrames = columns * rows;    

    for(var i = 0; i < numberOfFrames; i++) {
      //Find the correct row and column for each frame
      //and figure out its x and y position
      var x, y;
      x = (i % columns) * frameWidth;
      y = Math.floor(i / columns) * frameHeight;
      //Add the x and y value of each frame to the `positions` array
      positions.push([x, y]);
    }
    return ga.frames(imageName, positions, frameWidth, frameHeight);
  };
  
  //sprite
  ga.sprite = function(source) {
    var o = {};
    o.type = "sprite";
    o.frames = [];
    o.loop = true;
    o._currentFrame = 0;
    if (source === undefined) throw new Error("Sprites require a source");
    //If the source is just an ordinary image object, use it to create the
    //sprite
    if (!source.image) {
      o.source = ga.assets[source];
      o.sourceX =  0;
      o.sourceY =  0;
      o.width = o.source.width;
      o.height = o.source.height;
      o.sourceWidth = o.source.width;
      o.sourceHeight = o.source.height;
    }
    //If the source contains an `image` sub-property, this must
    //be a frame object that's defining the rectangular area of an inner sub-image
    //Use that sub-image to make the sprite. If it doesn't contain a
    //`data` property, then it must be a single frame
    if(source.image && !source.data) {
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
    if(source.image && source.data) {
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
    o.gotoAndStop = function(frameNumber) {
      if (o.frames.length > 0) {
        o.sourceX = o.frames[frameNumber][0];
        o.sourceY = o.frames[frameNumber][1];
        //Set the `_currentFrame` value
        o._currentFrame = frameNumber;
      } else {
        throw new Error("Frame number " + frameNumber + "doesn't exist");
      }
    };
    //Add a getter for the `currentFrames` property
    if (o.frames.length > 0) {
      Object.defineProperty(o, "currentFrame", {
        get: function() {
          return o._currentFrame;
        }, 
        enumerable: false, configurable: false,
      });
    }
    //Add extra sprite properties
    addProperties(o);
    //Set the sprite's getters
    o.x = 0;
    o.y = 0;
    //If the sprite has more than one frame, add a state player
    if (o.frames.length > 0) ga.addStatePlayer(o);
    //Add the sprite to the stage
    ga.stage.addChild(o);
    return o;
  };

  ga.button = function(source){
    //First make an ordinary sprite
    var o = ga.sprite(source);  
    //`press` and `release` methods. They're `undefined`
    //for now, but they'll be defined in the game program
    o.press = undefined;
    o.release = undefined;
    //The `state` property tells you button's
    //curent state. Set its initial state to "up"
    o.state = "up";
    //The `action` property tells you whether its being pressed or
    //released
    o.action = "";
    //`pressed` is a Boolean that helps track whether or not
    //the button has been pressed down.
    o.pressed = false;
    //Add the button into the global `buttons` array so that it
    //can be updated by the game engine.
    ga.buttons.push(o);

    //The update method will be called each frame inside
    //Ga's game loop
    o.update = function(pointer, canvas) {
      //Figure out if the pointer is touching the button
      //Get the postion of the sprite's edges
      var left = o.x,
          right = o.x + o.width,
          top = o.y,
          bottom = o.y + o.height,
          //Find out if the point is intersecting the rectangle
          hit = pointer.x > left && pointer.x < right && pointer.y > top && pointer.y < bottom;
      
      //1. Figure out the current state
      if (pointer.isUp) {
        //Up state
        o.state = "up";
        //Show the first frame
        o.show(0);
      }
      //If the pointer is touching the button, figure out 
      //if the over or down state should be displayed
      if (hit) {
        //Over state
        o.state = "over";
        //Show the second frame if this button has
        //3 frames.
        if (o.frames.length === 3) {
          o.show(1);
        }
        //Down state
        if (pointer.isDown) {
          o.state = "down"
          //Show the thrid frame if this button has
          //three frames, or show the second frame if it
          //only has two frames
          if (o.frames.length === 3) {
            o.show(2);
          } else {
            o.show(1); 
          }
        }
      }

      //3. Run the correct button action
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
        }
      }
      //c. Check to whether the pointer has been released outside
      //the button's area. If the button state is "up" and it's
      //already been pressed, then run the `release` method.
      if (o.state === "up") {
        if (o.pressed) {
          if (o.release) o.release();
          o.pressed = false;
          o.action = "released";
        }
      }
    }
    return o;
  };
  
  //A convenience method that lets you access images by their file names
  ga.image = function(imageFileName){
    return ga.assets[imageFileName];
  };

  //A state manager and keyframe animation player for
  //sprites with more than one frame

  ga.addStatePlayer = function(sprite) {
    //Intialize the variables
    var frameCounter = 0,
        numberOfFrames = 0,
        startFrame = 0,
        endFrame = 0,
        timerInterval = undefined,
        playing = false;
    
    //The `show` function (to display static states)
    function show(frameNumber) {
      //Reset any possible previous animations
      reset();
      //Find the new state on the sprite 
      sprite.gotoAndStop(frameNumber);
    }

    //The `play` function plays all the sprites frames
    function play() {
      playSequence([0, sprite.frames.length - 1]);
    }
    
    //The `stop` function stops the animation at the current frame
    function stop() {
      reset();
      sprite.gotoAndStop(sprite.currentFrame);
    }

    //The `playSequence` function, to play a sequence of frames
    function playSequence(sequenceArray) {
      //Reset any possible previous animations
      reset();
      //Figure out how many frames there are in the range
      startFrame = sequenceArray[0];
      endFrame = sequenceArray[1];
      numberOfFrames = endFrame - startFrame;
      //Compensate for two edge cases:
      //1. if the `startFrame` happens to be `0`
      if (startFrame === 0) {
        numberOfFrames += 1;
        frameCounter += 1;
      }
      //2. if only a two-frame sequence was provided
      if(numberOfFrames === 1){
        numberOfFrames = 2;
        frameCounter += 1;
      }; 
      //Calculate the frame rate. Set a default fps of 12
      if (!sprite.fps) sprite.fps = 12;
      var frameRate = 1000 / sprite.fps;
      //Set the sprite to the starting frame
      sprite.gotoAndStop(startFrame);
      //If the state isn't already playing, start it
      if(!playing) {
        timerInterval = setInterval(advanceFrame.bind(this), frameRate);
        playing = true;
      }
    }
    
    //`advanceFrame` is called by `setInterval` to dislay the next frame
    //in the sequence based on the `frameRate`. When frame sequence
    //reaches the end, it will either stop it or loop it.
    function advanceFrame() {
      //Advance the frame if `frameCounter` is less than 
      //the state's total frames
      if (frameCounter < numberOfFrames) {
        //Advance the frame
        sprite.gotoAndStop(sprite.currentFrame + 1);
        //Update the frame counter
        frameCounter += 1;
      } else {
        //If we've reached the last frame and `loop`
        //is `true`, then start from the first frame again
        if (sprite.loop) {
          sprite.gotoAndStop(startFrame);
          frameCounter = 1;
        }
      }
    }
    
    function reset() {
      //Reset `playing` to `false`, set the `frameCounter` to 0,
      //and clear the `timerInterval`
      if (timerInterval !== undefined && playing === true) {
        playing = false;
        frameCounter = 0;
        startFrame = 0;
        endFrame = 0;
        numberOfFrames = 0;
        clearInterval(timerInterval);
      }
    }

    //Add the `show`, `play`, `stop` and `playSequence` methods to the sprite
    sprite.show = show;
    sprite.play = play;
    sprite.stop = stop;
    sprite.playSequence = playSequence;
  };
  

  /*
  render
  -------

  A render function that displays all the sprites on the the canvas.
  Use it inside a game loop to render the sprites like this:

      render(canvasContext);

  If the canvas contains a camera, it will be used to scroll the game world.
      
  */

  ga.render = function(canvas) {
    //Get a reference to the context
    var ctx = canvas.ctx;
    //Get a reference to the camera, if it exists
    var camera = camera || canvas.camera;
    //Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //Display the all the sprites 
    for (var i = 0; i < ga.stage.children.length; i++) {  
      var sprite = ga.stage.children[i];
      displaySprite(sprite);
    }
    function displaySprite(sprite) {
      //Only draw sprites if they're visible and inside the
      //area of the canvas
      if (
        sprite.visible
        && sprite.x + sprite.width > 0
        && sprite.x < canvas.width
        && sprite.y + sprite.height > 0
        && sprite.y < canvas.height
        || sprite.type === "group"
      ) {
        //Draw the different sprite types
        //Rectangle
        if (sprite.type === "rectangle") {      
          ctx.save();
          //Add an optional camera
          if (camera && camera.initialized && sprite.scroll) {
            ctx.translate(-camera.x, -camera.y);
          }
          ctx.strokeStyle = sprite.strokeStyle;
          ctx.lineWidth = sprite.lineWidth;
          ctx.fillStyle = sprite.fillStyle;
          ctx.globalAlpha = sprite.alpha;
          ctx.translate(
            Math.floor(sprite.centerX),
            Math.floor(sprite.centerY)
          );
          ctx.rotate(sprite.rotation);
          ctx.beginPath();
          //Draw the rectangle around the context's center point
          ctx.rect(
            Math.floor(-sprite.halfWidth),
            Math.floor(-sprite.halfHeight),
            sprite.width,
            sprite.height
          );
          if (sprite.strokeStyle !== "none") ctx.stroke();
          if (sprite.fillStyle !== "none") ctx.fill();
          ctx.restore();
        }

        //Circle
        if (sprite.type === "circle") {      
          ctx.save();
          //Add an optional camera
          if (camera && camera.initialized && sprite.scroll) {
            ctx.translate(-camera.x, -camera.y);
          }
          ctx.strokeStyle = sprite.strokeStyle;
          ctx.lineWidth = sprite.lineWidth;
          ctx.fillStyle = sprite.fillStyle;
          ctx.globalAlpha = sprite.alpha;
          ctx.translate(
            Math.floor(sprite.centerX),
            Math.floor(sprite.centerY)
          );
          ctx.rotate(sprite.rotation);
          ctx.beginPath();
          ctx.arc(0, 0, sprite.radius, 0, 6.28, false);
          if (sprite.strokeStyle !== "none") ctx.stroke();
          if (sprite.fillStyle !== "none") ctx.fill();
          ctx.restore();
        }
        
        //Line
        if (sprite.type === "line") {      
          ctx.save();
          //Add an optional camera
          if (camera && camera.initialized && sprite.scroll) {
            ctx.translate(-camera.x, -camera.y);
          }
          ctx.strokeStyle = sprite.strokeStyle;
          ctx.lineWidth = sprite.lineWidth;
          ctx.globalAlpha = sprite.alpha;
          ctx.beginPath();
          ctx.moveTo(sprite.ax, sprite.ay);
          ctx.lineTo(sprite.bx, sprite.by);
          if (sprite.strokeStyle !== "none") ctx.stroke();
          if (sprite.fillStyle !== "none") ctx.fill();
          ctx.restore();
        }
        
        //Text
        if (sprite.type === "text") {      
          ctx.save();
          //Add an optional camera
          if (camera && camera.initialized && sprite.scroll) {
            ctx.translate(-camera.x, -camera.y);
          }
          ctx.globalAlpha = sprite.alpha;
          ctx.font = sprite.font;
          ctx.fillStyle = sprite.fillStyle;
          ctx.textBaseline = sprite.textBaseline;
          ctx.fillText(sprite.content, sprite.x, sprite.y);
          ctx.restore();
        }

        //Sprite
        if (sprite.type === "sprite") {      
          ctx.save();
          //Add an optional camera
          if (camera && camera.initialized && sprite.scroll) {
            ctx.translate(-camera.p.x, -camera.p.y);
          }
          ctx.globalAlpha = sprite.alpha;
          ctx.translate(
            Math.floor(sprite.centerX),
            Math.floor(sprite.centerY)
          );
          ctx.rotate(sprite.rotation);
          ctx.drawImage(
            sprite.source,
            sprite.sourceX, sprite.sourceY,
            sprite.sourceWidth, sprite.sourceHeight,
            Math.floor(-sprite.halfWidth),
            Math.floor(-sprite.halfHeight),
            sprite.width, sprite.height
          );
          ctx.restore();
        }

        //Group
        if (sprite.type === "group") {
          //Display the children of the group
          if (sprite.children && sprite.children.length > 0) {
            for (var j = 0; j < sprite.children.length; j++) {  
              var child = sprite.children[j];
              displaySprite(child);
            }
          }
        }
        
        //If the sprite contains child sprites in its
        //`children` array, display them
        if (sprite.children && sprite.children.length > 0) {
          for (var k = 0; k < sprite.children.length; k++) {  
            var child = sprite.children[k];
            displaySprite(child);
          }
        }
      }
    }
  };

  /*
  Game engine objects
  */

  //Asset loader
  ga.assets = {
    //Properties to help track the assets being loaded
    toLoad: 0,
    loaded: 0,
    
    //File extensions for different types of assets
    imageExtensions: ["png", "jpg", "gif"],
    fontExtensions: ["ttf", "otf", "ttc", "woff"],
    audioExtensions: ["mp3", "ogg", "wav", "webm"],
    
    //The callback function that should run when all assets have loaded.
    //Assign this when you load the fonts, like this: `assets.whenLoaded = makeSprites;`
    whenLoaded: undefined,
    
    //The load method creates and loads all the assets. Use it like this:
    //`assets.load(["images/anyImage.png", "fonts/anyFont.otf"]);`
    
    load: function(sources) {
      console.log("Loading assets...");
      //Find the number of files that need to be loaded
      this.toLoad = sources.length;
      //Get a reference to this asset object so we can 
      //refer to it in the forEach loop ahead
      var self = this;
      sources.forEach(function(source){
        //Find the file extension of the asset
        var extension = source.split('.').pop();
        
        //Images
        //Load images that have file extensions that match 
        //the imageExtensions array
        if (self.imageExtensions.indexOf(extension) !== -1) {
          //Create a new image and add a loadHandler
          var image = new Image();
          image.addEventListener("load", self.loadHandler.bind(self), false);
          //Get the image file name
          image.name = source;
          //If you just want the file name and the extension, you can
          //get it like this:
          //image.name = source.split("/").pop();
          //Assign the image as a property of the assets object so
          //we can access it like this: `assets["images/imageName.png"]`
          self[image.name] = image;
          //Set the image's src property so we can start loading the image
          image.src = source;
        } 

        //Fonts
        //Load fonts that have file extensions that match the fontExtensions array 
        else if (self.fontExtensions.indexOf(extension) !== -1) {
          //Use the font's file name as the fontFamily name
          var fontFamily = source.split("/").pop().split(".")[0];
          //Append an `@afont-face` style rule to the head of the HTML
          //document. It's kind of a hack, but until HTML5 has a
          //proper font loading API, it will do for now.
          var newStyle = document.createElement('style');
          newStyle.appendChild(document.createTextNode("\
            @font-face {\
              font-family: '" + fontFamily + "';\
              src: url('" + source + "');\
            }\
          "));
          document.head.appendChild(newStyle);
          //Tell the loadHander we're loading a font
          self.loadHandler();
        }
        
        //Sounds
        //Load audio files that have file extensions that match 
        //the audioExtensions array 
        else if (self.audioExtensions.indexOf(extension) !== -1) {
          //Create a sound sprite
          var soundSprite = ga.makeSound(source, self.loadHandler.bind(self));
          //Get the sound file name
          soundSprite.name = source;
          //If you just want to extract the file name with the
          //extension, you can do it like this:
          //soundSprite.name = source.split("/").pop();
          //Assign the sound as a property of the assets object so
          //we can access it like this: `assets["sounds/sound.mp3"]`
          self[soundSprite.name] = soundSprite;
        }
        
        //Display a message if a file type isn't recognized
        else {
          console.log("File type not recognized: " + source);
        }
      });
    },
    
    //The loadHandler will be called each time an asset finishes loading
    loadHandler: function () {
      this.loaded += 1;
      console.log(this.loaded);
      //Check whether everything has loaded
      if (this.toLoad === this.loaded) {
        //If it has, run the callback function that was assigned to the `whenLoaded` property
        console.log("Assets finished loading");
        this.whenLoaded();
      }
    }
  };
 
  function makePointer(){
    var o = {};
    o.x = 0;
    o.y = 0;
    //Add `centerX` and `centerY` getters so that we
    //can use the pointer's coordinates with easing
    //and collision functions.
    Object.defineProperties(o, {
      centerX: {
        get: function() {
          return this.x;
        },
        enumerable: true, configurable: true
      },
      centerY: {
        get: function() {
          return this.y;
        },
        enumerable: true, configurable: true
      }
    });
    //Booleans to track the pointer state
    o.isDown = false;
    o.isUp = true;
    o.tapped = false;
    //Properties to help measure the time between up and down states
    o.downTime = 0;
    o.elapsedTime = 0;
     
    //The pointer's mouse `moveHandler`
    o.moveHandler = function(event) {
      //Get the element that's firing the event
      var element = event.target;
      //Find the pointer’s x and y position (for mouse).
      //Subtract the element's top and left offset from the browser window
      o.x = event.pageX - element.offsetLeft;
      o.y = event.pageY - element.offsetTop;
    };

    //The pointer's `touchmoveHandler`
    o.touchmoveHandler = function(event) { 
      //Find the touch point's x and y position
      o.x = event.targetTouches[0].pageX - ga.canvas.offsetLeft;
      o.y = event.targetTouches[0].pageY - ga.canvas.offsetTop;
      //Prevent the canvas from being selected
      event.preventDefault();
    };

    //The pointer's `downHandler`
    o.downHandler = function(event) {
      //Set the down states
      o.isDown = true;
      o.isUp = false;
      o.tapped = false;
      //Capture the current time
      o.downTime = Date.now();
    };
    
    //The pointer's `touchstartHandler`
    o.touchstartHandler = function(event) {
      //Find the touch point's x and y position
      o.x = event.targetTouches[0].pageX - ga.canvas.offsetLeft;
      o.y = event.targetTouches[0].pageY - ga.canvas.offsetTop;
      //Prevent the canvas from being selected
      event.preventDefault();
      //Set the down states
      o.isDown = true;
      o.isUp = false;
      o.tapped = false;
      //Capture the current time
      o.downTime = Date.now();
    };

    //The pointer's `upHandler`
    o.upHandler = function(event) {
      //Figure out how much time the pointer has been down
      o.elapsedTime = Math.abs(o.downTime - Date.now());
      //If it's less than 200 milliseconds, it must be a tap or click
      if (o.elapsedTime <= 200) {
        o.tapped = true;
      } 
      o.isUp = true;
      o.isDown = false;
    };
    
    //The pointer's `touchendHandler`
    o.touchendHandler = function(event) {
      //Figure out how much time the pointer has been down
      o.elapsedTime = Math.abs(o.downTime - Date.now());
      //If it's less than 200 milliseconds, it must be a tap or click
      if (o.elapsedTime <= 200) {
        o.tapped = true;
      } 
      o.isUp = true;
      o.isDown = false;
    };

    //Bind the events to the handlers
    //Mouse events
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
    //catch a mouse button release outside of the canvas area
    window.addEventListener(
      "mouseup", o.upHandler.bind(o), false
    );
    //Touch events
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
    //catch a mouse button release outside of the canvas area
    window.addEventListener(
      "touchend", o.touchendHandler.bind(o), false
    );
    //Disable the default pan and zoom actions on the ga.canvas
    ga.canvas.style.touchAction = "none";

    //Return the pointer
    return o;
  }
  
  //The `keyboard` function creates `key` objects
  //that listen for keyboard events
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
    };

    //The `upHandler`
    key.upHandler = function(event) {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
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

  /*
  Sound player
  -----------
  */

  //The sound object
  ga.makeSound = function(source, loadHandler) {
    var o = {};
    //Set the default properties
    o.actx = ga.actx;
    o.volumeNode = o.actx.createGain();
    o.panNode = o.actx.createPanner();
    o.panNode.panningModel = "equalpower";
    o.soundNode = undefined;
    o.buffer = undefined;
    o.source = undefined;
    o.loop = false;
    o.isPlaying = false;
    //The function that should run when the sound is loaded
    o.loadHandler = undefined;
    //Values for the pan and volume getters/setters
    o.panValue = 0;
    o.volumeValue = 1;
    //Values to help track and set the start and pause times
    o.startTime = 0;
    o.startOffset = 0;
    //The sound object's methods
    o.play = function() {
      //Set the start time (it will be `0` when the sound
      //first starts
      o.startTime = o.actx.currentTime;
      //Create a sound node 
      o.soundNode = o.actx.createBufferSource();
      //Set the sound node's buffer property to the loaded sound
      o.soundNode.buffer = o.buffer;
      //Connect the sound to the pan, connect the pan to the
      //volume, and connect the volume to the destination
      o.soundNode.connect(o.panNode);
      o.panNode.connect(o.volumeNode);
      o.volumeNode.connect(o.actx.destination);
      //Will the sound loop? This can be `true` or `false`
      o.soundNode.loop = o.loop;
      //Finally, use the `start` method to play the sound.
      //The start time will either be `0`,
      //or a later time if the sound was paused
      o.soundNode.start(
        0, o.startOffset % o.buffer.duration
      );
      //Set `isPlaying` to `true` to help control the 
      //`pause` and `restart` methods
      o.isPlaying = true;
    };
    o.pause = function() {
      //Pause the sound if it's playing, and calculate the
      //`startOffset` to save the current position 
      if (o.isPlaying) {
        o.soundNode.stop(0);
        o.startOffset += o.actx.currentTime - o.startTime;
        o.isPlaying = false;
      }
    };
    o.restart = function() {
      //Stop the sound if it's playing, reset the start and offset times,
      //then call the `play` method again
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
    //Volume and pan getters/setters
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
          //panning we're only interested in the the x coordinate, 
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
    //that was passed as an argument when the sound has loaded
    o.load = function() {
      var xhr = new XMLHttpRequest();
      //Use xhr to load the sound file
      xhr.open("GET", source, true);
      xhr.responseType = "arraybuffer";
      xhr.addEventListener("load", function() {
        //Decode the sound and store a reference to the buffer 
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
          //Throw an error if the sound can't be decoded
          function(error) {
            throw new Error("Audio could not be decoded: " + error);
          }
        );
      });
      //Send the request to load the file
      xhr.send();
    };
    //Load the sound
    o.load();   
    //Return the sound object
    return o;
  };

  //A convenience method that lets you access sounds by their file names
  ga.sound = function(soundFileName){
    return ga.assets[soundFileName];
  };

  /*
  Utilities
  ---------
  */

  //Move a sprite or an array of sprites by adding its
  //veloctiy to its position
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
  distance
  ----------------

  Find the distance in pixels between two sprites.
  Parameters: 
  a. A sprite object with `centerX` and `centerX` properties. 
  b. A sprite object with `centerY` and `centerY` properties. 
  The function returns the number of pixels distance between the sprites.

  */

  ga.distance = function(s1, s2) {
    var vx = s2.centerX - s1.centerX;
    var vy = s2.centerY - s1.centerY;
    return Math.sqrt(vx * vx + vy * vy);
  };

  /*
  ease
  ----------------

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

  //Use `easeProperty` to ease any property on a sprite
  //It returns a value that you can apply to the sprite's property
  ga.easeProperty = function(start, end, speed) {
    //Scale any values less than one (important for tweening alpha)
    var scaleFactor = 1;
    if (start <= 1) scaleFactor = 100; 
    //Calculate the distance
    var distance = end - start;
    //Move the follower if it's more than 1 pixel 
    //away from the leader
    if ((Math.abs(distance) * scaleFactor) >= 1) {
      return distance * speed;
    } else {
      return 0;
    }
  };

  //Use `slide` to ease a sprite to a new position
  ga.slide = function(s, endX, endY, speed) {
    s.x += ga.easeProperty(s.x, endX, speed);
    s.y += ga.easeProperty(s.y, endY, speed);
  };

  //`FadeOut` and `FadeIn`
  ga.fadeOut = function(s, speed) {
    if (s.alpha > 0.02) {
      s.alpha -= speed;
    } else {
      s.alpha = 0;
    }
  };
  ga.fadeIn = function(s, speed) {
    if (s.alpha < 1) {
      s.alpha += speed;
    } else {
      s.alpha = 1;
    }
  };

  /*
  follow
  ----------------

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

  /*
  angle
  -----

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
  random
  ------

  Return a random integer between a minimum and maximum value
  Parameters: 
  a. An integer.
  b. An integer.
  Here's how you can use it to get a random number betwee, 1 and 10:

      random(1, 10);

  */
  ga.random = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
 
  //Wait
  ga.wait = function(duration, callBack) {
    setTimeout(callBack, duration);
  };
  
  
  /*
  Sort functions
  --------------
  */
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
  Collision
  ---------
  */

  ga.contain = function(s, x, y, width, height, bounce, extra){

    //The `collision` object is used to store which 
    //side of the containing rectangle the sprite hits
    var collision;

    //Left
    if (s.x < x) {
      if (bounce) s.vx *= -1;
      s.x = x;
      collision = "left";
    }
    //Top
    if (s.y < y) {
      if (bounce) s.vy *= -1;
      s.y = y;
      collision = "top";
    }
    //Right
    if (s.x + s.width > width) {
      if (bounce) s.vx *= -1;
      s.x = width - s.width;
      collision = "right";
    }
    //Bottom
    if (s.y + s.height > height) {
      if (bounce) s.vy *= -1;
      s.y = height - s.height;
      collision = "bottom";
    }

    //The the `extra` function runs if there was a collision
    //and `extra` has been defined
    if (collision && extra) extra(collision);
    
    //Return the `collision` object   
    return collision;
  }
 
  //Make the `group` and `keyboard` functions public
  ga.keyboard = keyboard;
  ga.group = group;

  //Return `ga`
  return ga;
} 
