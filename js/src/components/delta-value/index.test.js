/**
 * External dependencies
 */
import { render } from '@testing-library/react';

/**
 * Internal dependencies
 */
import DeltaValue from './index';

describe( 'DeltaValue Component', () => {
	it( 'renders a positive value with the correct class and formatting', () => {
		const { container, getByText } = render( <DeltaValue amount={ 10 } /> );
		expect( getByText( '+10' ) ).toBeInTheDocument();
		expect(
			container.querySelector( '.gla-delta-value--positive' )
		).toBeTruthy();
	} );

	it( 'renders a negative value with the correct class and formatting', () => {
		const { container, getByText } = render( <DeltaValue amount={ -5 } /> );
		expect( getByText( '-5' ) ).toBeInTheDocument();
		expect(
			container.querySelector( '.gla-delta-value--negative' )
		).toBeTruthy();
	} );

	it( 'renders zero value without positive or negative class', () => {
		const { container, getByText } = render( <DeltaValue amount={ 0 } /> );
		expect( getByText( '0' ) ).toBeInTheDocument();
		expect(
			container.querySelector( '.gla-delta-value--positive' )
		).toBeFalsy();
		expect(
			container.querySelector( '.gla-delta-value--negative' )
		).toBeFalsy();
	} );

	it( 'renders a positive value with a suffix', () => {
		const { getByText } = render( <DeltaValue amount={ 15 } suffix="%" /> );
		expect( getByText( '+15%' ) ).toBeInTheDocument();
	} );

	it( 'renders a negative value with a suffix', () => {
		const { getByText } = render(
			<DeltaValue amount={ -20 } suffix="%" />
		);
		expect( getByText( '-20%' ) ).toBeInTheDocument();
	} );

	it( 'handles NaN amount gracefully by rendering 0', () => {
		const { getByText } = render( <DeltaValue amount={ 'amount' } /> );
		expect( getByText( '0' ) ).toBeInTheDocument();
	} );

	it( 'applies the correct classnames based on the value', () => {
		const { container } = render( <DeltaValue amount={ -10 } /> );
		expect( container.querySelector( '.gla-delta-value' ) ).toBeTruthy();
		expect(
			container.querySelector( '.gla-delta-value--negative' )
		).toBeTruthy();
		expect(
			container.querySelector( '.gla-delta-value--positive' )
		).toBeFalsy();
	} );
} );
