/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { Flex, FlexItem } from '@wordpress/components';

/**
 * Internal dependencies
 */
import useGoogleAdsAccount from '~/hooks/useGoogleAdsAccount';
import AppButton from '~/components/app-button';
import AppModal from '~/components/app-modal';
import AppInputPriceControl from '~/components/app-input-price-control';
import EffectivenessIndicator from '../effectiveness-indicator';
import Price from '../price';
import './index.scss';

const ChangePriceModal = ( { productID, onPriceChange, onRequestClose } ) => {
	const { googleAdsAccount } = useGoogleAdsAccount();
	const currency = googleAdsAccount?.currency;

	return (
		<AppModal
			buttons={ [
				<AppButton key="cancel">
					{ __( 'Cancel', 'google-listings-and-ads' ) }
				</AppButton>,
				<AppButton
					key="change-price"
					isPrimary
					onClick={ onPriceChange }
				>
					{ __( 'Change Price', 'google-listings-and-ads' ) }
				</AppButton>,
			] }
			title={ __( 'Change Price', 'google-listings-and-ads' ) }
			onRequestClose={ onRequestClose }
		>
			<Flex justify="space-between" gap="10" expanded align="start">
				<FlexItem>
					<img
						src="https://live.staticflickr.com/5725/21726228300_51333bd62c_b.jpg"
						alt=""
						width="172"
					/>
					<p className="gla-change-price-modal__product-id">259252</p>
					<p className="gla-change-price-modal__product-name">
						Abstract Geometric Poster
					</p>
				</FlexItem>

				<FlexItem style={ { flex: 1 } }>
					<Flex direction={ 'column' } gap="4">
						<FlexItem>
							<Flex justify="space-between" gap="4" expanded>
								<FlexItem>Price Change Effectiveness</FlexItem>
								<FlexItem>
									<EffectivenessIndicator
										effectiveness={ 1 }
									/>
								</FlexItem>
							</Flex>
						</FlexItem>
						<FlexItem>
							<Flex justify="space-between" gap="4" expanded>
								<FlexItem>Regular Price</FlexItem>
								<FlexItem>
									<Price amount={ 25 } />
								</FlexItem>
							</Flex>
						</FlexItem>
						<FlexItem>
							<Flex justify="space-between" gap="4" expanded>
								<FlexItem>Average Price on Google</FlexItem>
								<FlexItem>
									<Price amount={ 20 } />
								</FlexItem>
							</Flex>
						</FlexItem>
						<FlexItem>
							<Flex justify="space-between" gap="4" expanded>
								<FlexItem>Price Gap</FlexItem>
								<FlexItem>20%</FlexItem>
							</Flex>
						</FlexItem>
						<FlexItem>
							<Flex justify="space-between" gap="4" expanded>
								<FlexItem>Suggested Price</FlexItem>
								<FlexItem>
									<Price amount={ 20 } />
								</FlexItem>
							</Flex>
						</FlexItem>
						<FlexItem>
							<Flex justify="space-between" gap="4" expanded>
								<FlexItem>Current Clicks</FlexItem>
								<FlexItem>400</FlexItem>
							</Flex>
						</FlexItem>
						<FlexItem>
							<Flex justify="space-between" gap="4" expanded>
								<FlexItem>Current Conversions</FlexItem>
								<FlexItem>16</FlexItem>
							</Flex>
						</FlexItem>
						<FlexItem>
							<Flex justify="space-between" gap="4" expanded>
								<FlexItem>Expected % Uplift in Clicks</FlexItem>
								<FlexItem>+43%</FlexItem>
							</Flex>
						</FlexItem>
						<FlexItem>
							<Flex justify="space-between" gap="4" expanded>
								<FlexItem>Expected % Uplift in Conv.</FlexItem>
								<FlexItem>+45%</FlexItem>
							</Flex>
						</FlexItem>
					</Flex>

					<AppInputPriceControl
						label={ __( 'New price', 'google-listings-and-ads' ) }
						suffix={ currency }
						value={ 20 }
					/>
				</FlexItem>
			</Flex>
		</AppModal>
	);
};

export default ChangePriceModal;
