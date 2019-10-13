import * as React from 'react';
import { IdNamePair } from '../../../../client-server-common/common';
import { Tooltip } from '@material-ui/core';

interface IFeaturesProps {
    features: IdNamePair[];
    handleFeaturesClick: (index: number) => void;
}

const Features: React.SFC<IFeaturesProps> = (props: IFeaturesProps) => {

    return (
        <div className="features color-secondary mt-2">
            <div className="title mb-2 mt-3">Features</div>
            {props.features
                .map((modeInfo: IdNamePair) => {
                    const defaultIcon: boolean = modeInfo.name.includes(`Single`) || modeInfo.name.includes(`Multi`) || modeInfo.name.includes(`Achievements`) || modeInfo.name.includes(`Controller`) || modeInfo.name.includes(`Remote`) || modeInfo.name.includes(`Stats`) || modeInfo.name.includes(`Mods`) || modeInfo.name.includes(`Co-op`) || modeInfo.name.includes(`Captions`) || modeInfo.name.includes(`Screen`) || modeInfo.name.includes(`Anti-Cheat`);
                    return (
                        <div className="entry w-100">
                            <div className="entry-icon d-inline-block"><i className={`${modeInfo.name.includes(`Single`) ? `fas fa-user` : ``}${modeInfo.name.includes(`Multi`) ? `fas fa-users` : ``}${modeInfo.name.includes(`Achievements`) ? `fas fa-trophy` : ``}${modeInfo.name.includes(`Controller`) ? `fas fa-gamepad` : ``}${modeInfo.name.includes(`Remote`) ? `fas fa-tv` : ``}${modeInfo.name.includes(`Stats`) ? `fas fa-chart-bar` : ``}${modeInfo.name.includes(`Mods`) ? `fas fa-cogs` : ``}${modeInfo.name.includes(`Co-op`) ? `fas fa-users` : ``}${modeInfo.name.includes(`Captions`) ? `fas fa-closed-captioning` : ``}${modeInfo.name.includes(`Screen`) ? `fas fa-tv` : ``}${modeInfo.name.includes(`Anti-Cheat`) ? `fas fa-bug` : ``}${!defaultIcon ? `far fa-star` : ``}`}/></div>
                            <div className="entry-name d-inline-block">{modeInfo.name}</div>
                        </div>
                    );
                })}
        </div>
    );

};

export default Features;