import * as React from 'react';
import StarIcon from './StarIcon';
import { Textfit } from 'react-textfit';

interface ITitleProps {
    name: string;
    rating: number;
    nameStyle: Object;
    starsStyle: Object; 
}

const Title: React.SFC<ITitleProps> = (props: ITitleProps) => {

    return (
        <>
            {props.name && 
                <Textfit className="title font-weight-bold color-secondary" style={props.nameStyle} min={20} max={40}>{props.name}</Textfit>}
            {props.rating && 
                <div className="stars" style={props.starsStyle}>
                    {props.rating > 0
                        ? props.rating <= 10 
                            ? <StarIcon halfStar={true} active={true} />
                            : <StarIcon halfStar={false} active={true} />
                        : <StarIcon halfStar={false} active={false} />}
                    {props.rating > 20
                        ? props.rating <= 30 
                            ? <StarIcon halfStar={true} active={true} />
                            : <StarIcon halfStar={false} active={true} />
                        : <StarIcon halfStar={false} active={false} />}
                    {props.rating > 40
                        ? props.rating <= 50 
                            ? <StarIcon halfStar={true} active={true} />
                            : <StarIcon halfStar={false} active={true} />
                        : <StarIcon halfStar={false} active={false} />}
                    {props.rating > 60
                        ? props.rating <= 70 
                            ? <StarIcon halfStar={true} active={true} />
                            : <StarIcon halfStar={false} active={true} />
                        : <StarIcon halfStar={false} active={false} />}
                    {props.rating > 80
                        ? props.rating <= 90 
                            ? <StarIcon halfStar={true} active={true} />
                            : <StarIcon halfStar={false} active={true} />
                        : <StarIcon halfStar={false} active={false} />}
                </div>}
        </>
    );

};

export default Title;