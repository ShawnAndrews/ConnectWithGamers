import * as React from 'react';

interface ICrossfadeProps {
    src: string[];
    index: number;
}

const Crossfade: React.SFC<ICrossfadeProps> = (props: ICrossfadeProps) => {

    return (
        <div className="crossfade">
            {props.src && props.src
                .slice(0, 3)
                .map((x: string, index: number) => (
                    <img src={x} className={index > props.index ? 'hide' : ''} />
                ))}
        </div>
    );

};

export default Crossfade;