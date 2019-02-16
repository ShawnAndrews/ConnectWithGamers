import * as React from 'react';

interface ICoverProps {
    url: string;
    style: Object;
}

const Cover: React.SFC<ICoverProps> = (props: ICoverProps) => {

    return (
        <img style={props.style} src={props.url} />
    );

};

export default Cover;