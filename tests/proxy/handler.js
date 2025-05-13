'use strict';

const config = require( './config' );

module.exports.checkRequest = ( request ) => {
	if ( config.logResponses ) {
		// eslint-disable-next-line no-console
		console.log( 'Request path: ', '\n', request.params.path );
	}

	if ( request.params.path.includes( 'googleAds:search' ) ) {
		const body = JSON.parse( request.payload );
		if ( body.query.includes( 'shopping_performance_view' ) ) {
			const file = body.query.includes( 'segments.product_item_id' )
				? 'products'
				: 'programs';
			const page = body.pageToken ? '-' + body.pageToken : '';

			return require( `./mocks/ads/reports/${ file }${ page }.json` );
		}
	}
	if ( request.params.path.includes( 'reports/search' ) ) {
		const body = JSON.parse( request.payload );
		if ( config.logResponses ) {
			// eslint-disable-next-line no-console
			console.log( 'Request query: ', '\n', body.query );
		}

		let mockPath = false;

		if ( body.query.includes( 'FROM PriceCompetitivenessProductView' ) ) {
			mockPath = './mocks/mc/price-benchmarks/price-competitiveness.json';
		}

		if ( body.query.includes( 'FROM PriceInsightsProductView' ) ) {
			mockPath = './mocks/mc/price-benchmarks/price-insights.json';
		}

		if ( body.query.includes( 'FROM ProductView' ) ) {
			return false;
		}

		if ( body.query.includes( 'FROM MerchantPerformanceView' ) ) {
			if ( body.query.includes( 'WHERE segments.date BETWEEN' ) ) {
				mockPath = './mocks/mc/price-benchmarks/merchant-report.json';
			} else {
				const file = body.query.includes( 'segments.offer_id' )
					? 'products'
					: 'programs';
				const page = body.pageToken ? '-' + body.pageToken : '';

				mockPath = `./mocks/mc/reports/${ file }${ page }.json`;
			}
		}

		return mockPath ? require( mockPath ) : false;
	}

	if ( request.params.path.includes( 'products/batch' ) ) {
		const body = JSON.parse( request.payload );
		if (
			config.proxyMode === 'delete_error' &&
			body.entries[ 0 ].method === 'delete'
		) {
			const response = require( './mocks/mc/delete_errors' );

			return response.deleteErrors( body );
		}

		if (
			config.proxyMode === 'update_error' &&
			body.entries[ 0 ].method === 'insert'
		) {
			const response = require( './mocks/mc/update_errors' );

			return response.updateErrors( body );
		}
	}

	return false;
};
