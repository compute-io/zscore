'use strict';

// MODULES //

var deepSet = require( 'utils-deep-set' ).factory,
	deepGet = require( 'utils-deep-get' ).factory,
	mean = require( 'compute-mean' ),
	stdev = require( 'compute-stdev' );


// Z-SCORE //

/**
* FUNCTION: zScore( arr, path[, sep] )
*	Standardizes elements and deep sets the input array.
*
* @param {Array} arr - input array
* @param {String} path - key path used when deep getting and setting
* @param {String} [sep] - key path separator
* @returns {Object} output object holding `zscores`, `mu` and `sigma`
*/
function zScore( x, path, sep ) {
	var len = x.length,
		opts = {},
		arr,
		mu = null,
		sd = null,
		dget,
		dset,
		i;
	if ( arguments.length > 2 ) {
		opts.sep = sep;
	}
	if ( len ) {
		dget = deepGet( path, opts );
		dset = deepSet( path, opts );
		arr = [];
		for ( i = 0; i < len; i++ ) {
			arr.push( dget( x[ i ] ) );
		}
		mu = mean( arr );
		sd = stdev( arr );
		for ( i = 0; i < len; i++ ) {
			dset( x[i], ( arr[ i ] - mu ) / sd );
		}
	}
	return {
		'zscores': x,
		'mu': mu,
		'sigma': sd
	};
} // end FUNCTION zScore()


// EXPORTS //

module.exports = zScore;
