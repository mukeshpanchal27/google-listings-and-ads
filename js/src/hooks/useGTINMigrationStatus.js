/**
 * External dependencies
 */
import { useCallback } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useAppSelectDispatch from '~/hooks/useAppSelectDispatch';
import useApiFetchCallback from '~/hooks/useApiFetchCallback';

const selectorName = 'getGtinMigrationStatus';

const useGTINMigrationStatus = () => {
	const { data, isResolving, invalidateResolution } =
		useAppSelectDispatch( selectorName );

	const [ startMigrationApiCall, { loading } ] = useApiFetchCallback( {
		path: `/wc/gla/gtin-migration`,
		method: 'POST',
	} );

	const isLoading = loading || isResolving;

	const startMigration = useCallback( async () => {
		await startMigrationApiCall();
		invalidateResolution();
	}, [ startMigrationApiCall, invalidateResolution ] );

	return [ data, isLoading, startMigration ];
};

export default useGTINMigrationStatus;
