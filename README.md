zScore
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Standardize elements by calculating their z-Scores.


## Installation

``` bash
$ npm install compute-zscore
```

For use in the browser, use [browserify](https://github.com/substack/node-browserify).


## Usage

``` javascript
var zScore = require( 'compute-zscore' );
```

#### zScore( x[, opts] )

Computes the z-scores for elements in `x`. `x` may be either a an [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays), or a [`matrix`](https://github.com/dstructs/matrix).
If `x` is a [`matrix`](https://github.com/dstructs/matrix), then by default z-scores are calculated such that rows of `x` are centered to mean zero and scaled to a standard deviation of one. When `x` is an [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), the z-scores are calculated such that they have a mean of zero and a standard deviation of one.
The function returns an array with three elements: The [`array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array) of z-scores, the mean and the standard deviation of the input array.

``` javascript
var matrix = require( 'dstructs-matrix' ),
	data,
	mat,
	out,
	i;

out = zScore( [0, 5, 10] );
// returns { zscores: [ -1, 0, 1 ], mu: 5, sigma: 5 }

data = new Int8Array( [0, 5, 10] );
out = zScore( data );
// returns { zscores: Float64Array([0,5,10]), mu: 5, sigma: 5 }

data = new Int16Array( 9 );
for ( i = 0; i < 9; i++ ) {
	data[ i ] = i;
}
mat = matrix( data, [3,3], 'int16' );
/*
	[ 0 1 2
	  3 4 5
	  6 7 8 ]
*/

out = zScore( mat );
/*
	{
		zscores:
		[ -1 0 1
		  -1 0 1
		  -1 0 1 ]
		mu: Float64Array([1,4,7]),
		sigma: Float64Array([1,1,1])
	}
*/
```

The function accepts the following `options`:

* 	__accessor__: accessor `function` for accessing `array` values.
*	__dim__: dimension along which to standardize. Default: `2` (along the columns).
* 	__dtype__: output [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or [`matrix`](https://github.com/dstructs/matrix) data type. Default: `float64`.
*	__copy__: `boolean` indicating if the `function` should return a new data structure. Default: `true`.
*	__path__: [deepget](https://github.com/kgryte/utils-deep-get)/[deepset](https://github.com/kgryte/utils-deep-set) key path.
*	__sep__: [deepget](https://github.com/kgryte/utils-deep-get)/[deepset](https://github.com/kgryte/utils-deep-set) key path separator. Default: `'.'`.

By default, the function standardizes the elements such that row means becomes zero and row variances become one (`dim=2`).

``` javascript
var matrix = require( 'dstructs-matrix' ),
	data,
	mat,
	out,
	i;

data = new Int8Array( 9 );
for ( i = 0; i < data.length; i++ ) {
	data[ i ] = i;
}
mat = matrix( data, [3,3], 'int8' );
/*
	[ 0 1 2
	  3 4 5
	  6 7 8 ]
*/

out = zScore( mat );
/*
	{
		zscores:
		[ -1 0 1
		  -1 0 1
		  -1 0 1 ]
		mu: Float64Array([1,4,7]),
		sigma: Float64Array([1,1,1])
	}
*/
```

To standardize along the rows, set the `dim` option to `1`.

``` javascript
out = zScore( mat, {
	'dim': 1
});
/*
	{
		zscores:
		[ -1 -1 -1
		   0  0  0
		   1  1  1 ]
		mu: Float64Array([3,4,5]),
		sigma: Float64Array([3,3,3])
	}
*/
```

For non-numeric `arrays`, provide an accessor `function` for accessing `array` values.

``` javascript
var data = [
	[0,10],
	[1,20],
	[2,30],
	[3,40],
	[4,40],
	[5,50],
	[6,60],
	[7,70]
];

function getValue( d, i ) {
	return d[ 1 ];
}

var out = zScore( data, {
	'accessor': getValue
});
/*  
	{
		zscores: [ -1.5, -1, -0.5, 0, 0, 0.5, 1, 1.5 ],
		mu: 40,
		sigma: 20
	}
*/
```

To [deepset](https://github.com/kgryte/utils-deep-set) an object `array`, provide a key path and, optionally, a key path separator.

``` javascript
var data = [
	{'x':[0,10]},
	{'x':[1,20]},
	{'x':[2,30]},
	{'x':[3,40]},
	{'x':[4,40]},
	{'x':[5,50]},
	{'x':[6,60]},
	{'x':[7,70]}
];


var out = zScore( data, {
	'path': 'x|1',
	'sep': '|'
});
/*  
{
	zscores:
		[
			{'x':[0,-1.5]},
			{'x':[1,-1.0]},
			{'x':[2,-0.5]},
			{'x':[3,0]},
			{'x':[4,0]},
			{'x':[5,0.5]},
			{'x':[6,1.0]},
			{'x':[7,1.5]}
		],
	mu: 40,
	sigma: 20
}
*/

var bool = ( data === out.zscores );
// returns true

```

By default, when provided a [`typed array`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Typed_arrays) or [`matrix`](https://github.com/dstructs/matrix), the  data structure of the `zscores` is `float64` in order to preserve precision. To specify a different data type, set the `dtype` option (see [`matrix`](https://github.com/dstructs/matrix) for a list of acceptable data types).

``` javascript
var data, out;

data = new Int8Array( [3,7,11] );

out = zScore( data, {
	'dtype': 'int32'
});
/*
{
	zscores: Int32Array { '0': -1, '1': 0, '2': 1 },
	mu: 7,
	sigma: 4
}
*/

// Works for plain arrays, as well...
out = zScore( [ 3, 7, 11 ], {
	'dtype': 'uint8'
});
/*
{
	zscores: Uint8Array { '0': 255, '1': 0, '2': 1 },
	mu: 7,
	sigma: 4
}
*/
```

By default, the function returns a new data structure of `zscores`. To mutate the input data structure (e.g., when input values can be discarded or when optimizing memory usage), set the `copy` option to `false`.

``` javascript
var data,
	bool,
	mat,
	out,
	i;

data = [ 3, 7, 9 ];

out = zScore( data, {
	'copy': false
});
/*
{
	zscores: [~-1.091,~0.218,~0.873],
	mu: ~6.333,
	sigma: ~3.055
}
*/

bool = ( data === out.zscores );
// returns true

data = new Float64Array( 9 );
for ( i = 0; i < 9; i++ ) {
	data[ i ] = i;
}
mat = matrix( data, [3,3], 'float64' );
/*
	[ 0 1 2
	  3 4 5
	  6 7 8 ]
*/

out = zScore( mat, {
	'copy': false
});
/*
	{
		zscores:
		[ -1 0 1
		  -1 0 1
		  -1 0 1 ]
		mu: Float64Array([1,4,7]),
		sigma: Float64Array([1,1,1])
	}
*/
bool = ( mat === out.zscores );
// returns true

```

## Examples

``` javascript
var zScore = require( 'compute-zscore' ),
	matrix = require( 'dstructs-matrix' ),
	randNorm = require( 'distributions-normal-random' ),
	data,
	out,
	mat,
	i;

data = randNorm( [25], {
	'mu': 8,
	'sigma': 3
});


// Plain arrays...
out = zScore( data );

// Object arrays (accessors)...
function getValue( d ) {
	return d.x;
}
for ( i = 0; i < data.length; i++ ) {
	data[ i ] = {
		'x': data[ i ]
	};
}
out = zScore( data, {
	'accessor': getValue
});

// Deep set arrays...
for ( i = 0; i < data.length; i++ ) {
	data[ i ] = {
		'x': [ i, data[ i ].x ]
	};
}
out = zScore( data, {
	'path': 'x/1',
	'sep': '/'
});

// Typed arrays...
data = randNorm( [25], {
	'mu': 8,
	'sigma': 3,
	'dtype': 'int32'
});
out = zScore( data );

// Matrices...
mat = matrix( data, [5,5], 'int32' );
out = zScore( mat );

// Matrices (custom output data type)...
out = zScore( mat, {
	'dtype': 'uint8'
});
```

To run the example code from the top-level application directory,

``` bash
$ node ./examples/index.js
```



## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2014-2015. The [Compute.io](https://github.com/compute-io) Authors.


[npm-image]: http://img.shields.io/npm/v/compute-zscore.svg
[npm-url]: https://npmjs.org/package/compute-zscore

[travis-image]: http://img.shields.io/travis/compute-io/zscore/master.svg
[travis-url]: https://travis-ci.org/compute-io/zscore

[codecov-image]: https://img.shields.io/codecov/c/github/compute-io/zscore/master.svg
[codecov-url]: https://codecov.io/github/compute-io/zscore?branch=master

[dependencies-image]: http://img.shields.io/david/compute-io/zscore.svg
[dependencies-url]: https://david-dm.org/compute-io/zscore

[dev-dependencies-image]: http://img.shields.io/david/dev/compute-io/zscore.svg
[dev-dependencies-url]: https://david-dm.org/dev/compute-io/zscore

[github-issues-image]: http://img.shields.io/github/issues/compute-io/zscore.svg
[github-issues-url]: https://github.com/compute-io/zscore/issues
