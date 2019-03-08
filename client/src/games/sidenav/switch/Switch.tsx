import * as React from 'react';

export enum SwitchOptionsEnum {
    MostPopular
}

interface ISwitchProps {
    isSelected: (switchOptionsEnum: SwitchOptionsEnum) => boolean;
    onOptionClick: (switchOptionsEnum: SwitchOptionsEnum) => void;
}

const Switch: React.SFC<ISwitchProps> = (props: ISwitchProps) => {

    return (
        <div className="switch">
            <div className="px-3 my-3">
                <div className="title mb-2">Browse switch games</div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(SwitchOptionsEnum.MostPopular) ? 'selected' : ''}`} onClick={() => props.onOptionClick(SwitchOptionsEnum.MostPopular)}>
                    <i className="fas fa-fire mr-3"/>
                    Most Popular
                </div>
            </div>
        </div>
    );

};

export default Switch;
