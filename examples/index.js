'use strict';

var zScore = require( './../lib' ),
	matrix = require( 'dstructs-matrix' ),
	randNorm = require( 'distributions-normal-random' ),
	data,
	out,
	mat,
	tmp,
	i;

data = randNorm( [25], {
	'mu': 8,
	'sigma': 3
});


// ----
// Plain arrays...
out = zScore( data );
console.log( 'Arrays:' );
console.log( out[ 0 ] );
console.log( 'Mean: ' + out[ 1 ] + '\tSD: ' + out[ 2 ] );
console.log( '\n' );

// ----
// Object arrays (accessors)...
function getValue( d ) {
	return d.x;
}
for ( i = 0; i < data.length; i++ ) {
	data[ i ] = {
		'x': data[ i ]
	};
}
out = zScore( data, {
	'accessor': getValue
});
console.log( 'Accessors:' );
console.log( out[ 0 ] );
console.log( 'Mean: ' + out[ 1 ] + '\tSD: ' + out[ 2 ] );
console.log( '\n' );

// ----
// Deep set arrays...
for ( i = 0; i < data.length; i++ ) {
	data[ i ] = {
		'x': [ i, data[ i ].x ]
	};
}
out = zScore( data, {
	'path': 'x/1',
	'sep': '/'
});
console.log( 'Deepset:' );
console.dir( out[ 0 ] );
console.log( 'Mean: ' + out[ 1 ] + '\tSD: ' + out[ 2 ] );
console.log( '\n' );


// ----
// Typed arrays...
data = randNorm( [25], {
	'mu': 8,
	'sigma': 3,
	'dtype': 'int32'
});
out = zScore( data );
console.log( 'Typed arrays:' );
console.log( out[ 0 ] );
console.log( 'Mean: ' + out[ 1 ] + '\tSD: ' + out[ 2 ] );
console.log( '\n' );

// ----
// Matrices...
mat = matrix( data, [5,5], 'int32' );
out = zScore( mat );
console.log( 'Matrix:' );
console.log( out[ 0 ].toString() );
console.log( 'Mean: ' + out[ 1 ] + '\tSD: ' + out[ 2 ] );
console.log( '\n' );

// ----
// Matrices (custom output data type)...
out = zScore( mat, {
	'dtype': 'uint8'
});
console.log( 'Matrix (%s):', out[ 0 ].dtype );
console.log( out[ 0 ].toString() );
console.log( 'Mean: ' + out[ 1 ] + '\tSD: ' + out[ 2 ] );
console.log( '\n' );
