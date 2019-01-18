import * as React from 'react';
import { Textfit } from 'react-textfit';
import ReactStars from 'react-stars';

interface ITitleProps {
    name: string;
    rating: number;
    containerStyle: Object;
    nameStyle: Object;
}

const Title: React.SFC<ITitleProps> = (props: ITitleProps) => {

    return (
        <div className="px-2 pb-3" style={props.containerStyle}>
            {props.name && 
                <Textfit className="title font-weight-bold" style={props.nameStyle} min={20} max={40}>{props.name}</Textfit>}
            {props.rating && 
                <ReactStars
                    className="stars"
                    count={5}
                    value={(props.rating / 100) * 5}
                    onChange={() => {}}
                    size={40}
                />}
        </div>
    );

};

export default Title;