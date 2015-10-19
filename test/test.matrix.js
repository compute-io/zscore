/* global describe, it, require, beforeEach */
'use strict';

// MODULES //

var // Expectation library:
	chai = require( 'chai' ),

	// Matrix data structure:
	matrix = require( 'dstructs-matrix' ),

	// Module to be tested:
	zScore = require( './../lib/matrix.js' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'matrix zscore', function tests() {

	var out1,
		out2,
		mat,
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

	beforeEach( function before() {
		mat = matrix( d1, [3,3], 'float64' );
		out1 = matrix( d2, [3,3], 'float64' );
		out2 = matrix( d3, [3,3], 'float64' );
	});

	it( 'should export a function', function test() {
		expect( zScore ).to.be.a( 'function' );
	});

	it( 'should throw an error if provided unequal length matrices', function test() {
		expect( badValues ).to.throw( Error );
		function badValues() {
			zScore( matrix( [10,10] ), mat );
		}
	});

	it( 'should standardize matrix elements row-wise', function test() {
		var actual;

		actual = matrix( [3,3], 'float64' );
		actual = zScore( actual, mat, 1 );

		assert.deepEqual( actual.zscores.data, out1.data );
	});

	it( 'should standardize matrix elements column-wise', function test() {
		var actual;

		actual = matrix( [3,3], 'float64' );
		actual = zScore( actual, mat, 2 );

		assert.deepEqual( actual.zscores.data, out2.data );
	});

	it( 'should return an empty matrix if provided an empty matrix', function test() {
		var out, mat, expected;

		out = matrix( [0,0] );
		expected = matrix( [0,0] );

		mat = matrix( [0,10] );
		assert.deepEqual( zScore( out, mat ).zscores, expected );

		mat = matrix( [10,0] );
		assert.deepEqual( zScore( out, mat ).zscores, expected );

		mat = matrix( [0,0] );
		assert.deepEqual( zScore( out, mat ).zscores, expected );
		
	});

});
