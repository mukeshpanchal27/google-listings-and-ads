/**
 * Internal dependencies
 */
import * as dataviews from '../../node_modules/@wordpress/dataviews/build-wp';

if ( typeof window.wp === 'undefined' ) {
	window.wp = {};
}

window.wp.dataviews = dataviews;
