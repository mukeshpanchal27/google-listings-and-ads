/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Flex } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Section from '~/components/section';
import AppSpinner from '~/components/app-spinner';
import AppButton from '~/components/app-button';
import AdaptiveForm from '~/components/adaptive-form';
import TaxRate from './tax-rate';
import useSettings from '~/hooks/useSettings';
import useDisplayTaxRate from './useDisplayTaxRate';
import useTargetAudienceFinalCountryCodes from '~/hooks/useTargetAudienceFinalCountryCodes';
import { handleApiError } from '~/utils/handleError';

const validTaxRateSet = new Set( [ 'destination', 'manual' ] );

/**
 * Renders the tax rate setup if the current target audience requires it.
 *
 * This component won't display the validation error message on UI,
 * because it should be obvious to the user that they have to select
 * one of the radio options to continue the submission.
 */
export default function SetupTaxRate() {
	const { settings, saveSettings, syncSettings } = useSettings();
	const { data: audienceCountries } = useTargetAudienceFinalCountryCodes();
	const shouldDisplayTaxRate = useDisplayTaxRate( audienceCountries );

	if ( ! shouldDisplayTaxRate || ! settings?.hasOwnProperty( 'tax_rate' ) ) {
		if ( shouldDisplayTaxRate === false ) {
			return null;
		}

		return (
			<Section>
				<AppSpinner />
			</Section>
		);
	}

	const handleValidate = ( values ) => {
		const errors = {};

		if ( ! validTaxRateSet.has( values.tax_rate ) ) {
			errors.tax_rate = __(
				'Please specify tax rate option.',
				'google-listings-and-ads'
			);
		}

		return errors;
	};

	const handleSubmit = async ( values ) => {
		const nextSettings = {
			...settings,
			tax_rate: values.tax_rate,
		};

		return saveSettings( nextSettings )
			.then( syncSettings, ( error ) => {
				handleApiError(
					error,
					__(
						'There was an error saving tax rate.',
						'google-listings-and-ads'
					)
				);
			} )
			.catch( ( error ) => {
				handleApiError(
					error,
					__(
						'There was an error synchronizing tax rate to Google Merchant Center.',
						'google-listings-and-ads'
					)
				);
			} );
	};

	return (
		<AdaptiveForm
			initialValues={ { tax_rate: settings.tax_rate } }
			validate={ handleValidate }
			onSubmit={ handleSubmit }
		>
			{ ( formContext ) => {
				const { values, isValidForm } = formContext;
				const taxRate = values.tax_rate;
				const disabled = ! isValidForm || taxRate === settings.tax_rate;

				return (
					<TaxRate>
						<Flex justify="flex-end">
							<AppButton
								isPrimary
								disabled={ disabled }
								loading={ formContext.adapter.isSubmitting }
								onClick={ formContext.handleSubmit }
							>
								{ __(
									'Save tax rate',
									'google-listings-and-ads'
								) }
							</AppButton>
						</Flex>
					</TaxRate>
				);
			} }
		</AdaptiveForm>
	);
}
