import * as React from 'react';

interface ICoverProps {
    url: string;
    discount_percent: number;
    style: Object;
}

const Cover: React.SFC<ICoverProps> = (props: ICoverProps) => {

    return (
        <>
            <img style={props.style} src={props.url} />
            {props.discount_percent && 
                <div className="cover-discount mt-2 px-1">-{props.discount_percent}%</div>}
        </>
    );

};

export default Cover;