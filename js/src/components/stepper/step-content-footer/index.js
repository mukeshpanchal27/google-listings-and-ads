/**
 * Internal dependencies
 */
import Section from '~/components/section';

const StepContentFooter = ( { children } ) => {
	return (
		<Section className="gla-step-content-footer" verticalGap={ 10 }>
			{ children }
		</Section>
	);
};

export default StepContentFooter;
