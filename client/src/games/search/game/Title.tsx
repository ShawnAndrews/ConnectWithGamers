import * as React from 'react';
import StarIcon from './StarIcon';

interface ITitleProps {
    name: string;
    rating: number;   
}

const Title: React.SFC<ITitleProps> = (props: ITitleProps) => {

    return (
        <div className="name color-primary py-1">
            {props.name}
            {props.rating && 
                <div className="stars d-inline-block ml-3">
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
        </div>
    );

};

export default Title;