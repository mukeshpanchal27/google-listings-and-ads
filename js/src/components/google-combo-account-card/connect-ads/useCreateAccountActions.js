/**
 * External dependencies
 */
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import useUpsertAdsAccount from '.~/hooks/useUpsertAdsAccount';

const useCreateAccountActions = () => {
	const [ creatingNewAccount, setCreatingNewAccount ] = useState( false );
	const [ showCreateNewModal, setShowCreateNewModal ] = useState( false );
	const [ upsertAdsAccount ] = useUpsertAdsAccount();

	const onCreateNew = () => {
		setShowCreateNewModal( true );
	};

	const onRequestClose = () => {
		setShowCreateNewModal( false );
	};

	const onContinue = async () => {
		setShowCreateNewModal( false );
		setCreatingNewAccount( true );
		await upsertAdsAccount();
		setCreatingNewAccount( false );
	};

	return {
		creatingNewAccount,
		onContinue,
		onCreateNew,
		onRequestClose,
		showCreateNewModal,
		setShowCreateNewModal,
	};
};

export default useCreateAccountActions;
