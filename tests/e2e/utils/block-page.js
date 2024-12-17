/**
 * External dependencies
 */
import { cleanForSlug } from '@wordpress/url';

/**
 * Internal dependencies
 */
import { apiWP } from './api';
import relatedProductPage from './__fixtures__/related-products.fixture.mjs';

/**
 * Check if a page exists from a title.
 *
 * @param {string} title
 * @return {Promise<number>} Existing page ID.
 */
export async function pageExistsByTitle( title ) {
	const slug = cleanForSlug( title );

	return await apiWP()
		.get( `pages?slug=${ slug }` )
		.then( ( response ) => response.data[ 0 ]?.id );
}

/**
 * Creates a WP page with content and title.
 *
 * @param {string} title
 * @param {string} content
 * @return {Promise<number>} Created page ID.
 */
export async function createPage( title, content ) {
	return await apiWP()
		.post( 'pages', {
			title,
			content,
			status: 'publish',
		} )
		.then( ( response ) => response.data.id );
}

/**
 * Creates a shop page using blocks.
 * @return {Promise<string>} Slug of the created page.
 */
export async function createBlockShopPage() {
	const {
		title,
		slug,
		pageContent: content,
	} = require( './__fixtures__/all-products.fixture.json' );

	if ( ! ( await pageExistsByTitle( title ) ) ) {
		await createPage( title, content );
	}
	return slug;
}

/**
 * Creates a page with related products block.
 *
 * @param {number} productId Product ID.
 * @return {Promise<string>} Slug of the created page.
 */
export async function createRelatedProductsPage( productId ) {
	const { title, slug, pageContent } = relatedProductPage;

	if ( ! ( await pageExistsByTitle( title ) ) ) {
		await createPage( title, pageContent( productId ) );
	}
	return slug;
}
