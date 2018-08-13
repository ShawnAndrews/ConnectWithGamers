const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import MenuList from './MenuList';

export interface IMenuItem {
    name: string;
    faIcons: string[];
    redirectURL: string;
}

interface IMenuListContainerProps extends RouteComponentProps<any> { } 

class MenuListContainer extends React.Component<IMenuListContainerProps, any> {

    constructor(props: IMenuListContainerProps) {
        super(props);
        this.setDefaultState = this.setDefaultState.bind(this);
        this.goToRedirect = this.goToRedirect.bind(this);
        this.setDefaultState();
    }

    setDefaultState(): void {
        const menuItems: IMenuItem[] = [];

        menuItems.push({name: 'Gaming Profiles', faIcons: ['fab fa-twitch fa-4x', 'fab fa-steam-square fa-4x', 'fab fa-discord fa-4x'], redirectURL: '/menu/gaming'});
        menuItems.push({name: 'Search Games', faIcons: ['fas fa-search fa-4x'], redirectURL: '/menu/search'});
        menuItems.push({name: 'Platform Exclusive Games', faIcons: ['fas fa-desktop fa-4x'], redirectURL: '/menu/platform'});
        menuItems.push({name: 'Upcoming Games', faIcons: ['fa fa-calendar-alt fa-4x'], redirectURL: '/menu/upcoming'});
        menuItems.push({name: 'Recently Released Games', faIcons: ['far fa-clock fa-4x'], redirectURL: '/menu/recent'});
        menuItems.push({name: 'Genres', faIcons: ['fas fa-gamepad fa-4x'], redirectURL: '/menu/genre'});

        this.state = {menuItems: menuItems};
    }

    goToRedirect(URL: string): void {
        this.props.history.push(URL);
    }

    render() {
        return (
            <MenuList
                menuItems={this.state.menuItems}
                goToRedirect={this.goToRedirect}
            />
        );
    }

}

export default withRouter(MenuListContainer);