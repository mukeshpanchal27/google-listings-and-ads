/**
 * Internal dependencies
 */
import useLayout from '~/hooks/useLayout';
import SetupTopBar from './setup-top-bar';
import AdsStepper from './ads-stepper';

/**
 * The entry page component of the Ads-onboarding flow.
 *
 * It's also the former `SetupAds` page component.
 */
const AdsOnboarding = () => {
	useLayout( 'full-page' );

	return (
		<>
			<SetupTopBar />
			<AdsStepper />
		</>
	);
};

export default AdsOnboarding;
