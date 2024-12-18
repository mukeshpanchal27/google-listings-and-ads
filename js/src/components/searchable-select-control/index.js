/**
 * External dependencies
 */
import { SelectControl as WCSelectControl } from '@woocommerce/components';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './index.scss';

const SearchableSelectControl = ( props ) => {
	const { label, helperText, className, ...rest } = props;

	return (
		<div
			className={ classnames(
				'gla-searchable-select-control',
				className
			) }
		>
			{ label && (
				<div className="gla-searchable-select-control__label">
					{ label }
				</div>
			) }
			<div className="gla-searchable-select-control__input">
				{ /* Don't display the help text because it doesn't look good on the UI. */ }
				<WCSelectControl { ...rest } help="" />
			</div>
			{ helperText && (
				<div className="gla-searchable-select-control__helper-text">
					{ helperText }
				</div>
			) }
		</div>
	);
};

export default SearchableSelectControl;
