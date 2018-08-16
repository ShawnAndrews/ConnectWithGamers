import * as React from 'react';
import { IMenuItem } from './MenuListContainer';
import FooterIcons from '../../account/footer/footerIcons';

interface IMenuListProps {
    menuItems: IMenuItem[];
    goToRedirect: (URL: string) => void;
}

const MenuList: React.SFC<IMenuListProps> = (props: IMenuListProps) => {

    return (
        <div className="menu-items">
            <nav className="nav" role="navigation">
                <ul className="nav__list">
                    {props.menuItems && props.menuItems
                        .map((x: IMenuItem, menuIndex: number) => {
                            return (
                                <li key={x.name}>
                                    <input id={`group-${menuIndex}`} type="checkbox" hidden={true} />
                                    <label htmlFor={`group-${menuIndex}`} onClick={x.subMenuItems ? () => {} : () => { props.goToRedirect(x.redirectURL); }} >
                                        {x.subMenuItems && <span className="fa fa-angle-right arrow"/>}
                                        <div>
                                            {x.faIcons
                                                .map((iconClass: string) => {
                                                    return (
                                                        <i key={iconClass} className={iconClass}/>
                                                    );
                                                })}
                                            <span className="group-name">{x.name}</span>
                                        </div>
                                    </label>
                                    <ul className="group-list">
                                        {x.subMenuItems && x.subMenuItems
                                            .map((y: IMenuItem) => {
                                                return (
                                                    <li key={y.name}>
                                                        <label onClick={() => { props.goToRedirect(y.redirectURL); }}>
                                                            {y.faIcons
                                                                .map((subIconClass: string) => {
                                                                    return (
                                                                        <i key={subIconClass} className={subIconClass}/>
                                                                    );
                                                                })}
                                                            <span className="sub-group-name">{y.name}</span>
                                                        </label>
                                                    </li>
                                                );
                                            })}
                                    </ul>
                                </li>
                            );
                        })}
                </ul>
            </nav>
            <footer>
                <FooterIcons/>
            </footer>
        </div>
    );

};

export default MenuList;