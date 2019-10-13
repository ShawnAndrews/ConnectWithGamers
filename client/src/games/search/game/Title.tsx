import * as React from 'react';
import { Textfit } from 'react-textfit';
import ReactStars from 'react-stars';
import { IdNamePair } from '../../../../client-server-common/common';

interface ITitleProps {
    name: string;
    rating: number;
    gameRatedSnackbarOpen: boolean;
    onRateStarsClick: (rating: number) => void;
    developer: string;
    publisher: string;
}

const Title: React.SFC<ITitleProps> = (props: ITitleProps) => {
    return (
        <div className="title px-2 pb-3">
            {props.name && 
                <Textfit className="name font-weight-bold" min={20} max={40}>{props.name}</Textfit>}
            {(props.publisher || props.developer) && 
                <div className="developer-publisher">{[props.developer, props.publisher].join(` | `)}</div>}
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