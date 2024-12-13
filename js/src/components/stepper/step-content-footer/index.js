/**
 * Internal dependencies
 */
import Section from '~/components/section';
import VerticalGapLayout from '~/components/vertical-gap-layout';

const StepContentFooter = ( { children } ) => {
	return (
		<Section className="gla-step-content-footer">
			<VerticalGapLayout size="xlarge">{ children }</VerticalGapLayout>
		</Section>
	);
};

export default StepContentFooter;
