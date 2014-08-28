Ga
===

*"Ga!"*
*- A baby's exclamation of surprise.*

Ga is a minimalist game engine for making HTML5 games or any other
kind interactive media. Its design was inspired by the [js13k game
competition](http://js13kgames.com) where contestants are required to make a
game with a total file of size no more than 13k. 

How can you make a game with such a small file size?

It's a useful to use a game engine, because starting any game first
requires writing a lot of tedious boilerplate code. You don't' want to
have to re-write all that stuff for every game you make. But most full-featured HTML5
game engines, even small and fast ones like
[Phaser](https://github.com/photonstorm/phaser), are still at least 1
Megabyte-ish in size. The goal for Ga was to design a full-featured,
fun-to-use 2D game engine with a
compressed file size of no more than 6.5k. 

6.5k?

Yes, it can be done!

Take a look at the feature list and the `examples` folder to get started. 

Features
--------

Here's Ga's full feature list:

- All the most important sprites you need: rectangles, circles, lines,
  text, image sprites and animated "MovieClip" style sprites. You can make any of these
  sprites with one only line of code. You can also create your own custom sprite
  types.
- A complete scene graph with nested child-parent hierarchies (including
  a `stage`, and `addChild`/`removeChild` methods), local and global coordinates, and depth layers.
- `group` sprites together to make game scenes. 
- A game loop with a user-definable `fps` and fully customizable and
  drop-dead-simple game state manager. `pause` and `resume` the game
  loop at any time.
- Tileset (spritesheet) support using `frame` and `filmstrip` methods to make
  sprites using tileset frames.
- Built-in texture atlas support for the popular Texture Packer format.
- A keyframe animation and state manager for sprites. Use `show` to
  display a sprite's image state. Use `play` or `playSequence` to play
  a sequence of frames (in a `loop` if you want to). Use
  `gotoAndStop` to go to a specific frame number. Use `fps` to set the
  frame rate for sprite animations which is independent from the game's
  frame rate.
- Interactive `button` sprites with `up`, `over` and `down` states.
- Any sprite can be set as `interactive` to receive mouse and touch
  actions.
  Intuitive `press` and `release` methods for buttons and interactive
  sprites.
- Easy-to-use keyboard key bindings. The arrow and space keys are
  built-in, and you can easily define your own with the `keyboard`
  method.
- A built-in universal `pointer` that works with both the mouse and
  touch. Define as many pointers as you need for multi-touch.
- Import and play sounds using a built-in WebAudio API sound manager.
  Control sounds with `play`, `pause`, `stop`, `restart`, and
  `playFrom` methods. Change a sound's `volume` and `pan`.
- Conveniently position sprites relative to other sprites using `put`.
- A universal asset loader to pre-load images, fonts, sounds and JSON
  data files. All popular file formats are supported. You can load new assets into the game at
  any time.
- An optional `load` state that lets you run actions while assets are
  loading. You can use the `load` state to add a loading progress bar.
- A fast and focused canvas-based rendering engine.
- A `plugins.js` file full of extra tools. 
- A compact and powerful "Haiku" style API that's centered on shallow,
  composable components. Get more done writing less code.
- Ga is totally hackable. Overwrite any of its default methods or objects
  with your own at compile or run time.
- Yes, Ga is mobile friendly!
- Yes, the core `ga.js` engine is less than 6.5k minified and zipped!
  It's all you need to start making any any 2D action, puzzle or
  strategy game. 

And the coolest part? If you were alone on a desert island with only
a saltwater powered laptop, an unlimited supply of
coconuts, and a copy of `ga.js` you could recreate the entire history of 2D video games,
from SpaceWar! to Flappy Bird.

### The plugins

But there's more! Ga comes with a `plugins.js` file that includes a
huge number of useful tools for making games. You can use as many or
as few of these tools as you want to. Here are some of the goodies
you'll find in `plugins.js`:

- Make versatile particle explosions with `burst`.
- Tween functions for sprite and scene transitions: `slide`,
  `yoyo`, `fadeIn`, `fadeOut` and `pulse`.
- A handful of useful convenience functions: `ease`, `follow`,
  `angle`, `distance`, `rotateAround`, `rotatePoint`, `wait`,
  `random`, `contain` and `outsideBounds`.
- A fast, universal `hit` method that handles collision testing and
  reactions for all types of sprites. Use one collision method for
  everything: rectangles, circles, points, and arrays of sprites.
  Easy!
- A companion suite of lightweight, low-level 2D geometric collision methods.
- A loading progress bar for game assets.
- Make sprites shoot things with `shoot`. 
- Easily plot sprites in a grid formation with `grid`.
- Tiled Editor support using `makeTiledWorld`. Design your game in
  Tiled Editor and access all the sprites, layers and objects directly
  in your game code. It's an extremely fun, quick and easy way to make
  games.
- A versatile, `hitTestTile` method that handles all the collision
  checking you'll need for tile-based games. You can use it in combination
  with the any of the 2D geometric collision methods for optimized
  broadphase/narrowphase collision checking if you want to.
- Create a `worldCamera` that follows sprites around a scrolling game
  world.

To use the plugins, just copy/paste the code you want to use from `plugins.js` into your game. 
Or, if you're not worried about the extra size, 
just link the whole thing; it's really tiny anyway!

If you want to get fancy, you can alternatively create your own `custom.js` file that 
contains a small custom sub-set of the plugins
you want to use for your game. Your `custom.js` file can load at
compile time, so it's ready to use before your game code runs. 
(See the `plugins.js` file for instructions on how to do this).

### Coming very soon... 

- Tiled Editor isometric maps support.
- Many more examples including complete game prototypes.
- Detailed documentation, user guide and tutorials.

Ga's philosophy and technical constraints
-----------------------------------------

- The `ga.js` core game engine file can't ever be bigger that 6.5k
  minified and zipped. This makes it suitable for making games for micro game
  competitions, like [js13k](http://js13kgames.com). But, more
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
- Any special features, like Tiled Editor support, can be added to the
  plugins.js file, so that game developers can pick and choose  a
  minimal custom set of components they want for specific games without bloating the core engine.

Minifying, crushing and compressing
-----------------------------------

The Ga repository doesn't include the minified and compressed version
of the source code, because you should probably optimize that yourself. I recommend
first minifying the code using with [Google Closure
Compiler](http://closure-compiler.appspot.com/home) (Simple mode only) or
[UglifyJS2](https://github.com/mishoo/UglifyJS2). 

Then, zip it.

For more aggressive optimization, you could further try running the
minified code through
[JSCrush](http://www.iteral.com/jscrush/). Although it sometimes makes
things worse rather than better - you'll have to test it with your
code.

Note: If you're using Google Closure Compiler from the command line, set the `--language_in`
flag to `ECMASCRIPT5`, like this:

`java -jar ~/compiler.jar --language_in=ECMASCRIPT5 --js ga.js --js_output_file ga.min.js`


Contributions and Licencing
---------------------------
It's Ga's ambition to be the world's tiniest, cutest and funnest game engine.
Please help! 
Ga welcomes any and all contributions!

Licensing? Ga is vehemently *unlicenesed*.
That means its freer than free.

It's like a pebble.
You can pick it up and throw into the sea.


