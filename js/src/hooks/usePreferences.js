/**
 * External dependencies
 */
import { useDispatch, useSelect } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';

const STORE_NAME = 'woocommerce/google-listings-and-ads';

/**
 * A custom hook for managing preferences in the 'woocommerce/google-listings-and-ads' scope.
 *
 * @return {Object} An object with `get` and `set` methods for preferences.
 */
export const usePreferences = () => {
	const { set } = useDispatch( preferencesStore );
	const { get } = useSelect( ( select ) => ( {
		get: select( preferencesStore ).get,
	} ) );

	/**
	 * Gets a preference value by key.
	 *
	 * @param {string} key The preference key.
	 * @return {*} The preference value.
	 */
	const getPreference = ( key ) => {
		return get( STORE_NAME, key );
	};

	/**
	 * Sets a preference value.
	 *
	 * @param {string} key The preference key.
	 * @param {*} value The value to set.
	 */
	const setPreference = ( key, value ) => {
		set( STORE_NAME, key, value );
	};

	return {
		get: getPreference,
		set: setPreference,
	};
};
