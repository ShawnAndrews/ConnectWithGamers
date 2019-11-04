import * as React from 'react';
import { SidenavEnums } from '../../../client-server-common/common';
import FilterContainer from './filter/FilterContainer';
import HomeContainer from './home/HomeContainer';
import XboxContainer from './xbox/XboxContainer';
import PlaystationContainer from './playstation/PlaystationContainer';
import SwitchContainer from './switch/SwitchContainer';
import IosContainer from './ios/IosContainer';
import AndroidContainer from './android/AndroidContainer';

interface IMainProps {
    onSidenavItemClick: (itemEnum: SidenavEnums) => void;
    sidebarActiveEnum: SidenavEnums;
}

const Main: React.SFC<IMainProps> = (props: IMainProps) => {
    
    return (
        <>
            <div className="sidenav align-top d-inline-block text-center">
                <i className={`home fas fa-home cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.home ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.home)}/>
                <i className={`search fas fa-search cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.search ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.search)}/>
                <i className={`discounted fas fa-chart-line cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.discounted ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.discounted)}/>
                <i className={`xbox fab fa-xbox cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.xbox ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.xbox)}/>
                <i className={`playstation fab fa-playstation cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.playstation ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.playstation)}/>
                <i className={`switch fab fa-nintendo-switch cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.switch ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.switch)}/>
                <i className={`ios fab fa-app-store-ios cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.ios ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.ios)}/>
                <i className={`android fab fa-android cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.android ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.android)}/>
                <i className={`news fas fa-newspaper cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.news ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.news)}/>
                <i className={`cog fas fa-cog cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.cog ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.cog)}/>
            </div>
            {props.sidebarActiveEnum !== undefined &&
                <div className={`sidenav-content align-top d-inline-block custom-scrollbar-slim py-2`}>
                    {props.sidebarActiveEnum === SidenavEnums.home && <HomeContainer/>}
                    {props.sidebarActiveEnum === SidenavEnums.search && <FilterContainer/>}
                    {props.sidebarActiveEnum === SidenavEnums.xbox && <XboxContainer/>}
                    {props.sidebarActiveEnum === SidenavEnums.playstation && <PlaystationContainer/>}
                    {props.sidebarActiveEnum === SidenavEnums.switch && <SwitchContainer/>}
                    {props.sidebarActiveEnum === SidenavEnums.ios && <IosContainer/>}
                    {props.sidebarActiveEnum === SidenavEnums.android && <AndroidContainer/>}
                </div>}
        </>
    );
    

}

export default Main;