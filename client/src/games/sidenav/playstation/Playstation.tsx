import * as React from 'react';

export enum PlaystationOptionsEnum {
    MostPopular
}

interface IPlaystationProps {
    isSelected: (playstationOptionsEnum: PlaystationOptionsEnum) => boolean;
    onOptionClick: (playstationOptionsEnum: PlaystationOptionsEnum) => void;
}

const playstation: React.SFC<IPlaystationProps> = (props: IPlaystationProps) => {

    return (
        <div className="playstation">
            <div className="px-3 my-3">
                <div className="title mb-2">Browse playstation games</div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(PlaystationOptionsEnum.MostPopular) ? 'selected' : ''}`} onClick={() => props.onOptionClick(PlaystationOptionsEnum.MostPopular)}>
                    <i className="fas fa-fire mr-3"/>
                    Most Popular
                </div>
            </div>
        </div>
    );

};

export default playstation;
