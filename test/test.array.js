/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Deep close to:
	deepCloseTo = require( './utils/deepcloseto.js' ),

	// Module to be tested:
	zscore = require( './../lib/array.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'array zscore', function tests() {

	it( 'should export a function', function test() {
		expect( zscore ).to.be.a( 'function' );
	});

	it( 'should standardize elements', function test() {
		var data, actual, expected;

		data = [
			20,
			30,
			40
		];
		actual = new Array( data.length );

		actual = zscore( actual, data );
		expected = {
			'zscores': [ -1, 0, 1 ],
			'mu': 30,
			'sigma': 10
		};

		assert.isTrue( deepCloseTo( actual, expected, 1e-7 ) );
	});

	it( 'should return an empty array if provided an empty array', function test() {
		assert.deepEqual( zscore( [], [] ), { 'zscores': [], 'mu': null, 'sigma': null } );
	});

	it( 'should handle non-numeric values by setting the element to NaN', function test() {
		var data, actual, expected;

		data = [ true, null, [], {} ];
		actual = new Array( data.length );
		actual = zscore( actual, data );

		expected = {
			'zscores': [ NaN, NaN, NaN, NaN ],
			'mu': NaN,
			'sigma': NaN
		};

		assert.deepEqual( actual, expected );
	});

});
