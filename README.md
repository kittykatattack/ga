Ga
===

*"Ga!"*
*- A baby's exclamation of surprise.*

*Ga* is a tiny, cute and friendly system for making HTML5 games or any other
kind interactive media. You can use it to make any kind of 2D action
game you can imagine, with unbelievably tiny file sizes.

Take a look at the feature list and the `examples` folder to get
started. Keep scrolling, and you'll find a complete beginner's
tutorial ahead. If you've never made a game before, the tutorials are
the best place to start.

### Table of contents:
1. [Features](#features)
2. [The Plugins](#plugins)
3. [Coming soon...](#comingsoon)
4. [Ga's philosophy and technical constraints](#philosophy)
5. [Minifying, crushing and compressing](#minifying)
6. [Contributions and Licencing](#contibutions)
7. [Tutorials](#tutorials)
  1. [Treasure Hunter](#treasure)
    1. [Setting up the HTML container page](#settingup)
    2. [Initializing the Ga engine](#initializing)
    3. [Define your "global" variables](#defineglobals)
    4. [Initialize your game with a setup function](#setupfunction)
      1. [Customizing the canvas](#customizing)
      2. [Creating the `chimes` sound object](#creatingsound)
      3. [Creating game scenes](#gamescenes)
      4. [Making sprites](#makingsprites)
      5. [Positioning sprites](#positioningsprites)
      6. [Assigning dynamic properties](#dynamicproperties)
      7. [Creating the enemy sprites](#enemysprites)
      8. [The health bar](#healthbar)
      9. [The game over scene](#gameoverscene)
      10. [Keyboard interactivity](#keyboard)
      11. [Setting the game state](#gamestate)
    5. [Game logic with the play function loop](#gamelogic)
      1. [Moving the player sprite](#movingplayer)
      2. [Containing sprites inside the screen boundaries](#boundries)
      3. [Collision with the enemies](#collisionenemy)
        1. [Collision with the treasure](#collisiontreasure)
      4. [Ending the game](#endinggame1)
    6. [Using images](#usingimages)
      1. [Individual images](#individualimages)
        1. [Loading image files](#loadingimagefile)
        2. [Making sprites with images](#makingsprites)
        3. [Fine-tuning the containment area](#finetuning)
    7. [Using a texture atlas](#textureatlas)
      1. [Preparing the images](#preparingimages)
      2. [loading the texture atlas](#loadingatlas)
  2. [Alien Armada](#alienarmada)
    1. [Load and use a custom font](#customfonts)
    2. [Scale and center the game in the browser](#scalebrowser)
    3. [A loading progress bar](#progressbar)
    4. [Shooting bullets](#shootingbullets)
    5. [Sprite states](#spritestates)
    6. [Generating random aliens](#randomaliens)
      1. [Timing the aliens](#timingaliens)
      2. [The aliens' random start positions](#randomposition)
    7. [Moving the aliens](#movingaliens)
    8. [Making the aliens explode](#explodealiens)
    9. [Displaying the score](#displayingscore)
    10. [Ending and resetting the game](#endinggame2)
  3. [Flappy Fairy!](#flappyfairy)
    1. [Launch a game in fullscreen mode](#launchagameinfullscreenmode)
    2. [Make a button](#makeabutton)
    3. [Making the fairy fly](#makingthefairyfly)
    4. [Make a scrolling background](#makeascrollingbackground)
    5. [The fairy dust explosions](#thefairydustexplosions)
    6. [Use a particle emitter](#useaparticleemitter)
    7. [Creating and moving the pillars](#creatingandmovingthepillars)
8. [A Guide to the examples](#aguidetotheexamples)

<a id='features'></a>
Features
--------

Here's Ga's core feature list:

- All the most important sprites you need: rectangles, circles, lines,
  text, image sprites and animated "MovieClip" style sprites. You can make any of these
  sprites with one only line of code. You can also create your own custom sprite
  types.
- A complete scene graph with nested child-parent hierarchies (including
  a `stage`, and `addChild`/`removeChild` methods), local and global
  coordinates, depth layers, and rotation pivots.
- `group` sprites together to make game scenes. 
- A game loop with a user-definable `fps` and fully customizable and
  drop-dead-simple game state manager. `pause` and `resume` the game
  loop at any time.
- Tileset (spritesheet) support using `frame` and `filmstrip` methods to make
  sprites using tileset frames.
- Built-in texture atlas support for the popular Texture Packer
  format. Use a sprite's `setTexture` method if you want to change a sprite's image source while the game is running 
- A keyframe animation and state manager for sprites. Use `show` to
  display a sprite's image state. Use `play` or `playSequence` to play
  a sequence of frames (in a `loop` if you want to). Use
  `show` to display a specific frame number. Use `fps` to set the
  frame rate for sprite animations which is independent from the game's
  frame rate.
- Interactive `button` sprites with `up`, `over` and `down` states.
- Any sprite can be set as `interactive` to receive mouse and touch
  actions.
  Intuitive `press`, `release`, `over`, `out` and `tap` methods for buttons and interactive
  sprites.
- Easy-to-use keyboard key bindings. The arrow and space keys are
  built-in, and you can easily define your own with the `keyboard`
  method.
- A built-in universal `pointer` that works with both the mouse and
  touch. Assign your own custom `press`, `release` and `tap` methods
  or use any of the pointer's built-in properties: `isUp`, `isDown`,
  `tapped`, `x` and `y`. Define as many pointers as you need for multi-touch.
- Conveniently position sprites relative to other sprites using
  `putTop`, `putRight`, `putBottom`, `putLeft` and `putCenter`.
- A universal asset loader to pre-load images, fonts, sounds and JSON
  data files. All popular file formats are supported. You can load new assets into the game at
  any time.
- An optional `load` state that lets you run actions while assets are
  loading. You can use the `load` state to add a loading progress bar.
- A fast and focused canvas-based rendering engine.
- A sophisticated game loop using a fixed timestep with variable rendering
  and sprite interpolation. That means you get butter-smooth sprite animations
  at any framerate.
- A `plugins.js` file full of extra tools. 
- A compact and powerful "Haiku" style API that's centered on shallow,
  composable components. Get more done writing less code.
- Ga is totally hackable. Overwrite any of its default methods or objects
  with your own at compile or run time.
- Yes, Ga is mobile friendly!
- Yes, the core `ga.js` engine is less than 6.5k minified and zipped!
  That makes Ga the world's smallest, most light-weight full featured game engine.
  It's all you need to start making any any 2D action, puzzle or
  strategy game. 

And the coolest part? If you were alone on a desert island with only
a solar powered laptop, an unlimited supply of
coconuts, and a copy of `ga.js` you could recreate the entire history of 2D video games,
from SpaceWar! to Flappy Bird. And all of it would fit on a 3.5 inch
floppy disk.

<a id='plugins'></a>
### The plugins

But there's more! Ga comes with a `plugins.js` file that includes a
huge number of useful tools for making games. You can use as many or
as few of these tools as you want to. Here are some of the goodies
you'll find in `plugins.js`:

- Import and play sounds using a built-in WebAudio API sound manager.
  Control sounds with `play`, `pause`, `stop`, `restart`,
  `playFrom`, `fadeIn` and `fadeOut` methods. Change a sound's `volume` and `pan`.
- Generate your own custom sound effects from pure code with
  the versatile `soundEffect` method.
- Shake sprites or the screen with `shake`.
- Tween functions for sprite and scene transitions: `slide`,
  `fadeIn`, `fadeOut`, `pulse`, `breathe`, `wobble`, `strobe` and
  some useful low-level tweening methods to help you create your own
  custom tweens.
- Make a sprite follow a connected series of waypoints with `walkPath`
  and `walkCurve`. 
- A handful of useful convenience functions: `followEase`,
  `followConstant`,
  `angle`, `distance`, `rotateAroundSprite`, `rotateAroundPoint`, `wait`,
  `randomInt`, `randomFloat`, `contain` and `outsideBounds`.
- A fast, universal `hit` method that handles collision testing and
  reactions (blocking and bounce) for all types of sprites. Use one collision method for
  everything: rectangles, circles, points, and arrays of sprites.
  Easy!
- A companion suite of lightweight, low-level 2D geometric collision methods.
- A loading progress bar for game assets.
- Make sprites shoot things with `shoot`. 
- Easily plot sprites in a grid formation with `grid`.
- Use a `tilingSprite` to easily create a seamless scrolling background.
- Tiled Editor support using `makeTiledWorld`. Design your game in
  Tiled Editor and access all the sprites, layers and objects directly
  in your game code. It's an extremely fun, quick and easy way to make
  games.
- A versatile, `hitTestTile` method that handles all the collision
  checking you'll need for tile-based games. You can use it in combination
  with the any of the 2D geometric collision methods for optimized
  broadphase/narrowphase collision checking if you want to.
- A `particleEffect` function for creating all kinds of particle
  effects for games. Use the `emitter` function to create a constant
  stream of particles.
- Use `updateMap` to keep a tile-based world's map data array up-to-date
  with moving sprites.
- Create a `worldCamera` that follows sprites around a scrolling game
  world.
- Use `scaleToWindow` to make the game automatically scale to its maximum size and align itself for the best fit inside the browser window. Use `enterFullscreen` to make the browser enter full screen mode, and `exitFullscreen` to exit full screen mode.

To use the plugins, just copy/paste the code you want to use from `plugins.js` into your game. 
Or, if you're not worried about the extra size, 
just link the whole thing; it's really tiny anyway!

If you want to get fancy, you can alternatively create your own `custom.js` file that 
contains a small custom sub-set of the plugins
you want to use for your game. Your `custom.js` file can load at
compile time, so it's ready to use before your game code runs. 
(See the `plugins.js` file for instructions on how to do this).

<a id='comingsoon'></a>
### Coming soon... 

- Tiled Editor isometric maps support.
- Many more examples including complete game prototypes.
- Additional documentation, examples, and tutorials.

<a id='philosophy'></a>
Ga's philosophy and technical constraints
-----------------------------------------

- The `ga.js` core game engine file can't ever be bigger that 6.5k
  minified and zipped. Yes, 6.5k! This makes it suitable for making games for micro game
  competitions, like [js13k](http://js13kgames.com). This absurdly
  low overhead means you can drop a full-featured 2D action game into a web page and have it load and play almost
  instantly. But, more
  importantly, this constraint also discourages feature-creep and keeps
  the engine lean and focused. 
- The API has to be fun, intuitive and expressive with as little
  boilerplate code as possible. Game designers should be 
  free to explore their imaginations without tripping over a tangled
  and messy API. Less typing, Less thinking!
- The source code must be easily readable and comment-rich so that
  everyone can learn from it. It should also be architecturally flat
  so that anyone can rip it apart and easily drop it into something
  else.
- For the same reasons, all the source code must be hand-written written from scratch without any 3rd party dependencies (external libraries.)
- Any special features, like Tiled Editor support, can be added to the
  plugins.js file, so that game developers can pick and choose a
  minimal custom set of components they want for specific games without bloating the core engine.

<a id='minifying'></a>
Minifying, crushing and compressing
-----------------------------------

The Ga repository doesn't include the minified and compressed version
of the source code, because you should probably optimize that yourself. I recommend
first minifying the code using with [Google Closure
Compiler](http://closure-compiler.appspot.com/home) (Simple mode only) or
[UglifyJS2](https://github.com/mishoo/UglifyJS2). Google Closure will
give you best minification, and Ga's source code is optimized for it.

Then, zip it. I recommend [gzip](http://www.gzip.org).

For more aggressive optimization, you could further try running the
minified code through
[JSCrush](http://www.iteral.com/jscrush/). Although it sometimes makes
things worse rather than better - you'll have to test it with your
code.

Note: If you're using Google Closure Compiler from the command line, set the `--language_in`
flag to `ECMASCRIPT5`, like this:

`java -jar ~/compiler.jar --language_in=ECMASCRIPT5 --js ga.js --js_output_file ga.min.js`

<a id='contributions'></a>
Contributions and Licencing
---------------------------
It's Ga's ambition to be the world's tiniest, cutest and funnest game engine.
Please help! If you find something that's bad, please help to fix it.
If you find something good, please help to make it better.  Ga
welcomes any and all contributions! 

+1 Bonus Points for removing code and simplifying the architecture. +2 Bonus
Points for making the code easier to understand. The aim of this
project is to discover the smallest universal set of reusable
components required to make
the widest variety of games possible with the least amount of code.
What is the fundamental alphabet, or the primary colours, of game design?
That's what we're searching. Can you help?

**Coding style**: Unconventionally, Ga
uses **functional composition** patterns (the [module
pattern](http://toddmotto.com/mastering-the-module-pattern/) and
[mixins](http://raganwald.com/2014/04/10/mixins-forwarding-delegation.html))
for object creation instead of inheritance. Why? It's really
just an experiment in coding like that. It also means the code
becomes a little more compact.

Licensing? Ga is vehemently *unlicenesed*.
That means its freer than free.

It's like a pebble.
You can pick it up and throw into the sea.

<a id='tutorials'></a>
Tutorials
---------

How do you make a video game? These tutorials will show you how. 

But first, you should have a reasonable understanding of HTML and
JavaScript. You don't have to be an expert, just an ambitious beginner
with an eagerness to learn. If you don't know HTML and JavaScript, the
best place to start learning it is this book:

[Foundation Game Design with HTML5 and JavaScript](http://www.apress.com/9781430247166)

I know for a fact that it's the best book, because I wrote it :)

There are also some good internet resources to help get you started:

[Khan Academy: Computer
Programming](http://www.khanacademy.org/computing/cs)

[Code Academy:
JavaScript](http://www.codecademy.com/tracks/javascript)

Ok, got it?
Do you know what JavaScript variables, functions, arrays and objects are and how to
use them? Good, then read on!

<a id='treasure'></a>
### Treasure Hunter

The first game we're going to make is a simple object collection and
enemy avoidance game called Treasure Hunter. Open the file
`01_treasureHunter.html` in a web browser. (You'll find it in Ga's
`tutorials` folder, and you'll need to run it in a
[webserver](https://github.com/nodeapps/http-server)). If you don't
want to bother setting up a webserver, use a text-editor like
[Brackets](http://brackets.io) that will launch one for you
automatically (see Brackets' documentation for this feature).

[![Treasure Hunter](/tutorials/screenshots/01.png)](https://cdn.rawgit.com/kittykatattack/ga/master/tutorials/01_treasureHunter.html)

(Follow the link in the image above to play the game.) Use the keyboard to move the explorer (the blue square), collect the
treasure (the yellow square), avoid the monsters (the red squares) and
reach the exit (the green square.) Yes, you have to use your
imagination - for now. 

Don't be fooled by it's apparent simplicity. Treasure Hunter contains
everything a video game needs:

- Interactivity
- Collision
- Sprites
- A game loop
- Scenes
- game logic
- "Juice" (in the form of sounds)

(What's juice? [Watch this
video](https://www.youtube.com/watch?v=Fy0aCDmgnxg) and 
[read this article](http://www.gamasutra.com/view/feature/130848/how_to_prototype_a_game_in_under_7_.php?print=1) to learn
about this essential game design ingredient.)

If you can make a simple game like Treasure Hunter, you can make
almost any other kind of game. Yes, really! Getting from Treasure
Hunter to Skyrim or Zelda
is just a matter of lots of small steps; adding more
detail as you go. How much detail you want to add is up to you. 

In the first stage of this tutorial you'll learn how the basic
Treasure Hunter game was made, and then we'll add some fun features like images and
character animation that will give you a complete overview of how the
Ga game engine works. 

If you're an experienced game programmer and
quick self-starter, you might find the code in Ga's `examples` folder to
be a more productive place to start learning - check it out. The fully
commented
code in the `examples` folder also details specific, and advanced uses
of features, that aren't
covered in these tutorials. When you're finished working through these
tutorials, the `examples` will take you on the next stage of your
journey.

<a id='setingup'></a>
#### Setting up the HTML container page

Before you can start programming in JavaScript, you need to set up a
minimal HTML container page. The HTML page loads `ga.js` and
`plugins.js` which are the two files you need to use all of Ga's
features. You'll write all your game code inside the last pair of
`<script>` tags before the closing `<body>` tag.

```
<!doctype html>
<meta charset="utf-8">
<title>Treasure hunter</title>
<body>
<!-- Import the Ga game engine files -->
<script src="../ga.js"></script>
<script src="../plugins.js"></script>
<script>

//All of your game code will go here

</script>
</body>

```
This is the [minimum amount of HTML code you need for a valid HTML5
document](http://stackoverflow.com/questions/9797046/whats-a-valid-html5-document).

<a id='initializing'></a>
#### Initializing the Ga engine

The next step is to write some JavaScript code that initializes and starts the Ga game
engine, according to some parameters that you specify. This bit of
code below initializes a game with a screen size of 512 by 512 pixels.
It also pre-loads the `chimes.wav` sound file from the `sounds`
folder.

```
var g = ga(
  512, 512, setup,
  [
    "sounds/chimes.wav"
  ]
);

//Start the Ga engine.
g.start();

```

You can see that the result of the `ga` function is being assigned to
an variable called `g`. 

    var g = ga(

Now, whenever you want to use any of Ga's custom
methods or objects in your game, just prefix it with `g`. (You don't
have to use `g` to represent the game engine, you can use any variable
name you want. `g` is just nice, short, and easy to remember; `g` =
"game".)

In this example Ga creates a canvas element with a size of 512 by 512
pixels. That's specified by the first two arguments:
  
    512, 512, setup,

The third argument, `setup`, means that as soon as Ga is initialized,
it should look for and run a function in your game code called `setup`.
Whatever code is in the `setup` function is entirely up to you, and
you'll soon see how you can used it to initialize a game. (You don't
have to call this function `setup`, you can use any name you like.) 

Ga lets you pre-load game assets with an optional 4th argument, which
is an array of file names. In this first example, you only need to preload one file: `chimes.wav`
You can see that the full file path to `chimes.wav` is listed as a
string in the
initialization array:

```
[
  "sounds/chimes.wav"
]

```

You can list as many game assets as you like here, including images,
fonts, and JSON files. Ga will load all these assets for you before
running any of the game code.

The last thing you need to do is call Ga's `start` method. 

    g.start();

This is the switch that turns the Ga engine on.

<a id='definingglobals'></a>
#### Define your "global" variables

After Ga has been started, declare all the variables that your game
functions will need to use.

```
var dungeon, player, treasure, enemies, chimes, exit,
    healthBar, message, gameScene, gameOverScene;
```

Because they're not enclosed inside a function, these variables are "global" 
in the sense that you can use them across all of your game functions.
(They're not necessarily "global" in the sense that they inhabit the
global JavaScript name-space. If you want to ensure that they aren't, [wrap all of
your JavaScript code in an enclosing **immediate function** to isolate it
from the global
space](http://stackoverflow.com/questions/17058606/why-using-self-executing-function-in-javascript).

<a id='setupfunction'></a>
#### Initialize your game with a setup function

As soon as Ga starts, it will look for and run a function in your game
code called `setup` (or whatever other name you want to give this
function.) The `setup` function is only run once, and lets you perform
one-time setup tasks for your game. It's a great place to create and initialize
objects, create sprites, game scenes, populate data arrays or parse
loaded JSON game data. 

Here's an abridged, birds-eye view of the `setup` function in Treasure Hunter,
and the tasks that it performs.

```
function setup() {
  //Set the canvas border and background color
  //Create the `chimes` sound object
  //Create the `gameScene` group
  //Create the `exit` door sprite
  //Create the `player` sprite
  //Create the `treasure` sprite
  //Make the enemies
  //Create the health bar
  //Add some text for the game over message
  //Create a `gameOverScene` group 
  //Assign the player's keyboard controllers

  //set the game state to `play`
  g.state = play;
}

```
The last line of code, `g.state = play` is perhaps the most important
because it starts the `play` function. The `play` function runs all the game logic
in a loop. But before we look at how that works, let's see what the
specific code inside the `setup` function does.

<a id='customizing'></a>
##### Customizing the canvas

The first two lines in the `setup` function give the canvas a black dashed border and set its
background color to white.
```
g.canvas.style.border = "1px black dashed";
g.backgroundColor = "white";
```
Here's the effect these two lines have on the Ga canvas:

![Treasure Hunter](/tutorials/screenshots/02.png)

Ga uses an ordinary 2D canvas element to display the game graphics,
and you can access it in your code at any time with `g.canvas`. You
can modify it with any ordinary HTML/CSS properties.

<a id='creatingsound'></a>
##### Creating the `chimes` sound object

You'll remember from the code above that we preloaded a sound file
into the game called `chimes.wav`. Before you can use it in your game,
you have to make a reference to it using Ga's `sound` method,
like this:

    chimes = g.sound("sounds/chimes.wav");

Alternatively, you can access any assets that you've loaded via Ga's
`assets` object, like this:

    g.assets["sounds/chimes.wav"]

Any assets that you've preloaded like this are accessible in the
`assets` object.

Many assets that you might want to use, like sounds, fonts, and JSON
files, can
only be loaded by the browser if your code is running inside a
web server. If you're trying to load or use an asset, and the browser is
giving your a
strange security related error message, check to make sure that the
web server is initialized.

<a id='gamescenes'></a>
##### Creating game scenes

Ga has a useful method called `group` that lets you group game objects
together so that you can work with them as one unit. Groups are used for
grouping together special objects called **sprites**  (which you'll
learn all about in the next section.) But they're also used for making game scenes. 

Treasure Hunter uses two game scenes: `gameScene` which is the main game, 
and `gameOverScene` which is displayed when the game is finished. 
Here's how the `gameScene` is made using the `group` method:

    gameScene = g.group();

After you've made the group, you can add sprites (game objects) to the `gameScene`, using
the `addChild` method.
    
    gameScene.addChild(anySprite);

Or, you can add multiple sprites at one time with the `add` method, like this:

    gameScene.add(spriteOne, spriteTwo, spriteThree);

Or, if you prefer, you can create the game scene after you've made all
the sprites, and group all the sprites together with one line of code, like this:

    gameScene = g.group(spriteOne, spriteTwp, spriteThree);

You'll see a few different examples of how to add sprites to groups in
the examples ahead.

But what are sprites, and how do you make them?

<a id='makingsprites'></a>
##### Making sprites

Sprites are the most important elements in any game. Sprites are
just graphics (shapes or images) that you can control with
special properties. Everything you can see in your games, like
game characters, objects and backgrounds, are sprites. Ga lets you make
5 kinds of basic sprites: `rectangle`, `circle`, `line`, `text`, and
`sprite` (an image-based sprite). You can make almost any 2D action game
with these basic sprite types. (If they aren't enough, you can also define your own custom
sprite types.) This first version of Treasure Hunter
only uses `rectangle` sprites. You can make a rectangle sprite like
this:

    var box = g.rectangle(
      widthInPixels, 
      heightInPixels, 
      "fillColor", 
      "strokeColor", 
      lineWidth, 
      xPosition, 
      yPosition
    );

You can use Ga's `circle` method to make a circular shaped sprite:

    var ball = g.circle(
      diameterInPixels, 
      "fillColor", 
      "strokeColor", 
      lineWidth,
      xPosition, 
      yPosition 
    );

It's often useful to prototype a new game using only `rectangle` and
`circle` sprites, because that can help you focus on the mechanics of your
game in a pure, elemental way. That's what this first version of
Treasure Hunter does. Here's the code from the `setup` function that
creates the `exit`, `player` and `treasure` sprites.

```
//The exit door
exit = g.rectangle(48, 48, "green");
exit.x = 8;
exit.y = 8;
gameScene.addChild(exit);

//The player sprite
player = g.rectangle(32, 32, "blue");
player.x = 68;
player.y = g.canvas.height / 2 - player.halfHeight;
gameScene.addChild(player);

//Create the treasure sprite
treasure = g.rectangle(16, 16, "gold");

//Position the treasure next to the right edge of the canvas
treasure.x = g.canvas.width - treasure.width - 32;
treasure.y = g.canvas.height / 2 - treasure.halfHeight;

//Create a `pickedUp` property on the treasure to help us figure
//out whether or not the treasure has been picked up by the player
treasure.pickedUp = false;

//Add the treasure to the gameScene
gameScene.addChild(treasure);

``` 
Notice that after each sprite is created, it's added to the
`gameScene` using `addChild`. Here's what the above code produces:

![Treasure Hunter](/tutorials/screenshots/03.png)

Let's find out a little more about how these sprites are positioned on
the canvas.

<a id='positioningsprites'></a>
##### Positioning sprites

All sprites have `x` and `y` properties that you can use to precisely
position sprites on the canvas. The `x` and `y` values refer to the sprites' pixel
coordinates relative to the canvas's top left corner. The top
left corner has `x` and `y` values of 0. That means any
positive `x` and `y` values you assign to sprites will position them left (`x`) and down
(`y`) relative to that corner point. For example, Here's the
code that positions the `exit` door (the green square). 
```
exit.x = 8;
exit.y = 8;
```
You can see that this code places the door 8 pixel to the right and 8 pixels below the
canvas's top left corner. Positive `x` values position sprites to the
right of the canvas's left edge. Positive `y` values position them
below the canvas's top edge.

Sprites also have `width` and `height`
properties that tell you their width and height in pixels. If you need
to find out what half the width or half the height of a sprite is, use
`halfWidth` and `halfHeight`.

Ga also has a some convenience methods that help you quickly position
sprites relative to other sprites: `putTop`, `putRight`, `putBottom`, `putLeft` and `putCenter`.
For example, here are the lines from the code above that
position the treasure sprite (the gold box). The code places the
treasure 26 pixels to the left of the
canvas's right edge, and centers it vertically.
```
treasure.x = g.canvas.width - treasure.width - 32;
treasure.y = g.canvas.height / 2 - treasure.halfHeight;
```
That's a lot of complicated positioning code to write. Instead, you
could use Ga's built-in `putCenter` method to achieve the same effect
like this:
```
g.stage.putCenter(treasure, 220, 0);
```
What is the `stage`? It's the root container for all the sprites, and
has exactly the same dimensions as the canvas. You can think of the
`stage` as
a big, invisible sprite, the same size as the canvas, that contains
all the sprites in your game, as well as any containers those sprites
might be grouped in (Like the `gameScene`). `putCenter` works by
centering the `treasure` inside the `stage`, and then offsetting its
`x` position by 220 pixels. Here's the format for using `putCenter`:
```
anySprite.putCenter(anyOtherSprite, xOffset, yOffset);
```
You can use the other `put` methods in the same way. For example, if
you wanted to position a sprite directly to the left of another
sprite, without any offset, you could use `putLeft`, like this:
```
spriteOne.putLeft(spriteTwo);
```
This would place `spriteTwo` directly to the left of `spriteOne`, and
align it vertically .You'll see many examples of how to use these `put` methods throughout
these tutorials.

<a id='dynamicproperties'></a>
##### Assigning dynamic properties

Before we continue, there's one small detail you need to notice. The
code that creates the sprites also adds a `pickedUp` property to the
`treasure` sprite:
```
treasure.pickedUp = false;
```
You'll see how we're going to use `treasure.pickedUp` later in the game logic to help us determine the
progress of the game. You can dynamically assign any custom properties or methods to sprites like this, if you need to.

<a id='enemysprites'></a>
##### Creating the enemy sprites

There are 6 enemies sprites (red squares) in Treasure Hunter. They're
spaced evenly horizontally but but have random initial vertical
positions. All the enemies sprites are created in a `for` loop using
this code in the `setup` function:

```
//Make the enemies
var numberOfEnemies = 6,
    spacing = 48,
    xOffset = 150,
    speed = 2,
    direction = 1;

enemies = [];

//Make as many enemies as there are `numberOfEnemies`
for (var i = 0; i < numberOfEnemies; i++) {

  //Each enemy is a red rectangle
  var enemy = g.rectangle(32, 32, "red");

  //Space each enemey horizontally according to the `spacing` value.
  //`xOffset` determines the point from the left of the screen
  //at which the first enemy should be added.
  var x = spacing * i + xOffset;

  //Give the enemy a random y position
  var y = g.randomInt(0, g.canvas.height - enemy.height);

  //Set the enemy's direction
  enemy.x = x;
  enemy.y = y;

  //Set the enemy's vertical velocity. `direction` will be either `1` or
  //`-1`. `1` means the enemy will move down and `-1` means the enemy will
  //move up. Multiplying `direction` by `speed` determines the enemy's
  //vertical direction
  enemy.vy = speed * direction;

  //Reverse the direction for the next enemy
  direction *= -1;

  //Push the enemy into the `enemies` array
  enemies.push(enemy);

  //Add the enemy to the `gameScene`
  gameScene.addChild(enemy);
}

```
Here's what this code produces:

![Treasure Hunter](/tutorials/screenshots/04.png)

The code gives each of the enemies a random `y` position with the help
of Ga's `randomInt` method:
```
var y = g.randomInt(0, g.canvas.height - enemy.height);
```
`randomInt` will give you a random number between any two integers that you
provide in the arguments. (If you need a random decimal number, use
`randomFloat` instead).

All sprites have properties called `vx` and `vy`. They determine the
speed and direction that the sprite will move in the horizontal
direction (`vx`) and vertical direction (`vy`).  The enemies in
Treasure Hunter only move up and down, so they just need a `vy` value.
Their `vy` is `speed` (2) multiplied by `direction` (which will be
either `1` or `-1`).

    enemy.vy = speed * direction;

If `direction` is `1`, the enemy's `vy` will be `2`. That means the
enemy will move down the screen at a rate of 2 pixels per frame. If
`direction` is `-1`, the enemy's speed will be `-2`. That means the
enemy will move up the screen at 2 pixels per frame. 

After the enemy's `vy` is set, `direction` is reversed so that the next
enemy will move in the opposite direction.

    direction *= -1;

You can see that each enemy that's created is pushed into an array
called `enemies`.

    enemies.push(enemy);

Later in the code you'll see how we'll access all the enemies in this
array to figure out if they're touching the player.

<a id='healthbar'></a>
##### The health bar

You'll notice that when the player
touches one of the enemies, the width of the health bar at the top right corner of
the screen decreases. 

![Treasure Hunter](/tutorials/screenshots/05.png)

How was this health bar made? It's just two rectangle sprites at the same
position: a black rectangle behind, and a green rectangle in front. They're grouped
together to make a single compound sprite called `healthBar`. The
`healthBar` is then added to the `gameScene`.

```
//Create the health bar
var outerBar = g.rectangle(128, 16, "black"),
    innerBar = g.rectangle(128, 16, "yellowGreen");

//Group the inner and outer bars
healthBar = g.group(outerBar, innerBar);

//Set the `innerBar` as a property of the `healthBar`
healthBar.inner = innerBar;

//Position the health bar
healthBar.x = g.canvas.width - 148;
healthBar.y = 16;

//Add the health bar to the `gameScene`
gameScene.addChild(healthBar);
```
You can see that a property called `inner` has been added to the
`healthBar`. It just references the `innerBar` (the green rectangle) so that
it will be convenient to access later.

    healthBar.inner = innerBar;

You don't *have* to do this; but, hey why not! It means that if you
want to control the width of the `innerBar`, you can write some smooth code
that looks like this:

    healthBar.inner.width = 30;

That's pretty neat and readable, so we'll keep it!

<a id='gameoverscene'></a>
##### The game over scene

If the player's health drops to zero, or the player manages to
carry the treasure to the exit, the game ends and the game over screen
is displayed.  The game over scene is just some text that displays "You won!" or "You
lost!" depending on the outcome. 

![Treasure Hunter](/tutorials/screenshots/06.png)

How was this made? The text is made with a `text` sprite. 

```
var anyText = g.text(
  "Hello!", "CSS font properties", "fillColor", xPosition, yPosition
);

```
The first argument, "Hello!" in the above example, is the text content
you want to display. Use the `content` property to change the text
sprite's content later.

    anyText.content = "Some new content";

Here's how the game over message text is created in the `setup`
function. 

```
//Add some text for the game over message
message = g.text("Game Over!", "64px Futura", "black", 20, 20);
message.x = 120;
message.y = g.canvas.height / 2 - 64;
```
Next, a new `group` is created called `gameOverScene`. The `message` text
is added to it. The `gameOverScene`'s `visible` property is set to
`false` so that it's not visible when the game first starts.

```
//Create a `gameOverScene` group and add the message sprite to it
gameOverScene = g.group(message);

//Make the `gameOverScene` invisible for now
gameOverScene.visible = false;

```
At the end of the game we'll set the `gameOverScene`'s `visible`
property to `true` to display the text message. We'll also set the
`gameScene`'s `visible` property to `false` so that all the game
sprites are hidden.

<a id='keyboard'></a>
##### Keyboard interactivity

You control the player (the blue square) with the keyboard arrow keys.
Ga has a built-in `key` object with keyboard bindings 
to the arrow keys and space bar. Access them like this:
`key.leftArray`, `key.rightArrow`, `key.upArrow`, `key.downArrow`,
`key.space`. All these keys have `press` and
`release` methods that you can define. Here's code in the `setup`
function that customizes the `press` and `release` methods of   
Ga's pre-defined arrow keys to control the player character: 
```
//Left arrow key `press` method
g.key.leftArrow.press = function() {
  //Change the player's velocity when the key is pressed
  player.vx = -5;
  player.vy = 0;
};

//Left arrow key `release` method
g.key.leftArrow.release = function() {
  //If the left arrow has been released, and the right arrow isn't down,
  //and the player isn't moving vertically:
  //Stop the player
  if (!g.key.rightArrow.isDown && player.vy === 0) {
    player.vx = 0;
  }
};

g.key.upArrow.press = function() {
  player.vy = -5;
  player.vx = 0;
};

g.key.upArrow.release = function() {
  if (!g.key.downArrow.isDown && player.vx === 0) {
    player.vy = 0;
  }
};

g.key.rightArrow.press = function() {
  player.vx = 5;
  player.vy = 0;
};

g.key.rightArrow.release = function() {
  if (!g.key.leftArrow.isDown && player.vy === 0) {
    player.vx = 0;
  }
};

g.key.downArrow.press = function() {
  player.vy = 5;
  player.vx = 0;
};

g.key.downArrow.release = function() {
  if (!g.key.upArrow.isDown && player.vx === 0) {
    player.vy = 0;
  }
};

```
You can see that the value of the player's `vx` and `vy` properties is
changed depending on which keys are being pressed or released.
A positive `vx` value will make the player move right, a negative
value will make it move left. A positive `vy` value will make the
player move
down, a negative value will make it move up. 

Is that too much typing? Because controlling a player character with 4
keyboard keys is such a common requirement, Ga has a built-in function called
`fourKeyController` that accomplishes all this in one line of code.

    g.fourKeyController(player, 5, 38, 39, 40, 37);

The first argument is the sprite you want to control: `player`. The
second argument is the number of pixels that the sprite should move each frame: `5`.
The last four arguments are the [ascii key code numbers](http://www.asciitable.com) for the top,
right, bottom and left keys. (You can remember this because their
order is listed clockwise, starting from the top.)

Reference to the arrow keys and space key are built-in to Ga, but you
if want to use other keys, you can easily create and assign your own
with Ga's `keyboard` method:

    var customKey = g.keyboard(asciiCode);

Your new `customKey` has `press` and `release` methods
that you can program in the same way as the examples above. 

<a id='gamestate'></a>
##### Setting the game state

The **game state** is the function that Ga is currently running. When
Ga first starts, it runs the `setup` function (or whatever other
function you specify in Ga's constructor function arguments.) If you
want to change the game state, assign a new function to Ga's `state`
property. Here's how:

    g.state = anyFunction;

In Treasure Hunter, when the `setup` function is finished, the game
`state` is set to `play`:

    g.state = play;

This makes Ga look for and run a function called `play`. By default,
any function assigned to the game state will run in a continuous loop, at
60 frames per second. (You can change the frame rate at any time by setting Ga's
`fps` property). Game logic usually runs in a continuous loop, which
is known as the **game loop**. Ga handles the loop management for you,
so you don't need to worry about how it works. (In case you're curious, Ga uses
a `requestAnimationFrame` loop with a [fixed logic time step and variable rendering time](http://gameprogrammingpatterns.com/game-loop.html). It
also does sprite position interpolation to smoothe out any inconsistent
spikes in the frame rate.)

If you ever need to pause the loop, just use Ga's `pause`method, like
this:

    g.pause();

You can start the game loop again with the `resume` method, like this:

    g.resume();

Now let's find out how Treasure Hunter's `play` function works. 

<a id='gamelogic'></a>
#### Game logic with the play function loop

As you've just learned, everything in the `play` function runs in a
continuous loop.

```
function play() {
  //This code loops from top to bottom 60 times per second  
}
```
This is where all the game logic happens. It's the fun part,
so let's find out what the code inside the `play` function does.

<a id='movingplayer'></a>
##### Moving the player sprite

Treasure Hunter uses Ga's `move` method inside the `play` function to move the sprites in the
game.

    g.move(player);

This is the equivalent of writing code like this:

```
player.x += player.vx;
player.y += player.vy;
```
It just updates the player's `x` and `y` position by adding its `vx`
and `vy` velocity values. (Remember, those values were
set by the key `press` and `release` methods.) Using `move` just saves
you from having to type-in and look-at this very standard boilerplate
code.

You can also move a whole array of sprites with one line of code by
supplying the array as the argument.

    g.move(arrayOfSprites);

So now you can easily move the player, but what happens when the
player reaches the edges of the screen?

<a id='boundries'></a>
##### Containing sprites inside the screen boundaries

Use Ga's `contain` method to keep sprites inside the boundaries of
the screen.

    g.contain(player, g.stage.localBounds);

The first argument is the sprite you want to contain, and the second
argument is any JavaScript object with an `x`, `y`, `width`, and
`height` property. As a convenience, all Ga sprites have a property
called `localBounds` that return an object with this information.

As you learnt earlier, `stage` is the root container object for all Ga's sprites, and it has
the same width and height as the `canvas`. That means you can use its
`localBounds` property to keep the sprite contained inside the canvas.

But you can alternatively supply a custom object to do the same thing. Here's how:

```
g.contain(
  player, 
  {
    x: 0,
    y: 0,
    width: 512,
    height: 512
  }
);
```
This will contain the `player` sprite to an area defined by the
dimensions of the object. This is really convenient if you want to
precisely fine-tune the area in which the object should be contained.

`contain` has an extra useful feature. If the sprite reaches one of
the containment edges, `contain` will return a string that tells you
which edge it reached: "top", "right", "bottom", or "left". Here's how
you could use this feature to find out which edge of the canvas the
sprite is touching:

```
var playerHitsEdges = g.contain(player, g.stage.localBounds);

//Display the edge of canvas that the player hit
if (playerHitsEdges) {
  message.content 
    = "The player hit the " + playerHitsEdges + " of the canvas";
}
```
<a id='collisionenemy'></a>
##### Collision with the enemies

When the player hits any of the enemies, the width of the health bar
decreases and the player becomes semi-transparent.

![Treasure Hunter](/tutorials/screenshots/07.png)

How does this work?

Ga has a full suite of useful 2D geometric and tile-based collision
detection methods. You can read all about them in Ga's `examples`
folder. Treasure Hunter only uses one of these collision methods:
`hitTestRectangle`. It takes two rectangular sprites and tells you
whether they're overlapping. It will return `true` if they are, and
`false` if they aren't.

     g.hitTestRectangle(spriteOne, spriteTwo);

Here's how the code in the `play` function uses `hitTestRectangle` to
check for a collision between any of the enemies and the player.
```
//Set `playerHit` to `false` before checking for a collision
var playerHit = false;

//Loop through all the sprites in the `enemies` array
enemies.forEach(function(enemy) {

  //Move the enemy
  g.move(enemy);

  //Check the enemy's screen boundaries
  var enemyHitsEdges = g.contain(enemy, g.stage.localBounds);

  //If the enemy hits the top or bottom of the stage, reverse
  //its direction
  if (enemyHitsEdges === "top" || enemyHitsEdges === "bottom") {
    enemy.vy *= -1;
  }

  //Test for a collision. If any of the enemies are touching
  //the player, set `playerHit` to `true`
  if(g.hitTestRectangle(player, enemy)) {
    playerHit = true;
  }
});

//If the player is hit...
if(playerHit) {

  //Make the player semi-transparent
  player.alpha = 0.5;

  //Reduce the width of the health bar's inner rectangle by 1 pixel
  healthBar.inner.width -= 1;

} else {

  //Make the player fully opaque (non-transparent) if it hasn't been hit
  player.alpha = 1;
}
```
This bit of code creates a variable called `playerHit`, which is
initialized to `false` just before the `forEach` loop checks all the
enemies for a collision.

    var playerHit = false;

(Because the `play` function runs 60 times per second, `playerHit`
will be reinitialized to `false` on every new frame.)

If `hitTestRectangle` returns `true`, the `forEach` loop sets
`playerHit` to `true`.

```
if(g.hitTestRectangle(player, enemy)) {
  playerHit = true;
}
```

If the player has been hit, the code makes the player semi-transparent by
setting its `alpha` value to 0.5. It also reduces the width of the
`healthBar`'s `inner` sprite by 1 pixel.

```
if(playerHit) {

  //Make the player semi-transparent
  player.alpha = 0.5;

  //Reduce the width of the health bar's inner rectangle by 1 pixel
  healthBar.inner.width -= 1;

} else {

  //Make the player fully opaque (non-transparent) if it hasn't been hit
  player.alpha = 1;
}
```
You can set the `alpha` property of sprites to any value between `0`
(fully transparent) to `1` (fully opaque). A value of `0.5` makes it
semi-transparent.b (**Alpha** is a
well-worn graphic design term that just means **transparency**.)

This bit of code also uses the `move` method to move the enemies, and
`contain` to keep them contained inside the canvas. The code also uses
the return value of `contain` to find out if the enemy is hitting the
top or bottom of the canvas. If it hits the top or bottom, the enemy's direction is
reversed with the help of this code:

```
//Check the enemy's screen boundaries
var enemyHitsEdges = g.contain(enemy, g.stage.localBounds);

//If the enemy hits the top or bottom of the stage, reverse
//its direction
if (enemyHitsEdges === "top" || enemyHitsEdges === "bottom") {
  enemy.vy *= -1;
}
```

Multiplying the enemy's `vy` (vertical velocity) value by negative 1
makes it go in the opposite direction. It's a really simple **bounce**
effect.

<a id='collisiontreasure'></a>
###### Collision with the treasure

If the player touches the treasure (the yellow square), the `chimes`
sound plays. The player can then
carry the treasure to the exit. The treasure is centered over the player and
moves along with it. 

![Treasure Hunter](/tutorials/screenshots/08.png)

Here's the code from the `play` function that achieves these effects.

```
//Check for a collision between the player and the treasure
if (g.hitTestRectangle(player, treasure)) {

  //If the treasure is touching the player, center it over the player
  treasure.x = player.x + 8;
  treasure.y = player.y + 8;

  if(!treasure.pickedUp) {

    //If the treasure hasn't already been picked up,
    //play the `chimes` sound
    chimes.play();
    treasure.pickedUp = true;
  };
}
```
You can see that the code uses `hitTestRectangle` inside an `if`
statement to test for a collision between the player and the treasure.

    if (g.hitTestRectangle(player, treasure)) {

If it's `true`, the treasure is centered over the player.

```
treasure.x = player.x + 8;
treasure.y = player.y + 8;
```

If `treasure.pickedUp` is `false`, then you know that the treasure hasn't already been 
picked up, and you can play the `chimes` sound:

    chimes.play();

In addition to `play` Ga's sound objects also have a few more methods that you can use to control them:
`pause`, `restart` and `playFrom`. (Use `playFrom` to start playing
the sound from a specific second in the sound file, like this:
`soundObject.playFrom(5)`. This will make the sound start playing from
the 5 second mark.)

You can also set the sound object's `volume` by assigning
a value between 0 and 1. Here's how to set the `volume` to mid-level
(50%).

    soundObject.volume = 0.5;

You can set the sound object's `pan` by assigning a value between -1 (left speaker)
to 1 (right speaker). A pan value of 0 makes the sound equal volume in
both speakers. Here's how you could set the `pan` to be slightly more
prominent in the left speaker.

    soundObject.pan = -0.2;

If you want to make a sound repeat continuously, set its `loop` property to `true`.

    soundObject.loop = true;

Ga uses a [lightweight wrapper for the WebAudio
API](https://gist.github.com/kittykatattack/cd41b480e94fd32d8ad5) to achieve all these
effects.

Because you don't want to play the `chimes` sound more than once after
the treasure has been picked up, the code sets `treasure.pickedUp` to
`true` just after the sound plays.

    treasure.pickedUp = true;

Now that the player has picked up the treasure, how can you check for
the end of the game?

<a id='endinggame1'></a>
##### Ending the game

There are two ways the game can end. The player's health can run out,
in which case the game is lost. Or, the player can successfully carry
the treasure to the exit, in which case the game is won. If either of
these two conditions are met,  the game's `state` is set to `end` and
the `message` text's `content` displays the outcome. Here's the last
bit of code in the `play` function that does this:
```
//Does the player have enough health? If the width of the `innerBar`
//is less than zero, end the game and display "You lost!"
if (healthBar.inner.width < 0) {
  g.state = end;
  message.content = "You lost!";
}

//If the player has brought the treasure to the exit,
//end the game and display "You won!"
if (g.hitTestRectangle(treasure, exit)) {
  g.state = end;
  message.content = "You won!";
}

```
The `end` function is really simple. It just hides the `gameScene` and
displays the `gameOverScene`.
```
function end() {
  gameScene.visible = false;
  gameOverScene.visible = true;
}

```
And that's it for Treasure Hunter! Before you continue, try making
your own game from scratch using some of these same techniques. When
you're ready, read on!

<a id='usingimages'></a>
### Using images

There are three main ways you can use images in your Ga games. 

- Use individual image files for each sprite.
- Use a **texture atlas**. This is a single image file that includes
  sub-images for each sprite in your game. The image file is
  accompanied by a matching JSON
  data file that describes the name, size and location of each
  sub-image.
- Use a **tileset** (also known as a **spritesheet**). This is also a single
  image file that includes sub-images for each sprite. However, unlike a
  texture atlas, it doesn't come with a JSON file describing the
  sprite data. Instead, you need to specify the size and location of
  each sprite in your game code with JavaScript. This can have some
  advantages over a texture atlas in certain circumstances.

All three ways of making image sprites use Ga's `sprite` method.
Here's the simplest way of using it to make an image sprite.

    var imageSprite = g.sprite("images/theSpriteImage.png");

In
this next section we'll update Treasure Hunter with image sprites, and
you'll learn all three ways of adding images to your games.

(All the images in this section were created by Lanea Zimmerman. You
can find more of her artwork
[here](http://opengameart.org/users/sharm).
Thanks, Lanea!)

<a id='individualimages'></a>
#### Individual images

Open and play the next version of Treasure Hunter:
`02_treasureHunterImages.html` (you'll find it in the `tutorials`
folder.) It plays exactly the same as the first version, but all the
colored squares have been replaced by images.

[![Treasure Hunter](/tutorials/screenshots/09.png)](https://cdn.rawgit.com/kittykatattack/ga/master/tutorials/02_treasureHunterImages.html)

(Click the image and follow the link to play the game.) Take a look at the source code, and you'll notice that the game logic
and structure is exactly the same as the first version of the game.
The only thing that's changed is the appearance of the sprites.
How was this done?

<a id='loadingimagefile'></a>
##### Loading image files 

Each sprite in the game uses an individual PNG image file. You'll find
all the images in the tutorials' `images` sub-folder.

![Treasure Hunter](/tutorials/screenshots/10.png)

Before you can use them to make sprites, you need to pre-load them into
Ga's `assets`. The easiest way to do this is to list the image names,
with their full file paths, in Ga's assets array when you first
initialize the engine.
```
var g = ga(
  512, 512, setup,
  [
    "images/explorer.png",
    "images/dungeon.png",
    "images/blob.png",
    "images/treasure.png",
    "images/door.png",
    "sounds/chimes.wav"
  ]
);
g.start();
```
(If you open up the JavaScript console in the web browser, you can
monitor the loading progress of these assets.)

Now you can access any of these images in your game code like this:

    g.image("images/blob.png")

This is just a short-cut for accessing the image directly in the
`assets` object like this:

    g.assets["images/blob.png"]

You can use whichever style you prefer. In any case, the image file
is just an ordinary JavaScript `Image` object, so you can use
it the same way you would any other `Image` object. 

Although pre-loading the images and other assets is the simplest way
to get them into your game, you can also load assets at any other time
using the `assets` object's `load` method. Just supply an array of strings
that list the asset names and their file paths.
```
g.assets.load([
  "images/imageOne.png", 
  "images/imageTwo.png",
  "sounds/chimes.wav"
]);
```
Next, assign a callback function called `whenLoaded` that will run when the assets have
loaded. 
```
g.assets.whenLoaded = function() {
  //Do something when the assets have loaded
};
```
Now that you've loaded the images into the game, let's find out how to
use them to make sprites.

<a id='makingsprites'></a>
##### Making sprites with images

Create an image sprite using the `sprite` method using the same format you learnt
earlier. Here's how to create a sprite using the `dungeon.png` image.
(`dungeon.png` is a 512 by 512 pixel background image.)

    dungeon = g.sprite("images/dungeon.png");

That's all! Now instead of displaying as a simple colored rectangle,
the sprite will be displayed as a 512 by 512 image. There's no need
to specify the width or height, because Ga figures that our for you
automatically based on the size of the image. You can use all the other
sprite properties, like `x`, `y`, `width`, and `height`, just as you
would with ordinary rectangle sprites. 

Here's the code from the `setup` function that creates the dungeon
background, exit door, player and treasure, and adds them all to the
`gameScene` group. 
```
//The dungeon background
dungeon = g.sprite("images/dungeon.png");

//The exit door
exit = g.sprite("images/door.png");
exit.x = 32;

//The player sprite
player = g.sprite("images/explorer.png");
player.x = 68;
player.y = g.canvas.height / 2 - player.halfWidth;

//Create the treasure
treasure = g.sprite("images/treasure.png");

//Position it next to the left edge of the canvas
treasure.x = g.canvas.width - treasure.width - 32;
treasure.y = g.canvas.height / 2 - treasure.halfHeight;

//Create a `pickedUp` property on the treasure to help us Figure
//out whether or not the treasure has been picked up by the player
treasure.pickedUp = false;

//Create the `gameScene` group and add all the sprites
gameScene = g.group(dungeon, exit, player, treasure);
```
(As a slightly more efficient improvement to the
original version of this code, `group` creates the `gameScene` and groups
the sprites in a single step.)

Look familiar? That's right, the only code that has changed are the
lines that create the sprites. This modularity is a feature of Ga that lets you create quick
game prototypes using simple shapes that you can easily swap out for
detailed images as your game ideas develops. The rest of the code in the
game can remain as-is.

<a id='finetuning'></a>
##### Fine-tuning the containment area

One small improvement that was made to this new version Treasure
Hunter is the new way that the sprites are contained inside the walls of the
dungeon. They're contained in such a way that naturally matches the 2.5D perspective of the
artwork, as shown by the green square in this screen shot:

![Treasure Hunter](/tutorials/screenshots/11.png)

This is a very easy modification to make. All you need to do is supply
the `contain` method with a custom object that defines the size and
position of the containing rectangle. Here's how:
```
g.contain(
  player,
  {
    x: 32, y: 16,
    width: g.canvas.width - 32,
    height: g.canvas.height - 32
  }
);
```
Just tweak the `x`, `y`, `width` and `height` values so that the
containing area looks natural for the game you're making.

<a id='textureatlas'></a>
#### Using a texture atlas

If you’re working on a big, complex game, you’ll want a fast and
efficient way to work with images. A texture atlas can help you do
this. A texture atlas is actually two separate files that are closely
related:

- A single PNG **tileset** image file that contains all the images you
  want to use in your game. (A tileset image is sometimes called a
  spritesheet.)
-	A JSON file that describes the size and position of those sub-images
  in the tileset.

Using a texture atlas is a big time saver. You can arrange the
tileset’s sub-images in any order and the JSON file will keep
track of their sizes and positions for you. This is really convenient
because it means the sizes and positions of the sub-images aren’t
hard-coded into your game program. If you make changes to the tileset,
like adding images, resizing them, or removing them, just re-publish
the JSON file and your game will use that updated data to display the
images correctly. If you’re going to be making anything bigger than a
very small game, you’ll definitely want to use a texture atlas.

The de-facto standard for tileset JSON data is the format that is
output by a popular software tool called [Texture Packer](https://www.codeandweb.com/texturepacker) (Texture
Packer's "Essential" license is free ). Even if you
don’t use Texture Packer, similar tools like [Shoebox](http://renderhjs.net/shoebox/) output JSON files
in the same format. Let’s find out how to use it to make a texture
atlas with Texture Packer, and how to load it into a game.

<a id='preparingimages'></a>
##### Preparing the images

You first need individual PNG images for each image in your game.
You've already got them for Treasure Hunter, so you're all set. Open Texture
Packer and choose the {JS} configuration option. Drag your game images
into its workspace. You can also point Texture Packer to any folder that contains
your images. Texture Packer will automatically arrange the images on a
single tileset image, and give them names that match their original
image file names. It will give them a 2 pixel padding by default.

![Texture Packer](/tutorials/screenshots/12.png)

Each of the sub-images in the atlas is called a **frame**. Although
it's just one big image, the texture atlas has 5 frames. The name of each
frame is the same its original PNG file name: "dungeon.png",
"blob.png", "explorer.png", "treasure.png" and "door.png". These
frames names are used to help the atlas reference each sub-image.

When you’re done, make sure the Data Format is set to JSON (Hash) and
click the Publish button. Choose the file name and location, and save the
published files. You’ll end up with a PNG file and a JSON file. In
this example my file names are `treasureHunter.json` and
`treasureHunter.png`. To make
your life easier, just keep both files in your project’s `images`
folder. (Think of the JSON file as extra metadata for the image file.)

<a id='loadingatlas'></a>
##### loading the texture atlas

To load the texture atlas into your game, just include the JSON file
in Ga's assets array when you initialize the game.

```
var g = ga(
  512, 512, setup,
  [
    "images/treasureHunter.json",
    "sounds/chimes.wav"
  ]
);
g.start();
```
That's all! You don't have to load the PNG file - Ga does that
automatically in the background. The JSON file is all you need to tell
Ga which tileset frame (sub-image) to display.

Now if you want to use a frame from the texture atlas to make a
sprite, you can do it like this:

```
anySprite = g.sprite("frameName.png");
```
Ga will create the sprite and display the correct image from the
texture atlas's tileset.

Here's how to you could create the sprites in Treasure Hunter using
texture atlas frames:
```
//The dungeon background image
dungeon = g.sprite("dungeon.png");

//The exit door
exit = g.sprite("door.png");
exit.x = 32;

//The player sprite
player = g.sprite("explorer.png");
player.x = 68;
player.y = g.canvas.height / 2 - player.halfWidth;

//The treasure
treasure = g.sprite("treasure.png");
```
That's all! Ga knows that those are texture atlas frame names, not individual
images, and it displays them directly from the tileset.

If you ever need to access the texture atlas's JSON file in your game,
you can get it like this:
```
jsonFile = g.json("jsonFileName.json");
```
Take a look at `treasureHunterAtlas.html` file in the `tutorials` folder
to see a working example of how to load a texture atlas and use it to
make sprites.

<a id='alienarmada'></a>
### Alien Armada

The next example game in this series of tutorials is Alien Armada. Can you
destroy 60 aliens before one of them lands and destroys the Earth? Click the
image link below to play the game:

[![Alien Armada](/tutorials/screenshots/13.png)](https://cdn.rawgit.com/kittykatattack/ga/master/tutorials/04_alienArmada.html)

Use the arrow keys to move and press the space bar to shoot. The
aliens descend from the top of the screen with
increasing frequency as the game progresses. Here's how the game is played:

![Alien Armada gameplay](/tutorials/screenshots/14.png)

Alien Armada illustrates some new techniques that you'll definitely want
to use in your games:

- Load and use custom fonts.
- Automatically scale and center the game to the browser window. 
- Display a loading progress bar while the game assets load.
- Shoot bullets.
- Create sprites with multiple image states.
- Generate random enemies.
- Remove sprites from a game.
- Display a game score.
- Reset and restart a game.

You'll find the fully commented Alien Armada source code in the
`tutorials` folder. Make sure to take a look at it so that you can see
all of this code in its proper context. Its general structure is identical
to Treasure Hunter, with the addition of these new techniques. Let's
find out how they were implemented.

<a id='customfonts'></a>
#### Load and use a custom font

Alien Armada uses a custom font called `emulogic.ttf` to display the
score at the top right corner of the screen. The font file is
preloaded with the rest of the asset files (sounds and images) in the assets array that
initializes the game. 
```
var g = ga(
  480, 320, setup,
  [
    "images/alienArmada.json",
    "sounds/explosion.mp3",
    "sounds/music.mp3",
    "sounds/shoot.mp3",
    "fonts/emulogic.ttf"  //<- The custom font.
  ],
  load
);
```
To use the font, create a `text` sprite in the game's `setup`
function. The `text` method's second argument is a
string that describes the font's point size and name: "20px emulogic".  
```
scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);
```
You can and load and use any fonts in TTF, OTF, TTC or WOFF format.

<a id='scalebrowser'></a>
#### Scale and center the game in the browser

You'll notice that when you play Alien Armada, the game is centered
inside the browser window, and automatically fills to the window's maximum
width and height.

![Alien Armada gameplay](/tutorials/screenshots/15.png)

The browser background that borders the game is set to a dark gray
color. This
is thanks to one of Ga's built-in features: the
`scaleToWindow` method. To use it, call `scaleToWindow` just after
you call Ga's `start` method, like this:
```
g.start();
g.scaleToWindow();
```
`scaleToWindow` will center your game for the best fit. Long, wide
game screens are centered vertically. Tall or square screens are
centered horizontally. If you want to specify your own browser
background color that borders the game, supply it in `scaleToWindow`'s
arguments, like this:
```
g.scaleToWindow("seaGreen");
```
For best results, make sure you set the default margins and paddings
on all your HTML elements to `0`. The following bit of CSS does the
trick: 
```
<style> * {margin: 0; padding: 0;} </style>
```
Here's how this `<style>` tag is inserted into Alien Armada's HTML
container page:
```
<!doctype html>
<meta charset="utf-8">
<title>Alien Armada</title>
<style> * {margin: 0; padding: 0;} </style>
```
Optionally, if you want to make sure that your game dynamically
re-sizes and re-centers itself if the user changes the browser window
size, just drop in this bit of code: 
```
window.addEventListener("resize", function(event){ 
  g.scaleToWindow();
});
```
Add it just after you've
called `scaleToWindow` the first time. Here's what all this code looks
like in context:
```
//...Initialize Ga...

g.start();
g.scaleToWindow();
window.addEventListener("resize", function(event){ 
  g.scaleToWindow();
});

//...The rest of your game code...

```
If you want to find out how it works, or you want to customize it further, you'll
find the `scaleToWindow` method in Ga's `plugins.js` file. 

<a id='progressbar'></a>
####A loading progress bar

Alien Armada loads three MP3 sound files: a shooting sound, an
explosion sound, and music. The music sound is about 2 MB in size so
on a slow network connection this sound could take a few seconds to
load. While this is happening players would just see the blank canvas while Alien Armada
loads. Some players might think the game has frozen, so the game
helpfully implements a loading bar to inform
players that the assets are loading. It's a blue rectangle that expands from left to right, and
displays a number that tells you the percentage of game assets
loaded so far.

![Loading progress bar](/tutorials/screenshots/16.png)

This is a feature that's built into the Ga engine. 
Ga has a optional loading state that runs while game assets are being
loaded. You can decide what you want to have happen during the loading
state. All you need to do is write a function with code that should
run while the assets are loading, and tell Ga what the name of that
function is. Ga's engine will automatically run that function in a
loop until the assets have finished loading.

Let's find out how this works in Alien Armada. The game code tells 
Ga to use a function called `load` during the loading state. It does
this by listing `load` as the final argument
in Ga's initialization constructor. (Look for `load` in the code below):
```
var g = ga(
  480, 320, setup,
  [
    "images/alienArmada.json",
    "sounds/explosion.mp3",
    "sounds/music.mp3",
    "sounds/shoot.mp3",
    "fonts/emulogic.ttf"
  ],
  load  //<- This is the function that will run while loading.
);
```
This tells Ga to run the `load` function in a loop while the assets
are loading. 

Here's the `load` function from Alien Armada. It creates a `progressBar` object, and then calls the progress bar's
`update` method each frame. 
```
function load(){

    //Use Ga's built in `progressBar` to display a loading progress
    //percentage bar while the assets are loading.
    g.progressBar.create(g.canvas, g.assets);

    //Call the `progressBar`'s `update` method each frame. 
    g.progressBar.update();
}
```
After the assets have loaded, the `setup` state runs automatically. The first
thing it does is call the `progressBar`'s `remove` method to make the
bar disappear:
```
function setup() {

  g.progressBar.remove();
 
  //... the rest of the setup function...
}
```
You'll find the `progressBar` code in the `plugins.js` file. It's
meant to be a very simple example that you can use as the basis for
writing your own custom loading animation, if you want to. You can run any code you
like in the `load` function, so it's entirely up to you to decide what
should happen or what is displayed while your game is loading.

<a id='shootingbullets'></a>
#### Shooting bullets

How can you make the cannon fire bullets? 

When you press the space bar, the cannon fires bullets at the enemies.
The bullets start from the end of the cannon's turret, and travel up the
canvas at 7 pixels per frame. If they hit an alien, the alien
explodes. If a bullet misses and flies past the top of the stage, the
game code removes it.

![Firing bullets](/tutorials/screenshots/17.png)

To implement a bullet-firing system in your game, the first thing you
need is an array to store the all the bullet sprites.
```
bullets = [];
```
This `bullets` array is initialized in the game's `setup` function.

You can then use Ga's custom `shoot` method to make any sprite fire
bullets in any direction. Here's the general format you can use to
implement the `shoot` method.
```
g.shoot(
  cannon,      //The shooting sprite
  4.71,        //The angle, in radians, at which to shoot (4.71 is up)
  16,          //The bullet's offset from the center of the sprite
  7,           //The bullet's speed (pixels per frame)
  bullets,     //The array used to store the bullets

  //A function that returns the sprite that should
  //be used to make each bullet
  function() {
    return g.sprite("bullet.png");
  }
);

```
The second argument determines the angle, in radians, at which the
bullet should travel. 4.71 radians, used in this example, is up. 0 is
to the right, 1.57 is down, and 3.14 is to the left.

The last argument is a function that returns a sprite that should be
used as the bullet. In this example the bullet is created using using the 
"bullet.png" frame from the game's loaded texture atlas.
```
function() {
  return g.sprite("bullet.png");
}
```
Replace this function with your own to create any kind of custom
bullet you might need.

When will your bullets be fired? You can call the `shoot` method
whenever you want to make bullets, at any point in your code. In Alien
Armada, bullets are fired when the player presses the space key. So
the game implements this by calling `shoot` inside the space key's
`press` method. Here's how:
```
g.key.space.press = function() {

  g.shoot(
    cannon,      //The shooting sprite
    4.71,        //The angle at which to shoot (4.71 is up)
    16,          //The bullet's offset from the center
    7,           //The bullet's speed (pixels per frame)
    bullets,     //The array used to store the bullets

    //A function that returns the sprite that should
    //be used to make each bullet
    function() {
      return g.sprite("bullet.png");
    }
  );

  //Play the shoot sound.
  shootSound.play();
};

```
You can see that the `press` method also makes the `shootSound` play.
(The code above is initialized in the game's `setup` function.)

There's one more thing you need to do: you have to make the bullets move.
You can do this with some code inside the game's looping `play` function. Use Ga's
`move` method and supply the `bullets` array as an argument:
```
g.move(bullets);

```
The `move` method automatically loops through all the sprites in the
array and updates their x and y positions with the value of their `vx` and `vy` velocity values.

So now you know how the bullets are created and animated. But what happens when
they hit one of the aliens?

<a id='spritestates'></a>
#### Sprite states

When a bullet hits an alien, a yellow explosion image appears. This
simple effect is created by giving each alien sprite two states: a `normal`
state and a `destroyed` state. Aliens are created with their states
set to `normal`. If they're hit, their states change to `destroyed`.

![The sprite's states](/tutorials/screenshots/18.png)

How does this system work?

First, let's take a look at the Alien Armada tileset, shown here:

![The Alien Armada tileset](/tutorials/screenshots/19.png)

You can see two image frames that define these two states: `alien.png`
and `explosion.png`. Before you create the sprite, first create an
array that lists these two frames: 
```
var alienFrames = [
  "alien.png", 
  "explosion.png"
];
```
Next use the `alienFrames` array to initialize the `alien` sprite.
```
alien = g.sprite(alienFrames);
```
If you prefer, you could combine these two steps into one, like this:
```
alien = g.sprite([
  "alien.png", 
  "explosion.png"
]);
```
This loads the sprite up with two frames. Frame `0` is the `alien.png`
frame, and frame `1` is the `explosion.png` frame. Frame `0` is
displayed by default by when the sprite is first created. 

You can use the sprite's `show` method to display any other frame number on the
sprite, like this:
```
alien.show(1);
```
The code above will set the alien to frame number one, which is the
`explosion.png` frame.

To make your code a little more readable, its a good idea to define
your sprite's states in a special `states` object. Give each state a
name, with a value that corresponds to that state's frame number.
Here's how you could define two states on the alien: `normal` and
`destroyed`:
```
alien.states = {
  normal: 0,
  destroyed: 1
};
```
`alien.states.normal` now has the value `0`, and
`alien.states.destroyed` now has the value `1`. That means you could
display the alien's `normal` state like this:
```
alien.show(alien.states.normal);
```
And display the alien's `destroyed` state like this:
```
alien.show(alien.states.destroyed);
```
This makes your code a little more readable because you can tell at a
glance which sprite state is being displayed.

(Note: Ga also has a lower-level `gotoAndStop` method that does
exactly the
same thing as `show`. Although you're free use `gotoAndStop` in your
game code, by convention it's only used internally by Ga's rendering
engine.)

<a id='randomaliens'></a>
#### Generating random aliens

Alien Armada generates aliens at any 1 of 14 randomly chosen positions
just above the top boundary of the stage. The aliens first appear
infrequently, but gradually start to
appear at an ever-increasing rate. This makes the game gradually more
difficult as it
progresses. Let's find out how these two features are implemented.

<a id='timingaliens'></a>
##### Timing the aliens

When the game starts, the first new alien is generated after 100
frames have elapsed. A variable called `alienFrequency`, initialized in
the game's `setup` function is used to help track this. it's
initialized to 100.
```
alienFrequency = 100;
```
Another variable called `alienTimer` is used to count the number of
of frames that have elapsed between the previously generated alien,
and the next one. 
```
alienTimer = 0;
```
`alienTimer` is updated by 1 each frame in the `play` function (the game loop).
When `alienTimer` reaches the value of `alienFrequency`, a new alien
sprite is generated. Here's the code from the `play` function that
does this. (This code omits the actual code that generates the alien
sprite - we'll look at that ahead)
```
//Add one to the alienTimer.
alienTimer++;

//Make a new alien if `alienTimer` equals the `alienFrequency`.
if(alienTimer === alienFrequency) {

  //... Create the alien: see ahead for the missing code that does this...

  //Set the `alienTimer` back to zero.
  alienTimer = 0;

  //Reduce `alienFrequency` by one to gradually increase
  //the frequency that aliens are created
  if(alienFrequency > 2){  
    alienFrequency--;
  }
}
```
You can see in the code above that `alienFrequency` is reduced by 1
after the sprite has been created. That will make the next alien appear 1 frame earlier than the
previous alien, and which is why the rate of falling aliens slowly
increases. You can also see that the `alienTimer` is set back to 0 after the sprite
has been created so that it can restart counting towards making
the next new alien. 

<a id='randomposition'></a>
##### The aliens' random start positions

Before we generate any aliens, we need an array to store all the alien
sprites. An empty array called `aliens` is initialized in the `setup`
function for this purpose.
```
aliens = [];
```
Each alien is then created in the `play` function, inside the same
`if` statement we looked at above. This code has a lot of work to do:

- It sets the alien's image frames and states. 
- Its sets the alien's velocity (`vx` and `vy`.) 
- It positions the alien at a random horizontal position above the top stage boundary.
- And, finally, it pushes the alien into the `aliens` array. 

Here's the full code that does all this:
```
//Add one to the alienTimer.
alienTimer++;

//Make a new alien if `alienTimer` equals the `alienFrequency`.
if(alienTimer === alienFrequency) {

  //Create the alien.
  //Assign two frames from the texture atlas as the 
  //alien's two states.
  var alienFrames = [
    "alien.png", 
    "explosion.png"
  ];

  //Initialize the alien sprite with the frames
  var alien = g.sprite(alienFrames);

  //Define some states on the alien that correspond
  //to its two frames.
  alien.states = {
    normal: 0,
    destroyed: 1
  };
  
  //Set its y position above the screen boundary.
  alien.y = 0 - alien.height;
  
  //Assign the alien a random x position.
  alien.x = g.randomInt(0, 14) * alien.width;
  
  //Set its speed.
  alien.vy = 1;
  
  //Push the alien into the `aliens` array.
  aliens.push(alien);

  //Set the `alienTimer` back to zero.
  alienTimer = 0;

  //Reduce `alienFrequency` by one to gradually increase
  //the frequency that aliens are created
  if(alienFrequency > 2){  
    alienFrequency--;
  }
}
```
You can see in the code above that th alien's `y` position places it
out of sight just above the stage's top boundary.
```
alien.y = 0 - alien.height;
```
It's `x` position, however, is random. 
``` 
alien.x = g.randomInt(0, 14) * alien.width;
```
This code places it in one of 15 possible random positions (0 to 14) above the
top of the stage. Here's an illustration of these positions:

![The Alien Armada tileset](/tutorials/screenshots/20.png)

Finally, and very importantly, the code pushes the alien sprite into
the `aliens` array.
```
aliens.push(alien);
```
All this code starts pumping out aliens at a steadily increasing rate.

<a id='movingaliens'></a>
#### Moving the aliens

How do we make the aliens move? In exactly the same way made the
bullets move. You'll notice in the code above that
each alien is initialized with a `vy` (vertical velocity) value of 1.
```
alien.vy = 1;
```
When this value is applied to the alien's `y` position, it will make the alien move down, towards the bottom of the stage,
at the rate of 1 pixel per frame. All the alien sprites in the game are in
the `aliens` array. So to make all of them move you need to loop
through each sprite in the `aliens` array each frame and add their
`vy` values to their `y` positions. Some code like this in the `play`
function would work:
```
aliens.forEach(function(alien){
  alien.y += alien.vy;
});
```
However, its easier just to use Ga's convenient built-in `move` function. Just
supply `move` with the array of sprites that you want to move, like
this:
```
g.move(aliens);
```
This updates the aliens positions with their velocities automatically.

<a id='explodealiens'></a>
#### Making the aliens explode

Now that you know how to change the alien's state, how can you use
this skill to create the explosion effect? Here's the simplified code
from Alien Armada that shows you how to do this. Use `hitTestRectangle` to
check for a collision between an alien and bullet. If a collision is detected,
remove the bullet, show the alien's `destroyed` state, and then remove
the alien after a delay of one second.

```
if (g.hitTestRectangle(alien, bullet)) {

  //Remove the bullet sprite.
  g.remove(bullet);

  //Show the alien's `destroyed` state.
  alien.show(alien.states.destroyed);

  //Wait for 1 second (1000 milliseconds) then 
  //remove the alien sprite.
  g.wait(1000, function(){
    g.remove(alien);
  });
}

```
You can use Ga's universal `remove` function to remove any sprite from a
a game, like this:
```
g.remove(anySprite);
```
You can optionally use it to remove more than one sprite at a time by
listing the sprites to remove in the arguments, like this:
```
g.remove(spriteOne, spriteTwo, spriteThree);
```
You can even use it to remove all the sprites in an array of sprites. Just
supply the sprite array as `remove`'s only argument:
```
g.remove(arrayOfSprites);
```
This will both make the sprites disappear from the screen, and also
empty them out of the array that they were in.

Ga also has a convenient method called `wait` that will run a function
after any delay (in milliseconds) that you specify. The Alien Armada
game code uses `wait` to remove the alien after a one second delay,
like this:
```
g.wait(1000, function(){
  g.remove(alien);
});

```
This allows the alien to display its `explosion` image state for one
second before it disappears from the game.

These are the basic techniques involved in making the aliens explode
and removing the aliens and bullets from the game when they collide.
But the actual code used in Alien Armada is a little more complex. That's
because the code uses nested `filter` loops to loop through all the bullets
and aliens so that they can be checked against each other for
collisions. The code also plays an explosion sound when a collision
occurs, and updates the score by 1. Here's all the code from the
game's `play` function that does this. (If you're new to JavaScript's
`filter` loops, you can [read about how to use them here.](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/filter))

```
//Check for a collision between the aliens and the bullets.
//Filter through each alien in the `aliens` array.
aliens = aliens.filter(function(alien) {

  //A variable to help check if the alien is
  //alive or dead.
  var alienIsAlive = true;

  //Filter though all the bullets.
  bullets = bullets.filter(function(bullet) {

    //Check for a collision between an alien and bullet.
    if (g.hitTestRectangle(alien, bullet)) {

      //Remove the bullet sprite.
      g.remove(bullet);

      //Show the alien's `destroyed` state.
      alien.show(alien.states.destroyed);

      //You could alternatively use the frame number,
      //like this:
      //alien.show(1);

      //Play the explosion sound.
      explosionSound.play();

      //Stop the alien from moving.
      alien.vy = 0;

      //Set `alienAlive` to false so that it can be
      //removed from the array.
      alienIsAlive = false;

      //Wait for 1 second (1000 milliseconds) then 
      //remove the alien sprite.
      g.wait(1000, function(){
        g.remove(alien);
      });

      //Update the score.
      score += 1;

      //Remove the bullet from the `bullets array.
      return false;

    } else {

      //If there's no collision, keep the bullet in the
      //bullets array.
      return true;
    }
  });

  //Return the value of `alienIsAlive` back to the 
  //filter loop. If it's `true`, the alien will be
  //kept in the `aliens` array. 
  //If it's `false` it will be removed from the `aliens` array.
  return alienIsAlive;
});
```
As long as the filter loops return `true`, the current sprite being
checked will remain in the array. If there's a collision, however, the
loops return `false` and the current alien and bullet will be removed
from their arrays. 

And that's how the game's collision works!

<a id='displayingscore'></a>
#### Displaying the score

Another new feature introduced by Alien Armada is a dynamic score
display. Each time an alien is hit, the score at the top right corner
of the game screen increases by one. How does this work?

Alien Armada initializes a `text` sprite called `scoreDisplay` in the
game's `setup` function.
```
scoreDisplay = g.text("0", "20px emulogic", "#00FF00", 400, 10);
```
You saw in the previous section
that 1 is added to the game's `score` variable each time an alien is
hit:
```
score += 1;
```
To visibly update the score, all you need to do is set the `score`
value as the `scoreDisplay`'s `content`, like this:
```
scoreDisplay.content = score;
```
And that's all there is to it!

<a id='endinggame2'></a>
#### Ending and resetting the game

There are two ways the game can end. Either the player shoots down 60
aliens, in which case the player wins. Or, one of the aliens has to travel
beyond the bottom edge of the stage, in which case the aliens win. 

A simple if statement in the `play` function checks for this. If
either condition becomes `true`, the `winner` is set to either
"player" or "aliens" and the game's `state` is changed to `end`.
```
//The player wins if the score matches the value
//of `scoreNeededToWin`, which is 60
if (score === scoreNeededToWin) {

  //Set the player as the winner.
  winner = "player";

  //Change the game's state to `end`.
  g.state = end;
}

//The aliens win if one of them reaches the bottom of
//the stage.
aliens.forEach(function(alien){

  //Check to see if the `alien`'s `y` position is greater
  //than the `stage`'s `height`
  if (alien.y > g.stage.height) { 

    //Set the aliens as the winner.
    winner = "aliens";

    //Change the game's state to `end`.
    g.state = end;
  }
});
```
The `end` function pauses the game, so that the animation freezes. It
then displays the `gameOverMessage`, which will either be "Earth
Saved!" or "Earth Destroyed!", depending on the outcome. As an extra
touch, the music `volume` is also set to 50%. Then after a
delay of 3 seconds, a function named `reset` is called. Here's the
complete `end` function that does all this:

```
function end() {

  //Pause the game loop.
  g.pause();
  
  //Create the game over message text.
  gameOverMessage = g.text("", "20px emulogic", "#00FF00", 90, 120);

  //Reduce the music volume by half.
  //1 is full volume, 0 is no volume, and 0.5 is half volume.
  music.volume = 0.5;

  //Display "Earth Saved!" if the player wins.
  if (winner === "player") {
    gameOverMessage.content = "Earth Saved!";
    gameOverMessage.x = 120;
  }

  //Display "Earth Destroyed!" if the aliens win.
  if (winner === "aliens") {
    gameOverMessage.content = "Earth Destroyed!";  
  }

  //Wait for 3 seconds then run the `reset` function.
  g.wait(3000, function(){
    reset(); 
  });
}
```
The `reset` function resets all of the game variables back to their
starting values. It also turns the music volume back up to 1. It uses
the `remove` function to remove any remaining sprites from the
`aliens` and `bullets` arrays, so that those arrays can be
re-populated when the game starts again. `remove` is also used to
remove the `gameOverMessage`, and the `cannon` sprite is re-centered
at the bottom of the stage. Finally, the game `state` is set back to
`play`, and the game loop is un-paused by calling Ga's `resume`
method.
```
function reset() {

  //Reset the game variables.
  score = 0;
  alienFrequency = 100;
  alienTimer = 0;
  winner = "";

  //Set the music back to full volume.
  music.volume = 1;

  //Remove any remaining alien and bullet sprites.
  //The universal `remove` method will loop through
  //all the sprites in an array of sprites, removed them
  //from their parent container, and splice them out of the array.
  g.remove(aliens);
  g.remove(bullets);

  //You can also use the universal `remove` function to remove.
  //a single sprite.
  g.remove(gameOverMessage);

  //Re-center the cannon.
  g.stage.putBottom(cannon, 0, -40);

  //Change the game state back to `play`.
  g.state = play;
  g.resume();
}
```
And this is all the code needed to start the game again. You can play
Alien Armada as many times as you like and it will reset and restart
itself like this endlessly.

<a id='flappyfairy'></a>
### Flappy Fairy!

Flappy Fairy is a homage to one of the infamous games ever made: [Flappy
Bird](http://en.wikipedia.org/wiki/Flappy_Bird). Click the
image link below to play the game:

[![FlappyFairy](/tutorials/screenshots/21.png)](https://cdn.rawgit.com/kittykatattack/ga/master/tutorials/05_flappyFairy.html)

Click the "Go" button, and game will launch in fullscreen mode. Tap
anywhere on the screen to make the fairy fly, and help her navigate
through the gaps in 15 pillars to reach the finish. A trail of multicolored 
fairy dust follows the fairy as she flies through the maze. 
If she hits one of the green blocks she explodes in a shower of dust. 
But if she manages to navigate through the increasingly narrowing gaps between 
all 15 pillars, she reaches a big floating “Finish” sign. 

![Flappy Fairy gameplay](/tutorials/screenshots/22.png)

If you can make a game like Flappy Fairy, you can make almost any
other kind of 2D action game. In addition to using the all techniques you've
already learnt, Flappy Fairy introduces some exciting new ones:

- Launching a game in fullscreen mode.
- Make a click-able button. 
- Create an animated sprite.
- Use a `tilingSprite` to make a scrolling background.
- Use particle effects.

You'll find the fully commented Flappy Fairy source code in the
`tutorials` folder. Make sure to take a look at it so that you can see
all of this code in its proper context. Its general structure is identical
to the other games in this tutorial, with the addition of these new techniques. Let's
find out how they were implemented.

<a id='launchagameinfullscreenmode'></a>
#### Launch a game in fullscreen mode

When you start Flappy Fairy by clicking the "Go" button,
the game expands to fill your entire screen. This is done with
the help of a built-in method called `enableFullscreen`.
```
g.enableFullsreen(listOfAsciiExitKeyCodes);
```
It's one optional argument is a list of Ascii key codes. They refer to keyboard
keys that could be used to exit fullscreen mode. For example, if you
want fullscreen mode to exit if a user presses upper-case "X" or
lower-case "x", list their Ascii code values in the arguments like
this:
```
g.enableFullscreen(88, 120);
```
(88 is "X" and 120 is "x".) You can list as many key codes as you
like. If you leave these arguments out, the default `esc` key will do the trick.

`enableFullscreen`'s behaviour is very simple: it just launches fullscreen mode
whenever the user releases the pointer (mouse or touch) over the
canvas. Add it just below your game's `start` method, like this:
```
var g = ga(
  910, 512, setupTitleScreen,
  [
    "images/flappyFairy/flappyFairy.json"
  ]
);

g.start();
g.enableFullscreen(88, 120); //<- Add it here
```
It's a quick and easy way to make any games run fullscreen.

(Note: Fullscreen mode is different than `scaleToWindow` because it
completely takes over the user's screen. And I mean completely: the
browser disappears and the only thing on the screen is your game. That's cool, but many users
will find it disorienting and become stressed or panicked if they
can't figure out how to exit your game. So you do decide to run your game in fullscreen
mode, be confident that users will know how to exit it. Or, play it
safe and just use `scaleToWindow`, which still looks great but doesn't
take over the entire browser UI.)

<a id='makeabutton'></a>
#### Make a button

The game starts when you press the "Go" button. The "Go" button is a special sprite
called a `button`. `button` sprites have 3 image frame states: up, over and
down. You can create a `button` with three states like this:
```
goButton = g.button([
  "up.png",
  "over.png",
  "down.png"
]);
```
`up.png` is an image that shows what the button should look like when the it's not
interacting with the pointer. `over.png` shows what the button looks
like when the pointer is over it, and `down.png` is the image that is
displayed when the pointer presses down on the button.

![Button states](/tutorials/screenshots/23.png)

(The `down.png` image is offset slightly down and to the right, so it
looks like its being pressed down.) You can assign any images you like
to these states, and the `button`
will display them automatically based on how the pointer is
interacting with it. 

(Note: If your game is touch-only, you might have only
two button states: up and down. In that case, just assign two image frames,
and Ga will assume they refer to the up and down states.)

Buttons have special methods that you can define: `press`,
`release`,`over`, `out` and `tap`. You can assign any code you like to
these methods. For example, here's how you could change the game's
state when the user releases the `playButton`:
```
goButton.release = function(){
  g.state = setupGame;
};
```
Buttons also have a Boolean (true/false) property called `enabled`
that you
can set to `false` if you want to disable the button. (Set `enabled`
to `true` to re-enable it.) You can also use the button's `state`
property to find out if the button state is currently `"up"`, `"over"`
or `"down"`. (These state values are strings.)

Important! You can give **any** sprite the qualities of button just by
setting its `interactive` property to `true`, like this:
```
anySprite.interactive = true;
```
This will give the sprite `press`, `release`, `over`, `out` and `tap`
methods, and the same `state` property as ordinary buttons. This means
that you can make any sprite click-able, which is really useful for a
wide variety of interactive games.

You can also make the `stage` object interactive, which turns the whole 
game screen into an interactive button:
```
g.stage.interactive = true;
```
For more detail on how to use buttons, see the `buttons.html` file
in the `examples` folder.

<a id='animatingsprites'></a>
#### Animating sprites

A neat feature of Flappy Fairy is that the fairy character flaps her wings
when she's flying up. This animation was created by rapidly displaying 3
simple images in a continuous loop. Each image displays a slightly different
frame of the animation, as shown below:

![Animation frames](/tutorials/screenshots/24.png)

These three images are just three ordinary frames in the game's texture atlas, called
`0.png`, `1.png` and `2.png`.
But how can you turn a sequence of frames like this into a sprite
animation?

First, create an array that defines the frames of the animation, like
this:
```
var fairyFrames = [
  "0.png", 
  "1.png", 
  "2.png"
];
```
Then create a sprite using those frames, like this:
```
var fairy = g.sprite(fairyFrames);
```
Or, if you prefer, you can combine this into one step:
```
var fairy = g.sprite([
  "0.png", 
  "1.png", 
  "2.png"
]);

```
Any sprite with more than one image frame automatically becomes an
animated sprite. If you want the animation frames to start playing,
just call the sprite's `play` method:
```
fairy.play();
```
The frames will automatically play in a continuous loop. If you don't want them
to loop, set `loop` to `false`.
```
fairy.loop = false;
```
Use the `stop` method to stop an animation:
```
fairy.stop();
```
If you want to know whether or not a sprite's animation is currently
playing, use the Boolean (true/false) `playing` property to find out.

How quickly or slowly do you want the animation to play? You can set
the animation's frames-per-second (`fps`) like this:
```
fairy.fps = 24;
```
A sprite animation's frame rate is independent of the game's frame
rate. That gives you a lot of flexibility to fine-tune sprite
animations.

What if you don't want to use all the sprite's image frames in the
animation, only some of them? You can use the `playSequence` method.
For example, imagine that you have a sprite with 30 frames, but you
only want to play frames 10 to 15 as part of the animation. Use the
`playSequence` method and supply it with an array containing two
numbers: the first and last frames of the sequence you want to play.
```
animatedSprite.playSequence([10, 15]);
```
Now only the frames between 10 to 15 will play as part of the animation. To make
this more readable, you can define the sequence as an array that
describes what those animated frames actually do. For example, perhaps
they define a character's walk cycle. You could create an array called
`walkCycle` that defines those frames:
```
var walkCycle = [10, 15];
```
Then use that array with `playSequence`, like this:
```
animatedSprite.playSequence(walkCycle);
```
That's a bit more code to write, but much more readable!

For more details on Ga's sprite animation system and what you can do
with it, see the `keyframeAnimation.html`,
`textureAtlasAnimation.html` and  `animationStates.html` file in the `examples` folder.

<a id='makingthefairyfly'></a>
#### Making the fairy fly

Now that you know how to animate a sprite, how is Flappy Fairy's
flying animation triggered when you tap on the game screen?

A value of `0.05`, which represents gravity, is subtracted from the
fairy's `y` position each frame in the `play` function. This is the
gravity effect that pulls the fairy to the bottom of the screen. 
```
fairy.vy += -0.05;
fairy.y -= fairy.vy;
```
But when you tap the screen, the fairy flies up. This is thanks to
Ga's built-in `pointer` object. It has a `tap` method which you can define to
perform any action you like. In Flappy Fairy, the `tap` method increases the fairy's vertical
velocity, `vy`, by 1.5 pixels each time you tap.
```
g.pointer.tap = function() {
  fairy.vy += 1.5;
};  
```
Ga's built-in `pointer` object also has `press` and `release` methods
that you can define in the same way. It also has Boolean (true/false)
`isUp`, `isDown` and `tapped` properties that you can use to find the
pointer's state, if you need to.

But you'll notice that the fairy only flaps her wings when she's
starting to fly up, and stops flapping when she looses momentum and
starts going down. To make this work, you need to know whether the fairy is
currently on the way up, or on the way down, based on a change in the
fairy's vertical velocity (vy) value. The game implements a well-worn
old trick to help figure this out. The `play` function captures the
fairy's velocity for this current frame in a new value called `oldVy`. But
it does this *only after the fairy's position has changed*. 
```
function play(){

  //...
  //... all of the code that moves the fairy comes first...
  //...

  //Then, after the fairy's position has been changed, capture
  //her velocity for this current frame
  fairy.oldVy = fairy.vy;
}
```
This means that when the next game frame swings around, `oldVy` will still be storing the
fairy's velocity value from the *previous frame*. And that means you
can use that value to figure out the change in the fairy's velocity from the
previous frame to the current frame. If she's starting to go up (if `vy` is
greater than `oldVy`), play the fairy's animation: 
```
if (fairy.vy > fairy.oldVy) {
  if(!fairy.playing) {
    fairy.play();
  }
}
```
If she's starting to go down, stop the animation and just show the
fairy's first frame.
```
if (fairy.vy < 0 && fairy.oldVy > 0) {
  if (fairy.playing) fairy.stop();
  fairy.show(0);
}
```
And that's how the fairy flies!

<a id='makeascrollingbackground'></a>
#### Make a scrolling background

A fun new feature of Flappy Fairy is that it has an infinitely scrolling
background of clouds moving from right to left.

![Scrolling background](/tutorials/screenshots/25.png)

The background moves at a slower rate than the green pillars, and that
creates the illusion that the clouds are further away. (This is a
shallow, pseudo 3D effect called **paralax scrolling**.) 

The background is just a single image.

![Scrolling background](/tutorials/screenshots/26.png)

The image has been designed so that the clouds **tile seamlessly**:
the clouds on the top and left match up with the clouds on the right
and bottom. That means you can connect multiple instances of the same
image and they will appear to create a single, unbroken continuous
image. ([Image from OpenGameArt.](opengameart.org/content/cartoony-sky)) 

Because this is really useful for games, Ga has a sprite type
called a `tilingSprite` that's designed just for such infinite
scrolling effects. Here's how to create a `tilingSprite`: 
```
sky = g.tilingSprite(
  g.canvas.width,        //The width
  g.canvas.height,       //The height
  "sky.png"              //The image to use
);
```
The first two arguments are the sprite's width and height, and the
last is the image your want to use. 

Tiling sprites have the 
same properties as normal sprites, with the addition of two new
properties:
`tileX` and `tileY`. Those two properties let you set the image offset from the
sprite's top left corner. If you want to make a tiling sprite scroll
continuously, just increase its `tileX` value by some small amount
each frame in the game loop, like this:
```
sky.tileX -= 1;
```
And that's all you need to do to make an infinitely scrolling
background.

<a id='particleeffects'></a>
####Particle effects

How do you create effects like fire, smoke, magic, and explosions? 
You make lots of tiny sprites; dozens, hundreds or thousands of them. 
Then apply some physical or gravitational constraints to those sprites 
so that they behave like the element you’re trying to simulate. You 
also need to give them some rules about how they should appear and 
disappear, and what kinds of patterns they should form. These tiny 
sprites are called particles. You can use them to make a wide range 
of special effects for games.

Ga has a versatile built-in method called `particleEffect` that can
create most kinds of particle effects you'll need for games. Here's
the format for using it:
```
particleEffect(
  pointer.x,                                     //The particle’s starting x position
  pointer.y,                                     //The particle’s starting y position
  function(){return sprite("images/star.png")},  //Particle function
  20,                                            //Number of particles
  0.1,                                           //Gravity
  true,                                          //Random spacing
  0, 6.28,                                       //Min/max angle
  12, 24,                                        //Min/max size
  1, 2,                                          //Min/max speed
  0.005, 0.01,                                   //Min/max scale speed
  0.005, 0.01,                                   //Min/max alpha speed
  0.05, 0.1                                      //Min/max rotation speed
);
```
You can see that most of the arguments describe a range between the 
minimum and maximum values that should be used to change the sprites’ 
speed, rotation, scale, or alpha. You can also assign the number of 
particles that should be created, and add optional gravity. 
You can make particles using any sprites by customizing the third argument.
Just supply a function that returns the kind of sprite you want to use
for each particle:
```
function(){return sprite("images/star.png")},
```
If you supply a sprite that has multiple frames, the `particleEffect` 
function will automatically choose a random frame for each particle.
The minimum and maximum angle values are important for defining the 
circular spread of particles as they radiate out from the origin point. 
For a completely circular explosion effect, use a minimum angle of 0 and 
a maximum angle of 6.28.
```
0, 6.28,
```
(These values are radians; the equivalent in degrees is 0 and 360.) 
0 starts at the 3 o’clock position, pointing directly to the right. 3.14 
is the 9 o’clock position, and 6.28 takes you around back to 0 again.
If you want to constrain the particle range to a narrower angle, just 
supply the minimum and maximum values that describe that range. Here are 
values you could use to constrain the angle to a pizza-slice with the 
crust pointing left.
```
2.4, 3.6,
```
You could use a constrained angle range like this to create a particle
stream, like those used to create a fountain or rocket engine flames. 
(You’ll see exactly how to do this ahead.) The random spacing value 
(the sixth argument) determines whether the particles should be spaced 
evenly (`false`) or randomly (`true`) within this range.
By carefully choosing the sprite for the particle and finely adjusting 
each parameter, you can use this all-purpose `particleEffect` method 
to simulate everything from liquid to fire. In Flappy Fairy, it's used
to create fairy dust.

<a id='thefairydustexplosions'></a>
#####The fairy dust explosions

When Flappy Fairy hits a block, she disappears in a puff of dust. 

![Fairy dust explosion](/tutorials/screenshots/27.png)

How does that effect work?

Before we can create the explosion effect, we have to define an array
that lists the images we want to use for each particle.
As you learned above, the `particleEffect` method will randomly 
display a frame on a sprite, if that sprite contains multiple frames. 
To make this work, first define an array of texture atlas frames that 
you want to use for the fairy's dust explosion:
```
dustFrames = [
  "pink.png",
  "yellow.png",
  "green.png",
  "violet.png"
];
```
The explosion happens when the fairy hits one of the green blocks.
The game loop does this with the help of the `hitTestRectangle` 
method. The code loops through the `blocks.children` array and tests for 
a collision between each green block and the fairy. If `hitTestRectangle` 
returns `true`, the loop quits and a collision object called
`fairyVsBlock` becomes `true`.
```
var fairyVsBlock = blocks.children.some(function(block){
  return g.hitTestRectangle(fairy, block, true);  
});
```
`hitTestRectangle`’s third argument needs to be `true` so that the collision 
detection is done using the sprite’s global coordinates (`gx` and `gy`). 
That’s because the fairy is a child of the `stage`, but each block is a child 
of the `blocks` group. That means they don’t share the same local coordinate space. 
Using the blocks sprites' global coordinates forces `hitTestRectangle`
to use their positions relative to the canvas. 

If `fairyVsBlock` is `true`, and the fairy is currently visible, the 
collision code runs. It makes the fairy invisible, creates the particle 
explosion, and calls the game’s `reset` function after a delay of 3 seconds.
```
if (fairyVsBlock && fairy.visible) {

  //Make the fairy invisible
  fairy.visible = false;

  //Create a fairy dust explosion
  g.particleEffect(
    fairy.centerX, fairy.centerY, //x and y position
    function() {                  //Particle sprite
      return g.sprite(dustFrames);
    },     
    20,                           //Number of particles
    0,                            //Gravity
    false,                        //Random spacing
    0, 6.28,                      //Min/max angle
    16, 32,                       //Min/max size
    1, 3                          //Min/max speed
  );
  
  //Stop the dust emitter that's trailing the fairy.
  //(More about this ahead!)
  dust.stop();

  //Wait 3 seconds and then reset the game
  g.wait(3000, reset);
}
```

<a id='useaparticleemitter'></a>
#####Use a particle emitter

A particle emitter is just a simple timer that creates particles at 
fixed intervals. That means instead of just calling the 
`particleEffect` function once, the emitter calls it periodically.
Ga has a built-in `emitter` method that let's you do this easily.
Here’s how to use it:
```
var particleStream = g.emitter(
  100,                                     //The interval
  function() {return g.particleEffect(     //The `particleEffect` function
    //Assign particle parameters...
  )
);
```
The `emitter` method just wraps around the `particleEffect` method. 
Its first argument is a number, in milliseconds, that determines how 
frequently the particles should be created. The second argument is 
the `particleEffect` method, which you can customize however you like. 
The `emitter` method returns an object with `play` and `stop` methods 
that you can use to control the particle stream. You can use them 
just like the `play` and `stop` methods you use to control a sprite’s 
animation.
```
particleStream.play();
particleStream.stop();
```
The emitter object also has a `playing` property that will be either 
`true` or `false` depending on the emitter’s current state. (See the
`particleEmitter.html` file in the `examples` folder for more details
on how to create and use a particle emitter.)

A particle emitter is used in Flappy Fairy to make the fairy emit a 
stream of multicolored particles while she’s flapping her wings. The 
particles are constrained to an angle between 2.4 and 3.6 radians, so 
they’re emitted in a cone-shaped wedge to the left of the fairy. 

![Emitting fairy dust](/tutorials/screenshots/28.png)

The particle stream randomly emits pink, yellow, green, or violet 
particles, each of which is a separate frame on the texture atlas.

Here's the code that creates this effect: 
```
dust = g.emitter(
  300,                                   //The interval
  function() {
    return g.particleEffect(             //The function
      fairy.x + 8,                       //x position
      fairy.y + fairy.halfHeight + 8,    //y position
      function() {                       //Particle sprite
        return g.sprite(dustFrames)
      },          
      3,                                 //Number of particles
      0,                                 //Gravity
      true,                              //Random spacing
      2.4, 3.6,                          //Min/max angle
      12, 18,                            //Min/max size
      1, 2,                              //Min/max speed
      0.005, 0.01,                       //Min/max scale speed
      0.005, 0.01,                       //Min/max alpha speed
      0.05, 0.1                          //Min/max rotation speed
    );
  }
);
```
You can now control the `dust` emitter with `play` and `stop` methods.

<a id='creatingandmovingthepillars'></a>
####Creating and moving the pillars

You now know how Flappy Fairy implements some of Ga's special features
for some fun and useful effects. But, if you're new to game
programming, you might also be wondering how the world that Flappy Fairy flies
through was created. Let's take a quick look at the code that creates
and moves the green pillars that the fairy has to navigate to reach
the Finish sign.

There are fifteen green pillars in the game. Every five pillars, the 
gap between the top and bottom sections becomes narrower. The first five 
pillars have a gap of four blocks, the next five have a gap of three blocks 
and the last five have a gap of two blocks. This makes the game increasingly 
difficult as Flappy Fairy flies further. The exact position of the gap is 
random for each pillar, and different every time game is played. Each pillar 
is spaced by 384 pixels, and here's how they would look like if 
they were right next to each other.

![The green pillars](/tutorials/screenshots/29.png)

You can see how the gap gradually narrows from four spaces on the left 
down to two on the right. 

All the blocks that make up the pillars are in a `group` called
`blocks`.
```
blocks = g.group();
```
A nested for loop creates each block and adds it to the blocks container. 
The outer loop runs 15 times; once to create each pillar. The inner loop 
runs eight times; once for each block in the pillar. The blocks are only 
added if they’re not occupying the range that’s been randomly chosen for 
the gap. Every fifth time the outer loop runs, the size of the gap narrows by one.
```
//What should the initial size of the gap be between the pillars?
var gapSize = 4;

//How many pillars?
var numberOfPillars = 15;

//Loop 15 times to make 15 pillars
for (var i = 0; i < numberOfPillars; i++) {

  //Randomly place the gap somewhere inside the pillar
  var startGapNumber = g.randomInt(0, 8 - gapSize); 

  //Reduce the `gapSize` by one after every fifth pillar. This is
  //what makes gaps gradually become narrower
  if (i > 0 && i % 5 === 0) gapSize -= 1; 

  //Create a block if it's not within the range of numbers
  //occupied by the gap
  for (var j = 0; j < 8; j++) {
    if (j < startGapNumber || j > startGapNumber + gapSize - 1) {
      var block = g.sprite("greenBlock.png");
      blocks.addChild(block);

      //Space each pillar 384 pixels apart. The first pillar will be
      //placed at an x position of 512
      block.x = (i * 384) + 512;
      block.y = j * 64;
    }
  }

  //After the pillars have been created, add the finish image
  //right at the end
  if (i === numberOfPillars - 1) {
    finish = g.sprite("finish.png");
    blocks.addChild(finish);
    finish.x = (i * 384) + 896;
    finish.y = 192;
  }
}
```
The last part of the code adds the big `finish` sprite to the world, which 
Flappy Fairy will see if she manages to make it through to the end.

The game loop moves the group of blocks by 2 pixels to the right each 
frame, but only while the finish sprite is off-screen:
```
if (finish.gx > 256) {
  blocks.x -= 2;
}
```
When the `finish` sprite scrolls into the center of the canvas, the 
`blocks` container will stop moving. Notice that the code uses the 
`finish` sprite’s global x position (`gx`) to test whether it’s inside 
the area of the canvas. Because global coordinates are relative to 
the canvas, not the parent container, they’re really useful for 
just these kinds of situations where you want to want to find a 
nested sprite’s position on the canvas.

Make sure you check out the complete Flappy Fairy source code in the
`examples` folder so that you can see all this code in its proper context.

<a id='aguidetotheexamples'></a>
#Coming soon: A guide to the examples


























