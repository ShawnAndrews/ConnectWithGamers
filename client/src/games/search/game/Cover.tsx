import * as React from 'react';

interface ICoverProps {
    url: string;
}

const Cover: React.SFC<ICoverProps> = (props: ICoverProps) => {

    return (
        <img src={props.url} />
    );

};

export default Cover;