/**
 * External dependencies
 */
import $ from 'jquery';

/**
 * Internal dependencies
 */
import initSelectWithTextInput from './initSelectWithTextInput';

$( function () {
	'use strict';

	const init = () => {
		initSelectWithTextInput( $ );
	};

	$( '#woocommerce-product-data' ).on(
		'woocommerce_variations_loaded',
		init
	);
	$( document.body ).on( 'woocommerce_variations_added', init );
	init();
} );
