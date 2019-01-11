import * as React from 'react';

interface IHamburgerProps {
    onHamburgerClick: () => void;
    filterExpanded: boolean;
}

const Hamburger: React.SFC<IHamburgerProps> = (props: IHamburgerProps) => {

    return (
        <div className="hamburger mt-4 ml-4" onClick={() => props.onHamburgerClick()}>
            <div className={`hamburger-container ${props.filterExpanded ? 'active' : ''}`}>
            <div className="hamburger__bar"/>
            </div>
        </div>
    );

};

export default Hamburger;