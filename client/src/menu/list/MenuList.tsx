import * as React from 'react';
import { IMenuItem } from './MenuListContainer';
import RecentGameListContainer from '../recent/RecentGameListContainer';
import PopularGameListContainer from '../popular/PopularGameListContainer';
import UpcomingGameListContainer from '../upcoming/UpcomingGameListContainer';

interface IMenuListProps {
    menuItems: IMenuItem[];
    goToRedirect: (URL: string) => void;
}

const MenuList: React.SFC<IMenuListProps> = (props: IMenuListProps) => {

    return (
        <div className="menu-items">
            <nav className="nav" role="navigation">
                <PopularGameListContainer
                    count={10}
                />
                <div className="menu-recent-upcoming-container">
                    <RecentGameListContainer
                        count={10}
                    />
                    <UpcomingGameListContainer
                        count={10}
                    />
                </div>
            </nav>
        </div>
    );

};

export default MenuList;