import * as React from 'react';
import { Textfit } from 'react-textfit';
import ReactStars from 'react-stars';

interface ITitleProps {
    name: string;
    rating: number;
    gameRatedSnackbarOpen: boolean;
    onRateStarsClick: (rating: number) => void;
    containerStyle: Object;
    nameStyle: Object;
}

const Title: React.SFC<ITitleProps> = (props: ITitleProps) => {

    return (
        <div className="px-2 pb-3" style={props.containerStyle}>
            {props.name && 
                <Textfit className="title font-weight-bold" style={props.nameStyle} min={20} max={40}>{props.name}</Textfit>}
            <ReactStars
                className="stars"
                count={5}
                value={props.rating ? (props.rating / 100) * 5 : 0}
                onChange={props.onRateStarsClick}
                size={40}
                edit={!props.gameRatedSnackbarOpen}
            />
        </div>
    );

};

export default Title;