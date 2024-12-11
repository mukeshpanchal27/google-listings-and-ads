/**
 * External dependencies
 */
import { cloneDeep, set } from 'lodash';

/**
 * Use native `Object.freeze()` to make an object immutable, recursively freeze each property which is of type object.
 *
 * Copied from [Object.freeze() of MDN]{@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze}.
 *
 * @param {Object|Array} object The object or array to freeze.
 * @return {Object|Array} The `object` that was passed-in this function.
 */
export function deepFreeze( object ) {
	// Retrieve the property names defined on object
	const propNames = Object.getOwnPropertyNames( object );

	// Freeze properties before freezing self
	for ( const name of propNames ) {
		const value = object[ name ];
		if ( value && typeof value === 'object' ) {
			deepFreeze( value );
		}
	}

	return Object.freeze( object );
}

/**
 * Creates a deep freeze state based on the passed-in state,
 * and an initial value of a specific path can be set optionally to facilitate testing.
 *
 * @param {Object|Array} srcState The state to be attached deep freeze and reference checking.
 * @param {string} [path] The path of state to be set.
 * @param {*} [value] The initial value to be set.
 *
 * @return {Object} Prepared state.
 */
export function prepareImmutableState( srcState, path, value ) {
	const state = cloneDeep( srcState );

	if ( path ) {
		set( state, path, value );
	}

	return deepFreeze( state );
}
