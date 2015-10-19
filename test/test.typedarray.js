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

describe( 'typed-array zscore', function tests() {

	it( 'should export a function', function test() {
		expect( zscore ).to.be.a( 'function' );
	});

	it( 'should standardize elements', function test() {
		var data, actual, expected;

		data = new Float64Array( [
			10,
			20,
			40,
			30,
			40,
			50,
			60,
			70
		] );
		actual = new Float64Array( data.length );

		actual = zscore( actual, data );
		expected = {
			'zscores': new Float32Array( [ -1.5, -1, 0, -0.5, 0, 0.5, 1, 1.5 ] ),
			'mu': 40,
			'sigma': 20
		};

		assert.deepEqual( actual, expected );
	});

	it( 'should return an empty array if provided an empty array', function test() {
		assert.deepEqual( zscore( new Int8Array(), new Int8Array() ), { 'zscores': new Int8Array(), 'mu': null, 'sigma': null } );
	});

});
