import * as React from 'react';

export enum IosOptionsEnum {
    IOSComingSoon
}

interface IIosProps {
    isSelected: (iosOptionsEnum: IosOptionsEnum) => boolean;
    onOptionClick: (iosOptionsEnum: IosOptionsEnum) => void;
}

const Ios: React.SFC<IIosProps> = (props: IIosProps) => {

    return (
        <div className="ios">
            <div className="px-3 my-3">
                <div className="title mb-2">Browse ios games</div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(IosOptionsEnum.IOSComingSoon) ? 'selected' : ''}`} onClick={() => props.onOptionClick(IosOptionsEnum.IOSComingSoon)}>
                    <i className="fab fa-app-store-ios mr-3"/>
                    IOS Apps Coming Soon
                </div>
            </div>
        </div>
    );

};

export default Ios;
