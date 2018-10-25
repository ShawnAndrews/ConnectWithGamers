import * as React from 'react';

interface ITopnavProps {
    goBack: () => void;
    swipeLeft: () => void;
    title: string;
}

const Topnav: React.SFC<ITopnavProps> = (props: ITopnavProps) => {
    
    return (
        <div className="page-template-title-container">
            <div className="page-template-title">
                {props.title}
            </div>
            <i className="fas fa-arrow-left page-template-back-btn" onClick={() => { props.goBack(); }}/>
            <i className="fas fa-search page-template-search-btn" onClick={() => { props.swipeLeft(); }}/>
        </div>
    );

}; 

export default Topnav;