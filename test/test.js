/* global require, describe, it */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Deep close to:
	deepCloseTo = require( './utils/deepcloseto.js' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Validate a value is NaN:
	isnan = require( 'validate.io-nan' ),

	// Module to be tested:
	zScore = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'compute-zscore', function tests() {

	it( 'should export a function', function test() {
		expect( zScore ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided an invalid option', function test() {
		var values = [
			'5',
			5,
			true,
			undefined,
			null,
			NaN,
			[],
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function() {
				zScore( [1,2,3], {
					'accessor': value
				});
			};
		}
	});

	it( 'should throw an error if provided a dim option which is an integer not equal to 1 or 2', function test() {
		var values = [
			3,
			4,
			5
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( RangeError );
		}
		function badValue( value ) {
			return function() {
				zScore( [1,2,3], {
					'dim': value
				});
			};
		}
	});

	it( 'should throw an error if provided an array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				zScore( [1,2,3], {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a typed-array and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				zScore( new Int8Array([1,2,3]), {
					'dtype': value
				});
			};
		}
	});

	it( 'should throw an error if provided a matrix and an unrecognized/unsupported data type option', function test() {
		var values = [
			'beep',
			'boop'
		];

		for ( var i = 0; i < values.length; i++ ) {
			expect( badValue( values[i] ) ).to.throw( Error );
		}
		function badValue( value ) {
			return function() {
				zScore( matrix( [2,2] ), {
					'dtype': value
				});
			};
		}
	});

	it( 'should return NaN if the first argument is neither a number, array-like, or matrix-like', function test() {
		var values = [
			// '5', // valid as is array-like (length)
			true,
			undefined,
			null,
			// NaN, // allowed
			function(){},
			{}
		];

		for ( var i = 0; i < values.length; i++ ) {
			assert.isTrue( isnan( zScore( values[ i ] ) ) );
		}
	});

	it( 'should compute z-Scores when provided a plain array', function test() {
		var data, actual, expected;

		data = [
			0, 5, 10
		];
		expected = {
			'zscores': [ -1, 0, 1 ],
			'mu': 5,
			'sigma': 5
		};

		actual = zScore( data );

		console.log( actual )
		assert.notEqual( actual.zscores, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-7 ) );

		// Mutate...
		actual = zScore( data, {
			'copy': false
		});
		assert.strictEqual( actual.zscores, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-7 ) );
	});

	it( 'should standardize elements when provided a typed array', function test() {
		var data, actual, expected;

		data = new Float64Array( [
			10, 20, 30, 40, 40, 50, 60, 70
		] );
		expected = {
			'zscores': new Float32Array( [ -1.5, -1, -0.5, 0, 0, 0.5, 1, 1.5 ] ),
			'mu': 40,
			'sigma': 20
		};

		actual = zScore( data );
		assert.notEqual( actual.zscores, data );
		assert.deepEqual( actual, expected, 1e-7 );

		// Mutate:
		actual = zScore( data, {
			'copy': false
		});
		expected = {
			'zscores': new Float32Array( [ -1.5, -1, -0.5, 0, 0, 0.5, 1, 1.5 ] ),
			'mu': 40,
			'sigma': 20
		};
		assert.strictEqual( actual.zscores, data );
		assert.deepEqual( actual, expected, 1e-7 );
	});

	it( 'should standardize elements and cast array to a specific type', function test() {
		var data, actual, expected;

		data = 	[
			10, 20, 30, 40, 40, 50, 60, 70
		];
		expected = {
			'zscores': new Float64Array( [ -1.5, -1, -0.5, 0, 0, 0.5, 1, 1.5 ] ),
			'mu': 40,
			'sigma': 20
		};

		actual = zScore( data, {
			'dtype': 'float64'
		});
		assert.notEqual( actual.zscores, data );
		assert.strictEqual( actual.zscores.BYTES_PER_ELEMENT, 8 );
		assert.deepEqual( actual, expected, 1e-7 );
	});

	it( 'should standardize elements using an accessor', function test() {
		var data, actual, expected;

		data = [
			[0,10],
			[1,20],
			[2,30],
			[3,40],
			[4,40],
			[5,50],
			[6,60],
			[7,70]
		];
		expected = {
			'zscores': [ -1.5, -1, -0.5, 0, 0, 0.5, 1, 1.5 ],
			'mu': 40,
			'sigma': 20
		};

		actual = zScore( data, {
			'accessor': getValue
		});
		assert.notEqual( actual.zscores, data );
		assert.isTrue( deepCloseTo( actual, expected, 1e-7 ) );

		// Mutate:
		actual = zScore( data, {
			'accessor': getValue,
			'copy': false
		});
		assert.strictEqual( actual.zscores, data );
		assert.isTrue( deepCloseTo( data, expected.zscores, 1e-7 ) );

		function getValue( d ) {
			return d[ 1 ];
		}
	});

	it( 'should standardize elements and deep set', function test() {
		var data, actual, expected;

		data = [
			{'x':[0,10]},
			{'x':[1,20]},
			{'x':[2,30]},
			{'x':[3,40]},
			{'x':[4,40]},
			{'x':[5,50]},
			{'x':[6,60]},
			{'x':[7,70]}
		];

		expected = {
			'zscores': [
				{'x':[0,-1.5]},
				{'x':[1,-1.0]},
				{'x':[2,-0.5]},
				{'x':[3,0]},
				{'x':[4,0]},
				{'x':[5,0.5]},
				{'x':[6,1.0]},
				{'x':[7,1.5]}
			],
			'mu': 40,
			'sigma': 20
		};

		actual = zScore( data, {
			'path': 'x.1'
		});

		assert.strictEqual( actual.zscores, data );
		assert.deepEqual( actual, expected );

		// Specify a path with a custom separator...
		data = [
			{'x':[0,10]},
			{'x':[1,20]},
			{'x':[2,30]},
			{'x':[3,40]},
			{'x':[4,40]},
			{'x':[5,50]},
			{'x':[6,60]},
			{'x':[7,70]}
		];

		actual = zScore( data, {
			'path': 'x/1',
			'sep': '/'
		});
		assert.strictEqual( actual.zscores, data );
		assert.deepEqual( actual, expected );
	});

	it( 'should standardize elements when provided a matrix (row- and column-wise)', function test() {
		var mat,
			out,
			d1,
			d2,
			d3,
			i;

		d1 = new Float64Array( 9 );
		d2 = new Float64Array( [-1,-1,-1,0,0,0,1,1,1] );
		d3 = new Float64Array( [-1,0,1,-1,0,1,-1,0,1] );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i;
		}
		mat = matrix( d1, [3,3], 'float64' );
		out = zScore( mat, {
			'dim': 1
		});

		assert.deepEqual( out.zscores.data, d2 );

		// Mutate...
		out = zScore( mat, {
			'dim': 2,
			'copy': false
		});
		assert.strictEqual( mat, out.zscores );
		assert.deepEqual( mat.data, d3 );
	});

	it( 'should standardize elements and return a matrix of a specific type', function test() {
		var mat,
			out,
			d1,
			d2,
			d3,
			i;

		d1 = new Float64Array( 9 );
		d2 = new Int32Array( [-1,-1,-1,0,0,0,1,1,1] );
		d3 = new Int32Array( [-1,0,1,-1,0,1,-1,0,1] );
		for ( i = 0; i < d1.length; i++ ) {
			d1[ i ] = i;
		}
		mat = matrix( d1, [3,3], 'float64' );
		out = zScore( mat, {
			'dtype': 'int32',
			'dim': 1
		});

		assert.strictEqual( out.zscores.dtype, 'int32' );
		assert.deepEqual( out.zscores.data, d2 );

		mat = matrix( d1, [3,3], 'float64' );
		out = zScore( mat, {
			'dtype': 'int32',
			'dim': 2
		});

		assert.strictEqual( out.zscores.dtype, 'int32' );
		assert.deepEqual( out.zscores.data, d3 );
	});

	it( 'should return an empty data structure if provided an empty data structure', function test() {
		assert.deepEqual( zScore( [] ), { 'zscores': [], 'mu': null, 'sigma': null } );
		assert.deepEqual( zScore( matrix( [0,0] ) ).zscores.data, new Float64Array() );
		assert.deepEqual( zScore( new Int8Array() ), { 'zscores': new Float64Array(), 'mu': null, 'sigma': null } );
	});

});
