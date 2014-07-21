/*
Ga plugins
==========
Weclome to the `plugins.js` file!
This file contains lots of extra tools that are really useful for making games, but which are more specialized that than the universal tools in `GA.js` file. You can either link this entire file with a `<script>` tag or, to keep you game file size small, just copy and past the code that you need into your game. The code in this file is organized into chapters. Use your text editor's search features to find what you're looking for.

Chapter 1: Utilities
---------------------

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

Chapter 2: Sprite creation tools
---------------------------------

`shoot`: A function for making sprites shoot bulllets.
`grid`: Easily plot a grid of sprites. Returns a container full of sprite `children` 

Chapter 3: Collision
---------------------

### Boundary collisions

`outsideBounds`: Tells you if a sprite has exceeded the boundary of another sprite or container.
`contain`: Contains a sprite inside another sprite. Optional bounce if the sprite hits the edges.

### Shape collisions

`hitTestPoint`: Returns `true` or `false` if an x/y point is instersecting a rectangle or circle.
`hitTestCircle`: Returns `true` if any two circular sprites overlap.
`hitTestRectangle`: Returns `true` if any two rectangular sprites overlap
`circleCollision`: Makes a moving circle bounce away from a stationaly circle

### 2D geometric collisions

### 2D tile-based collisions



*/
/*
Chapter 1: Utilities
--------------------
*/

//### move
//Move a sprite or an array of sprites by adding its
//veloctiy to its position

function move(sprites) {
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

function distance (s1, s2) {
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
function ease(follower, leader, speed) {
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

//### easeProperty
//Use `easeProperty` to ease any property on a sprite
//It returns a value that you can apply to the sprite's property

function easeProperty(start, end, speed) {
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

//### slide
//Use `slide` to ease a sprite to a new position
function slide(s, endX, endY, speed) {
  s.x += easeProperty(s.x, endX, speed);
  s.y += easeProperty(s.y, endY, speed);
};

//### fadeOut

function fadeOut(s, speed) {
  if (s.alpha > 0.02) {
    s.alpha -= speed;
  } else {
    s.alpha = 0;
  }
};

//### fadeIn

function fadeIn(s, speed) {
  if (s.alpha < 1) {
    s.alpha += speed;
  } else {
    s.alpha = 1;
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

function follow(follower, leader, speed) {
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

function rotateAround(rotatingSprite, centerSprite, distance, angle) {
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

function rotatePoint(pointX, pointY, distance, angle) {
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

function angle(s1, s2) {
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
Here's how you can use it to get a random number betwee, 1 and 10:

    random(1, 10);

*/
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

//### wait
function wait(duration, callBack) {
  setTimeout(callBack, duration);
};
  

/*
Chapter 2: Sprite creation tools
--------------------------------
*/

//### shoot

function shoot(
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
}


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

          //A an optional final function that runs some extra code
          function() {console.log("extra!");}
        );
*/

function grid( 
    gaInstance, columns, rows, cellWidth, cellHeight, 
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

  //Get a reference to the current instance of Ga
  var ga = gaInstance;

  //Create an empty DisplayObjectContainer
  var container = ga.group();
  //The `create` method
  container.createGrid = function() {
    var length = columns * rows;
    for(var i = 0; i < length; i++) {
      var x = ((i % columns) * cellWidth),
          y = (Math.floor(i / columns) * cellWidth);

      //Use the `makeSprite` method supplied in the constructor
      //to make the a sprite for the grid cell
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
}

/*
Chapter 3: Collision
--------------------
*/

/*
### Boundary collisions
*/

//#### outsideBounds
function outsideBounds(s, bounds, extra){

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

  //The the `extra` function runs if there was a collision
  //and `extra` has been defined
  if (collision && extra) extra(collision);
  
  //Return the `collision` object   
  return collision;
}

//#### contain
function contain(s, bounds, bounce, extra){

  var x = bounds.x,
      y = bounds.y,
      width = bounds.width,
      height = bounds.height;

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

  //The the `extra` function runs if there was a collision
  //and `extra` has been defined
  if (collision && extra) extra(collision);
  
  //Return the `collision` object   
  return collision;
}

/*
### Shape collisions
/


/*
#### hitTestPoint

Use it to find out if a point is touching a circlular or rectangular sprite.
Parameters: 
a. An object with `x` and `y` properties.
b. A sprite object with `x`, `y`, `centerX` and `centerY` properties.
If the sprite has a `radius` property, the function will interpret
the shape as a circle.
*/

function hitTestPoint(point, sprite) {

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
    //Get the postion of the sprite's edges
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
}

/*
#### hitTestCircle

Use it to find out if two circular sprites are touching.
Parameters: 
a. A sprite object with `centerX`, `centerY` and `radius` properties.
b. A sprite object with `centerX`, `centerY` and `radius`.
*/

function hitTestCircle(c1, c2) {
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
}

/*
#### hitTestRectangle

Use it to find out if two rectangular sprites are touching.
Parameters: 
a. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.
b. A sprite object with `centerX`, `centerY`, `halfWidth` and `halfHeight` properties.

*/

export function hitTestRectangle(r1, r2) {
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
}

/*
#### circleCollision

Use this fucntion to prevent a moving circular sprite from overlapping and optionally
bouncing off a non-moving circular sprite.
Parameters: 
a. A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.
b. A sprite object with `x`, `y` `centerX`, `centerY` and `radius` properties.
c. Optional: `true` or `false` to indicate whether or not the first sprite
d. Optional: `true` or `false` to indicate whether or not local or global sprite positions should be used. 
This defauts to `true` so set it to `false` if you want to use the sprite's local coordinates.
should bounce off the second sprite.
The sprites can contain an optional mass property that should be greater than 1.

*/

export function circleCollision(c1, c2, bounce, global) {
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
    //between the the circles to reduce their surface tension and make
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
