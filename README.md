# quadtree.js

[![Build Status](https://travis-ci.org/joekallen/quadtree.js.svg?branch=master)](https://travis-ci.org/joekallen/quadtree.js)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/xemus.svg)](https://saucelabs.com/u/xemus)


A [quadtree](https://en.wikipedia.org/wiki/Quadtree) recursively partitions two-dimensional space into squares, dividing each square into four equally-sized squares. Each distinct object exists in a unique leaf [node](#nodes). A Quadtree can accelerate spatial operations such as collision detection and searching for nearby points.

> This library is intended for fast detection of potential collisions using bounding boxes, a more exact check should be run on the potential candidates returned.

### There are still some improvments to be made to the library.
* Element removal needs implemented.
* Element updates, such as position or size need to be reflected in the tree.
* Test coverage needs improved

## Installing

If you use NPM, `npm install quadtree.js`. Otherwise, download the [latest release](https://github.com/joekallen/quadtree.js/releases/latest).


## Usage
First step is to initialize a new Quadtree object with the dimensions your objects will be inserted into.
```js
const MAX_ITEMS = 10;
const quadtree = new Quadtree({
    x: 0,
    y: 0,
    width:500,
    height:500
});
```

The first object is the bounds of the plane objects will be inserted into.

MAX_ITEMS is an optional limit for the maximum number of elements that be in a leaf before it is split up into a new quad.


## Adding elements
Elements can be any type, event null.  If your element contains the fields to indicate the elements bounds, then it can be used for both parameters.

Bounds is the only required parameter.
```js
quadtree.insert({
    x: 0,
    y: 0,
    width: 10,
    height: 5
}, yourElement);
```

## Removing elements
Currently removal is unsupported.

## Retrieving potentially colliding elements
This method is useful if you need to determine collision of two elements using the bounding box of both.
The result is an array of every element that collides with the bounding box parameter;
```js
var colliding = quadtree.queryWithBoundingBox({
    x: 5,
    y: 5,
    width: 10,
    height: 10
});
```

The second way to find colliding items is with a point parameter.
The result is an array of every element that collides with the point parameter.
```js
var colliding = quadtree.queryWithPoint({
    x: 15,
    y: 5
});
```
