import * as React from 'react';

export enum AndroidOptionsEnum {
    AndroidComingSoon
}

interface IAndroidProps {
    isSelected: (androidOptionsEnum: AndroidOptionsEnum) => boolean;
    onOptionClick: (androidOptionsEnum: AndroidOptionsEnum) => void;
}

const Android: React.SFC<IAndroidProps> = (props: IAndroidProps) => {

    return (
        <div className="android">
            <div className="px-3 my-3">
                <div className="title mb-2">Browse android games</div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(AndroidOptionsEnum.AndroidComingSoon) ? 'selected' : ''}`} onClick={() => props.onOptionClick(AndroidOptionsEnum.AndroidComingSoon)}>
                    <i className="fab fa-google-play mr-3"/>
                    Android Apps Coming Soon
                </div>
            </div>
        </div>
    );

};

export default Android;
