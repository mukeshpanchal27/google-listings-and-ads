/**
 * External dependencies
 */
import { Button, Card, CardBody } from '@wordpress/components';
import { createInterpolateElement, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Pill } from '@woocommerce/components';

/**
 * Internal dependencies
 */
import { usePreferences } from '~/hooks/usePreferences';
import bannerImage from '~/images/price-benchmark/price-benchmark-banner-icon.svg';
import './index.scss';

const BANNER_DISMISSED_KEY = 'price-benchmark-banner-dismissed';

const Banner = () => {
	const [ visible, setIsVisible ] = useState( true );
	const { get, set } = usePreferences();
	const isDismissed = get( BANNER_DISMISSED_KEY );

	const handleDismiss = () => {
		set( BANNER_DISMISSED_KEY, true );
		setIsVisible( false );
	};

	if ( ! visible || isDismissed ) {
		return null;
	}

	return (
		<Card
			size="medium"
			className={ `gla-price-benchmark-suggestions-banner` }
		>
			<CardBody
				className={ `gla-price-benchmark-suggestions-banner__body` }
			>
				<div className="gla-price-benchmark-suggestions-banner__image_container">
					<img src={ bannerImage } alt="" />
				</div>
				<div className="gla-price-benchmark-suggestions-banner__description_container">
					<Pill className="gla-price-benchmark-suggestions-banner__badge">
						{ __( 'New', 'google-listings-and-ads' ) }
					</Pill>
					<h3 className="gla-price-benchmark-suggestions-banner__title">
						{ __(
							'Price Benchmark & Suggestions',
							'google-listings-and-ads'
						) }
					</h3>
					<p className="gla-price-benchmark-suggestions-banner__description">
						{ createInterpolateElement(
							__(
								'<upper>This report includes a competitive pricing analysis, price recommendations, and insights like <strong>Effectiveness</strong></upper> <lower>to help you identify opportunities, compare against competitors, and accelerate your sales growth.</lower>',
								'google-listings-and-ads'
							),
							{
								strong: <strong />,
								upper: (
									<span className="upper-description-text" />
								),
								lower: (
									<span className="lower-description-text" />
								),
							}
						) }
					</p>
					<div>
						<Button variant="secondary" onClick={ handleDismiss }>
							{ __( 'Dismiss', 'google-listings-and-ads' ) }
						</Button>
					</div>
				</div>
			</CardBody>
		</Card>
	);
};

export default Banner;
