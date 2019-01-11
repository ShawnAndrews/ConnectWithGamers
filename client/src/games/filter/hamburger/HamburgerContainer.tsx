import * as React from 'react';
import Hamburger from './Hamburger';

interface IHamburgerContainerProps {
    onHamburgerClick: () => void;
    filterExpanded: boolean;
}

interface IHamburgerContainerState { }

class HamburgerContainer extends React.Component<IHamburgerContainerProps, IHamburgerContainerState> {

    constructor(props: IHamburgerContainerProps) {
        super(props);

        this.state = { };
    }

    render() {
        return (
            <Hamburger
                onHamburgerClick={this.props.onHamburgerClick}
                filterExpanded={this.props.filterExpanded}
            />
        );
    }

}

export default HamburgerContainer;