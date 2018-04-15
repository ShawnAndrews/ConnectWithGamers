import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { IPlatformMenuItem } from './PlatformGameListContainer';

interface IPlatformGameListProps {
    platformMenuItems: IPlatformMenuItem[];
    goToPlatform: (platformId: number) => void;
}

const PlatformGameList: React.SFC<IPlatformGameListProps> = (props: IPlatformGameListProps) => {

    return (
        <div>
            {props.platformMenuItems && props.platformMenuItems
                .map((x: IPlatformMenuItem) => {
                    return (
                        <div key={x.imgSrc} className="menu-item" onClick={() => { props.goToPlatform(x.platformOption.id); }}>
                            <div className="menu-item-overlay"/>
                            <div className="menu-item-content">
                                <img src={x.imgSrc}/>
                            </div>
                        </div>
                    );
                })}
        </div>
    );   

};

export default PlatformGameList;