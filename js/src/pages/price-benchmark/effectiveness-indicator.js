/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import Badge from '~/components/badge';

const EFFECTIVENESS_MAP = {
	low: {
		intent: 'error',
		label: __( 'Low', 'google-listings-and-ads' ),
	},
	medium: {
		intent: 'warning',
		label: __( 'Medium', 'google-listings-and-ads' ),
	},
	high: {
		intent: 'success',
		label: __( 'High', 'google-listings-and-ads' ),
	},
};

const EffectivenessIndicator = ( { effectiveness } ) => {
	if ( ! EFFECTIVENESS_MAP[ effectiveness ] ) {
		return null;
	}

	return (
		<Badge intent={ EFFECTIVENESS_MAP[ effectiveness ].intent }>
			{ EFFECTIVENESS_MAP[ effectiveness ].label }
		</Badge>
	);
};

export default EffectivenessIndicator;
