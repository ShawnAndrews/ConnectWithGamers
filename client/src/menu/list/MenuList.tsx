import * as React from 'react';
import { IMenuItem } from './MenuListContainer';

interface IMenuListProps {
    menuItems: IMenuItem[];
    goToRedirect: (URL: string) => void;
}

const MenuList: React.SFC<IMenuListProps> = (props: IMenuListProps) => {

    return (
        <div>
            {props.menuItems && props.menuItems
                .map((x: IMenuItem) => {
                    return (
                        <div key={x.name} className="menu-item" onClick={() => { props.goToRedirect(x.redirectURL); }}>
                            <div className="menu-item-overlay"/>
                            <div className="menu-item-content">
                                {x.faIcons
                                    .map((iconClass: string) => {
                                        return (
                                            <i key={iconClass} className={iconClass}/>
                                        );
                                    })}
                                <p>{x.name}</p>
                            </div>
                        </div>
                    );
                })}
        </div>
    );

};

export default MenuList;