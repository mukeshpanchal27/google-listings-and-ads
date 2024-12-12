/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './title.scss';

const Title = ( props ) => {
	const { className, ...rest } = props;

	return (
		<div
			className={ classnames( 'wcdl-subsection-title', className ) }
			{ ...rest }
		/>
	);
};

export default Title;
