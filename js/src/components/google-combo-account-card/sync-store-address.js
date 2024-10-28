/**
 * Internal dependencies
 */
import StoreAddressCard from '.~/components/contact-information/store-address-card';
import useStoreAddressSynced from '.~/hooks/useStoreAddressSynced';
import useGoogleMCAccount from '.~/hooks/useGoogleMCAccount';

/*
 * Renders StoreAddressCard to sync the store address if we have a connected MC account and the address needs to be synced.
 * If there's no connected account or the store address has been synced, it will return null.
 */
const SyncStoreAddress = () => {
	const storeAddressSynced = useStoreAddressSynced();
	const { isReady } = useGoogleMCAccount();

	if ( ! isReady || storeAddressSynced ) {
		return null;
	}

	return <StoreAddressCard />;
};

export default SyncStoreAddress;
