import * as React from 'react';

interface ISummaryProps {
    summary: string;
    summaryExpanded: boolean;
    expandSummary: () => void;
}

const Summary: React.SFC<ISummaryProps> = (props: ISummaryProps) => {
    const maxUnexpandedCharacters: number = 250;

    return (
        <div className="summary col-xl-5">
            {!props.summaryExpanded && props.summary.length > maxUnexpandedCharacters
                ? <div onClick={() => props.expandSummary()}>{props.summary.slice(0, maxUnexpandedCharacters)}...</div>
                : props.summary}
        </div>
    );

};

export default Summary;