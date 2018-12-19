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
        <div className="summary">
            <div className="text">
                {!props.summaryExpanded
                    ? <Truncate lines={4} ellipsis={`...`}>{props.summary}</Truncate>
                    : props.summary}
            </div>
        </div>
    );

};

export default Summary;