/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import Subsection from '~/wcdl/subsection';
import './title.scss';

const Title = ( props ) => {
	const { className, ...rest } = props;

	return (
		<Subsection.Title
			className={ classnames( 'gla-section-card-title', className ) }
			{ ...rest }
		/>
	);
};

export default Title;
