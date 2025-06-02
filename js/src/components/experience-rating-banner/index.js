/**
 * External dependencies
 */
import { Notice, Icon } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { external as externalIcon } from '@wordpress/icons';
import { store as preferencesStore } from '@wordpress/preferences';

/**
 * Internal dependencies
 */
import AppButton from '../app-button';
import usePreference from '~/hooks/usePreference';
import { PREFERENCES_STORE_NAMESPACE } from '~/constants';
import './index.scss';

const BANNER_DISMISSED_KEY = 'experience-rating-banner-dismissed';

const ExperienceRatingBanner = () => {
	const { set } = useDispatch( preferencesStore );
	const isDismissed = usePreference( BANNER_DISMISSED_KEY );

	const handleClick = () => false;

	const onDismiss = () => {
		set( PREFERENCES_STORE_NAMESPACE, BANNER_DISMISSED_KEY, true );
	};

	if ( isDismissed ) {
		return null;
	}

	return (
		<Notice
			className="gla-experience-rating-banner"
			status="info"
			isDismissible={ true }
			onRemove={ onDismiss }
		>
			<p className="gla-experience-rating-banner__text">
				{ __(
					'How was your experience with Google for WooCommerce?',
					'google-listings-and-ads'
				) }
			</p>

			<div className="gla-experience-rating-banner__actions">
				<AppButton onClick={ handleClick } isSecondary>
					{ __( 'Good', 'google-listings-and-ads' ) }
				</AppButton>

				<AppButton
					isSecondary
					href="https://woocommerce.com"
					target="_blank"
				>
					{ __( 'Need help', 'google-listings-and-ads' ) }
					<Icon icon={ externalIcon } size={ 18 } />
				</AppButton>
			</div>
		</Notice>
	);
};

export default ExperienceRatingBanner;
