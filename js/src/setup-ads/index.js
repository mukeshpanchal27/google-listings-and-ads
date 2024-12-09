/**
 * Internal dependencies
 */
import useLayout from '~/hooks/useLayout';
import SetupTopBar from './setup-top-bar';
import AdsStepper from './ads-stepper';

const SetupAds = () => {
	useLayout( 'full-page' );

	return (
		<>
			<SetupTopBar />
			<AdsStepper />
		</>
	);
};

export default SetupAds;
