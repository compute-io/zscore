/* global describe, it, require */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Deep close to:
	deepCloseTo = require( './utils/deepcloseto.js' ),

	// Module to be tested:
	zScore = require( './../lib/deepset.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'deepset zscore', function tests() {

	it( 'should export a function', function test() {
		expect( zScore ).to.be.a( 'function' );
	});

	it( 'should standardize elements and deep set', function test() {
		var data, expected;

		data = [
			{'x': 0 },
			{'x': 5 },
			{'x': 10 }
		];

		data = zScore( data, 'x' );
		expected = {
			'zscores': [
				{'x':-1},
				{'x':0},
				{'x':1}
			],
			'mu': 5,
			'sigma': 5
		};

		assert.isTrue( deepCloseTo( data, expected, 1e-7 ) );

		// Custom separator...
		data = [
			{'x':[9,0]},
			{'x':[9,5]},
			{'x':[9,10]}
		];

		data = zScore( data, 'x/1', '/' );
		expected = {
			'zscores': [
				{'x':[9,-1]},
				{'x':[9,0]},
				{'x':[9,1]}
			],
			'mu': 5,
			'sigma': 5
		};

		assert.isTrue( deepCloseTo( data, expected, 1e-7 ), 'custom separator' );
	});

	it( 'should return an empty array if provided an empty array', function test() {
		assert.deepEqual( zScore( [], 'x' ), { 'zscores': [], 'mu': null, 'sigma': null } );
		assert.deepEqual( zScore( [], 'x', '/' ), { 'zscores': [], 'mu': null, 'sigma': null } );
	});

	it( 'should handle non-numeric values by setting the element to NaN', function test() {
		var data, actual, expected;

		data = [
			{'x':true},
			{'x':null},
			{'x':[]},
			{'x':{}}
		];
		actual = zScore( data, 'x' );

		expected = {
			'zscores': [
				{'x':NaN},
				{'x':NaN},
				{'x':NaN},
				{'x':NaN}
			],
			'mu': NaN,
			'sigma': NaN
		};

		assert.deepEqual( actual, expected );
	});

});
