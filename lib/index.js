'use strict';

// MODULES //

var array = require( 'dstructs-array' ),
	matrix = require( 'dstructs-matrix' ).raw,
	isArrayLike = require( 'validate.io-array-like' ),
	isTypedArrayLike = require( 'validate.io-typed-array-like' ),
	isMatrixLike = require( 'validate.io-matrix-like' ),
	ctors = require( 'compute-array-constructors' ),
	validate = require( './validate.js' );


// FUNCTIONS //

var zScoreA = require( './array.js' ),
	zScoreC = require( './accessor.js' ),
	zScoreD = require( './deepset.js' ),
	zScoreM = require( './matrix.js' ),
	zScoreT = require( './typedarray.js' );


// Z-SCORE //

/**
* FUNCTION: zScore( x, opts )
*	Standardizes elements of x.
*
* @param {Number[]|Matrix|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} x - input value
* @param {Object} opts - options object
* @returns {Number[]|Matrix|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} z-scores as array or matrix
*/
function zScore( x, options ) {
	/* jshint newcap:false */
	var opts = {},
		ctor,
		err,
		dim,
		out,
		d,
		m,
		dt;
	if ( arguments.length > 1 ) {
		err = validate( opts, options );
		if ( err ) {
			throw err;
		}
	}
	if ( isMatrixLike( x ) ) {
		dt = opts.dtype || 'float64';
		dim = opts.dim || 2;
		if ( dim > 2 ) {
			throw new RangeError( 'zScore()::invalid option. Dimension option exceeds number of matrix dimensions. Option: `' + dim + '`.' );
		}
		ctor = ctors( dt );
		if ( ctor === null ) {
			throw new Error( 'zScore()::invalid option. Data type option does not have a corresponding array constructor. Option: `' + dt + '`.' );
		}
		// Create an output matrix and calculate the z-Scores:
		d = new ctor( x.data.length );
		m = matrix( d, x.shape, dt );
		return zScoreM( m, x, dim );
	}
	if ( isTypedArrayLike( x ) ) {
		if ( opts.copy === false ) {
			out = x;
		} else {
			dt = opts.dtype || 'float64';
			out = array( x.length, dt );
		}
		return zScoreT( out, x );
	}
	if ( isArrayLike( x ) ) {
		// Handle deepset first...
		if ( opts.path ) {
			opts.sep = opts.sep || '.';
			return zScoreD( x, opts.path, opts.sep );
		}
		// Handle regular and accessor arrays next...
		if ( opts.copy === false ) {
			out = x;
		}
		else if ( opts.dtype ) {
			ctor = ctors( opts.dtype );
			if ( ctor === null ) {
				throw new TypeError( 'zScore()::invalid option. Data type option does not have a corresponding array constructor. Option: `' + opts.dtype + '`.' );
			}
			out = new ctor( x.length );
		}
		else {
			out = new Array( x.length );
		}
		if ( opts.accessor ) {
			return zScoreC( out, x, opts.accessor );
		}
		return zScoreA( out, x );
	}

	return NaN;
} // end FUNCTION zScore()


// EXPORTS //

module.exports = zScore;
