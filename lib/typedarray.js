'use strict';

// MODULES //

var mean = require( 'compute-mean' ),
	stdev = require( 'compute-stdev' );


// Z-SCORE //

/**
* FUNCTION: zScore( out, arr )
*	Standardizes elements in input typed array.
*
* @param {Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} out - output array
* @param {Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} arr - input array
* @returns {Object} output object holding `zscores`, `mu` and `sigma`
*/
function zScore( y, x ) {
	var avg = mean( x ),
		sd = stdev( x ),
		len = x.length,
		i;

	for ( i = 0; i < len; i++ ) {
		y[ i ] = ( x[ i ] - avg ) / sd;
	}
	return {
		'zscores': y,
		'mu': avg,
		'sigma': sd
	};
} // end FUNCTION zScore()


// EXPORTS //

module.exports = zScore;
