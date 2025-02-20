/**
 * Internal dependencies
 */
import useLayout from '~/hooks/useLayout';
import useAutoWPComAppAuthorization from './useAutoWPComAppAuthorization';
import useUpdateRestAPIAuthorizeStatusByUrlQuery from '~/hooks/useUpdateRestAPIAuthorizeStatusByUrlQuery';
import SetupTopBar from './setup-top-bar';
import SetupStepper from './setup-stepper';

/**
 * The entry page component of the Onboarding flow.
 *
 * It's also the former `SetupMC` page component.
 */
const Onboarding = () => {
	useLayout( 'full-page' );
	useUpdateRestAPIAuthorizeStatusByUrlQuery();

	const canContinueRendering = useAutoWPComAppAuthorization();

	// Render nothing as the requirement is to make it look like the redirections
	// between Google authorization and WPCOM app authorization are seamless.
	if ( ! canContinueRendering ) {
		return null;
	}

	return (
		<>
			<SetupTopBar />
			<SetupStepper />
		</>
	);
};

export default Onboarding;
