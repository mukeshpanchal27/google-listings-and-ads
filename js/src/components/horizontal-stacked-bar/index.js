/**
 * Internal dependencies
 */
import './index.scss';

/**
 * @typedef {Object} Segment
 * @property {string|number} id - Unique identifier for the segment
 * @property {string} label - Display label for the segment
 * @property {string|number} value - Numeric value determining segment size
 * @property {string} color - CSS color value for the segment
 * @property {number} [percentage] - Calculated percentage of the segment (added during processing)
 */

/**
 * Renders a horizontal stacked bar chart with colored segments and a legend.
 * The segments are sorted by value in ascending order.
 *
 * @param {Object} props - Component props.
 * @param {string} props.title - Title of the chart.
 * @param {Array<Segment>} [props.segments=[]] - Array of data segments to display in the chart.
 * @return {JSX.Element|null} The rendered component or null if no valid segments.
 */
const HorizontalStackedBar = ( { title, segments } ) => {
	if ( ! segments || segments.length === 0 ) {
		return null;
	}

	const sortedSegments = [ ...segments ].sort( ( a, b ) => {
		return Number( a.value ) - Number( b.value );
	} );

	const total = sortedSegments.reduce(
		( sum, segment ) => sum + Number( segment.value ),
		0
	);

	sortedSegments.forEach( ( segment ) => {
		segment.percentage = ( segment.value / total ) * 100;
	} );

	return (
		<div className="horizontal-stacked-bar">
			<p className="horizontal-stacked-bar__title">{ title }</p>

			<div className="horizontal-stacked-bar__legend">
				<ul>
					{ sortedSegments.map( ( segment ) => {
						return (
							<li
								key={ segment.id }
								className="horizontal-stacked-bar__legend-item"
							>
								<span
									className="horizontal-stacked-bar__legend-color"
									style={ {
										backgroundColor: segment.color,
									} }
								/>
								{ `${ segment.percentage }% ${ segment.label }` }
							</li>
						);
					} ) }
				</ul>
			</div>

			<div className="horizontal-stacked-bar__chart">
				{ sortedSegments.map( ( segment ) => {
					return (
						<span
							key={ segment.id }
							style={ {
								width: `${ segment.percentage }%`,
								backgroundColor: segment.color,
							} }
							title={ `${ segment.percentage }% ${ segment.label }` }
						/>
					);
				} ) }
			</div>
		</div>
	);
};

export default HorizontalStackedBar;
