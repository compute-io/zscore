/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Deep close to:
	deepCloseTo = require( './utils/deepcloseto.js' ),

	// Module to be tested:
	zScore = require( './../lib/accessor.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'accessor zscore', function tests() {

	it( 'should export a function', function test() {
		expect( zScore ).to.be.a( 'function' );
	});

	it( 'should standardize elements using an accessor', function test() {
		var data, actual, expected;

		data = [
			{'x': 0 },
			{'x': 5 },
			{'x': 10 },
		];
		actual = new Array( data.length );

		actual = zScore( actual, data, getValue );
		expected = {
			'zscores': [ -1, 0, 1 ],
			'mu': 5,
			'sigma': 5
		};

		assert.isTrue( deepCloseTo( actual, expected, 1e-7 ) );

		function getValue( d ) {
			return d.x;
		}
	});

	it( 'should return an empty array if provided an empty array', function test() {
		assert.deepEqual( zScore( [], [], getValue ), { 'zscores': [], 'mu': null, 'sigma': null } );
		function getValue( d ) {
			return d.x;
		}
	});

	it( 'should handle non-numeric values by setting the element to NaN', function test() {
		var data, actual, expected;

		data = [
			{'x':true},
			{'x':null},
			{'x':[]},
			{'x':{}}
		];
		actual = new Array( data.length );
		actual = zScore( actual, data, getValue );

		expected = {
			'zscores': [ NaN, NaN, NaN, NaN ],
			'mu': NaN,
			'sigma': NaN
		};

		assert.deepEqual( actual, expected );

		function getValue( d ) {
			return d.x;
		}
	});

});
