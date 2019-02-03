import * as React from 'react';
import { Paper } from '@material-ui/core';
import { SidenavEnums } from '../../../client-server-common/common';
import FilterContainer from './filter/FilterContainer';

interface IMainProps {
    onSidenavItemClick: (itemEnum: SidenavEnums) => void;
    sidebarActiveEnum: SidenavEnums;
}

const Main: React.SFC<IMainProps> = (props: IMainProps) => {
    
    return (
        <>
            <Paper className="sidenav align-top d-inline-block text-center" elevation={24}>
                <i className={`home fas fa-home cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.home ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.home)}/>
                <i className={`search fas fa-search cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.search ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.search)}/>
                <i className={`discounted fas fa-money-bill-alt cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.discounted ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.discounted)}/>
                <i className={`news fas fa-newspaper cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.news ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.news)}/>
                <i className={`cog fas fa-cog cursor-pointer color-tertiary ${props.sidebarActiveEnum === SidenavEnums.cog ? 'active': ''}`} onClick={() => props.onSidenavItemClick(SidenavEnums.cog)}/>
            </Paper>
            {props.sidebarActiveEnum !== undefined &&
                 <div className={`sidenav-content align-top d-inline-block custom-scrollbar-slim`}>
                    {props.sidebarActiveEnum === SidenavEnums.search && <FilterContainer/>}
                 </div>}
        </>
    );
    

}

export default Main;