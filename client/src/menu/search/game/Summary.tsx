import * as React from 'react';
import Truncate from 'react-truncate';

interface ISummaryProps {
    summary: string;
    summaryExpanded: boolean;
    expandSummary: () => void;
}

const Summary: React.SFC<ISummaryProps> = (props: ISummaryProps) => {

    if (!props.summary) {
       return null; 
    }

    return (
        <div className="menu-game-summary">
            <h2 className="menu-game-summary-header">Summary</h2>
            <div className="menu-game-summary-text">
                {!props.summaryExpanded
                ? <Truncate lines={5} ellipsis={<i onClick={props.expandSummary}>  ... Read more</i>}>{props.summary}</Truncate>
                : props.summary}
            </div>
        </div>
    );

};

export default Summary;