/**
 * EmptyMetricsNotice component
 */

/**
 * External dependencies
 */
import { createInterpolateElement } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import EmptyMetricsGraphic from '~/images/price-benchmark/empty-metrics.svg';

const EmptyMetricsNotice = () => {
	return (
		<div className="gla-price-benchmark__empty-metrics">
			<img src={ EmptyMetricsGraphic } alt="" />
			<p>
				{ __(
					'You do not have any sale price suggestions at this moment.',
					'google-listings-and-ads'
				) }
			</p>
			<p>
				{ createInterpolateElement(
					__(
						'<a>Find out</a> if you meet all eligibility criteria to receive suggestions in the future.',
						'google-listings-and-ads'
					),
					{
						a: (
							<a
								href="https://support.google.com/merchants/answer/13798101"
								target="_blank"
								rel="noopener noreferrer"
							>
								{ __( 'Find out', 'google-listings-and-ads' ) }
							</a>
						),
					}
				) }
			</p>
		</div>
	);
};

export default EmptyMetricsNotice;
