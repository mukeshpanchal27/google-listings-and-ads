/**
 * Internal dependencies
 */
import Label from '../label';
import './metric-value.scss';

/**
 * Metric component displays a metric with a title and its corresponding value.
 *
 * @param {Object} props - The component props.
 * @param {string} props.labelKey - The key used to retrieve the label text.
 * @param {JSX.Element | string} props.value - The value to be displayed for the metric.
 * @return {JSX.Element} The rendered Metric component.
 */
const MetricValue = ( { labelKey, value } ) => {
	if ( value === undefined || value === null || value === '' ) {
		return null;
	}

	return (
		<div className="gla-change-price-modal__metric-value">
			<div className="gla-change-price-modal__metric-value-title">
				<Label labelKey={ labelKey } />
			</div>
			<div className="gla-change-price-modal__metric-value-value">
				{ value }
			</div>
		</div>
	);
};

export default MetricValue;
