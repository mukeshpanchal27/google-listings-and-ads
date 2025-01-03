/**
 * Internal dependencies
 */
import StepContent from '~/components/stepper/step-content';
import StepContentActions from '~/components/stepper/step-content-actions';
import StepContentFooter from '~/components/stepper/step-content-footer';
import SetupFreeListings from '~/components/free-listings/setup-free-listings';
import Hero from './hero';

/**
 * Renders the onboarding step for setting up the product listings.
 *
 * @param {Object} props React props to be forwarded to `SetupFreeListings`.
 */
export default function SetupListings( props ) {
	return (
		<>
			<Hero />
			<StepContent>
				<SetupFreeListings { ...props } />
				<StepContentFooter>
					<StepContentActions>
						<SetupFreeListings.SubmitButton />
					</StepContentActions>
				</StepContentFooter>
			</StepContent>
		</>
	);
}
