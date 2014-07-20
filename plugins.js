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

Chapter 3: Collision
---------------------

### Boundary collisions
`outsideBounds`: Tells you if a sprite has exceeded the boundary of another sprite or container.

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

  //Create a `bullets` array on the shooter if it doesn't already
  if (!shooter.bullets) shooter.bullets = [];

  //Push the bullet into the 
  bulletArray.push(bullet);
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
