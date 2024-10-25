/**
 * Internal dependencies
 */
import StoreAddressCard from '.~/components/contact-information/store-address-card';
import useStoreAddressSynced from '.~/hooks/useStoreAddressSynced';

const SyncStoreAddress = () => {
	const storeAddressSynced = useStoreAddressSynced();

	if ( ! storeAddressSynced ) {
		return <StoreAddressCard />;
	}

	return null;
};

export default SyncStoreAddress;
