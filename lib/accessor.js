'use strict';

// MODULES //

var mean = require( 'compute-mean/lib/accessor.js' ),
	stdev = require( 'compute-stdev/lib/accessor.js' );


// Z-SCORE //

/**
* FUNCTION: zScore( out, arr, accessor )
*	Standardizes elements in input array using an accessor function.
*
* @param {Array|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} out - output array
* @param {Array} arr - input array
* @param {Function} accessor - accessor function for accessing array values
* @returns {Number[]|Int8Array|Uint8Array|Uint8ClampedArray|Int16Array|Uint16Array|Int32Array|Uint32Array|Float32Array|Float64Array} output array
*/
function zScore( y, x, clbk ) {
	var len = x.length,
		avg = mean( x, clbk ),
		sd = stdev( x, clbk ),
		v, i;

	for ( i = 0; i < len; i++ ) {
		v = clbk( x[ i ], i );
		y[ i ] = ( v - avg ) / sd;
	}
	return [ y, avg, sd ];
} // end FUNCTION zScore()


// EXPORTS //

module.exports = zScore;
