/**
 * Internal dependencies
 */
import {
	DataViews,
	filterSortAndPaginate,
} from '../../node_modules/@wordpress/dataviews/build-wp';

window.wp = window.wp || {};
window.wp.dataviews = {};
window.wp.dataviews.DataViews = DataViews;
window.wp.dataviews.filterSortAndPaginate = filterSortAndPaginate;
