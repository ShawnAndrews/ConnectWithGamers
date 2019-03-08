import * as React from 'react';

export enum XboxOptionsEnum {
    MostPopular
}

interface IXboxProps {
    isSelected: (xboxOptionsEnum: XboxOptionsEnum) => boolean;
    onOptionClick: (xboxOptionsEnum: XboxOptionsEnum) => void;
}

const Xbox: React.SFC<IXboxProps> = (props: IXboxProps) => {

    return (
        <div className="xbox">
            <div className="px-3 my-3">
                <div className="title mb-2">Browse xbox games</div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(XboxOptionsEnum.MostPopular) ? 'selected' : ''}`} onClick={() => props.onOptionClick(XboxOptionsEnum.MostPopular)}>
                    <i className="fas fa-fire mr-3"/>
                    Most Popular
                </div>
            </div>
        </div>
    );

};

export default Xbox;
