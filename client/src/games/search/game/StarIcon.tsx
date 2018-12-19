import * as React from 'react';

interface IStarIconProps {
    halfStar: boolean;
    active: boolean;
}

const StarIcon: React.SFC<IStarIconProps> = (props: IStarIconProps) => {
    
    return (
        <img className={props.active ? "active" : "inactive"} width="25px" height="25px" src={props.halfStar ? "https://i.imgur.com/cEKRtdD.png" : "https://i.imgur.com/esrvfbT.png"} alt="Half Star"/>
    );

};

export default StarIcon;