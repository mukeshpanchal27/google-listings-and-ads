/**
 * Internal dependencies
 */
import useLayout from '~/hooks/useLayout';
import SetupTopBar from './setup-top-bar';
import SetupStepper from './setup-stepper';

const SetupMC = () => {
	useLayout( 'full-page' );

	return (
		<>
			<SetupTopBar />
			<SetupStepper />
		</>
	);
};

export default SetupMC;
