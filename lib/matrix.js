'use strict';

// MODULES //

var mean = require( 'compute-mean' ),
	stdev = require( 'compute-stdev' );


// Z-SCORE //

/**
* FUNCTION: zScore( out, mat[, dim] )
*	Computes the z-Scores along a matrix dimension.
*
* @param {Matrix} out - output matrix
* @param {Matrix} mat - input matrix
* @param {Number} [dim=2] - matrix dimension along which to calculate z-Scores. If `dim=1`, compute along matrix rows. If `dim=2`, compute along matrix columns.
* @returns {Object} output object holding `zscores`, `mu` and `sigma`
*/
function zScore( out, mat, dim ) {
	var M, N,
		s0, s1,
		means,
		sds,
		o,
		i, j, k;

	if ( dim === 1 ) {
		// Compute along the rows...
		M = mat.shape[ 1 ];
		N = mat.shape[ 0 ];
		s0 = mat.strides[ 1 ];
		s1 = mat.strides[ 0 ];
	} else {
		// Compute along the columns...
		M = mat.shape[ 0 ];
		N = mat.shape[ 1 ];
		s0 = mat.strides[ 0 ];
		s1 = mat.strides[ 1 ];
	}

	if ( M === 0 || N === 0 ) {
		return {
			'zscores': out,
			'mu': null,
			'sigma': null
		};
	}

	means = mean( mat, {
		'dim': dim
	}).data;
	sds = stdev( mat, {
		'dim': dim
	}).data;

	o = mat.offset;
	for ( i = 0; i < M; i++ ) {
		k = o + i*s0;
		for ( j = 0; j < N; j++ ) {
			out.data[ k + j*s1 ] = ( mat.data[ k + j*s1 ] - means[ i ] ) / sds[ i ];
		}
	}
	return {
		'zscores': out,
		'mu': means,
		'sigma': sds
	};
} // end FUNCTION zScore()


// EXPORTS //

module.exports = zScore;
