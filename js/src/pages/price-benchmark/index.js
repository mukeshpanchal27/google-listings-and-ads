/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { Card } from '@wordpress/components';

/**
 * Internal dependencies
 */
import AppSpinner from '~/components/app-spinner';
import MainTabNav from '~/components/main-tab-nav';
import PriceBenchmarkSuggestions from './price-benchmark-suggestions';
import ProductComparisonChart from './product-comparison-chart';
import Banner from './banner';
import { glaData } from '~/constants';
import './index.scss';

const PriceBenchmark = () => {
	const [ dataViewLoaded, setDataViewLoaded ] = useState(
		window.wp.dataviews
	);

	useEffect( () => {
		if ( dataViewLoaded === undefined ) {
			const script = document.createElement( 'script' );
			script.src = glaData.dataViewsScriptUrl;
			script.async = true;

			script.onload = () => {
				if (
					window.wp.dataviews &&
					typeof window.wp.dataviews?.filterSortAndPaginate ===
						'function'
				) {
					setDataViewLoaded( true );
				} else {
					setDataViewLoaded( false );
				}
			};

			script.onerror = () => {
				setDataViewLoaded( false );
			};

			document.head.appendChild( script );
		}

		return () => {
			if ( dataViewLoaded === false ) {
				setDataViewLoaded( undefined );
			}
		};
	}, [ dataViewLoaded ] );

	return (
		<div className="gla-price-benchmark">
			<MainTabNav />

			<Banner />
			<ProductComparisonChart />

			<Card className="gla-price-benchmark__card">
				{ dataViewLoaded === undefined && (
					<div className="gla-price-benchmark__loading">
						<AppSpinner />
					</div>
				) }

				{ dataViewLoaded === false && (
					<div className="gla-price-benchmark__empty-metrics">
						<p className="gla-price-benchmark__error-message">
							{ __(
								'There was an error loading the price benchmark suggestions.',
								'google-listings-and-ads'
							) }
						</p>
					</div>
				) }

				{ dataViewLoaded && <PriceBenchmarkSuggestions /> }
			</Card>
		</div>
	);
};

export default PriceBenchmark;
