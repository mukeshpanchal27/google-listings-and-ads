/**
 * Internal dependencies
 */
import './body.scss';

const Body = ( props ) => {
	const { children } = props;

	return <div className="gla-subsection-body">{ children }</div>;
};

export default Body;
