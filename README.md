** "Ga!" **
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
Megabyte-ish in size.  The goal for Ga was to design a full-featured 2D game engine with a
compressed file size of no more than 6.5k. 

6.5k?

Yes, it can be done!

Take a look at the `examples` folder to get started. Here's Ga's full
feature list:

- All the most important sprites you need: rectangles, circles, lines,
  text,
  image sprites and animated "MovieClip" sprites. You can make any of these
  sprites with one only line of code.
- A complete scene graph with nested child-parent hierarchies (including
  a `stage`, and `addChild`/`removeChild` methods), local and global coordinates, and depth layers.
- A game loop with a user-definable `fps` and game state manager.
- Tileset (spritesheet) support using `frame` and `filmStrip` methods to make
  sprites using tileset frames.
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
  touch.
- Import and play sounds using a built-in WebAudio API sound manager.
  Control sounds with `play`, `pause`, `stop`, `restart`, and
  `playFrom` methods. Change a sound's `volume` and `pan`.
- Useful tweening functions like `slide`, `fadeIn` and `fadeOut`.
- A handful of useful convenience functions: `ease`, `follow`,
  `angle`, `distance`, `rotateAround`, `wait`, `random` and `contain`. Position
  sprites relative to other sprites using `put`.
- A universal asset loader to pre-load images, fonts and sounds.
- An optional `load` state that lets you run actions while assets are
  loading. You can use the `load` state to add a loading progress bar.
- A fast and focused canvas-based rendering engine.
- Yes, Ga is mobile friendly!
- Yes, Ga is only 6k minified and gzipped!

Coming very soon (this will be in new file called plugins.js):

- A complete 2D geometric collision system.
- Tiled Editor map support (for both flat 2D and isometric maps).
- Many more examples including complete game prototypes.

Ga's philosophy and technical constraints:

- The GA.js core game engine file can't ever be bigger that 6.5k
  minified and gzipped. This makes it suitable for making games for micro game
  competitions, like js13k. But, more importantly, this constraint also avoids feature-creep and keeps
  the engine lean and focused.
- The API has to be fun, intuitive and expressive with as little
  boilerplate code as possible. Game designers should be 
  free to explore their imaginations without tripping over a tangled
  and messy API. Less typing, Less thinking!
- The source code must be easily readable and comment-rich so that
  everyone can learn from it.
- Any special features, like Tiled Editor support, can be added to the
  plugins.js file, so that game developers can pick and choose the
  components they want for specific games without bloating the core engine.

Ga welcomes any contributions to this project!

