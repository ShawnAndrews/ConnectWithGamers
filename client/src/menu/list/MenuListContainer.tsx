import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import MenuList from './MenuList';

export interface IMenuItem {
    name: string;
    faIcons: string[];
    redirectURL: string;
    subMenuItems: IMenuItem[];
}

interface IMenuListContainerProps extends RouteComponentProps<any> { } 

interface IMenuListContainerState {
    menuItems: IMenuItem[];
}

class MenuListContainer extends React.Component<IMenuListContainerProps, IMenuListContainerState> {

    constructor(props: IMenuListContainerProps) {
        super(props);
        this.setDefaultState = this.setDefaultState.bind(this);
        this.goToRedirect = this.goToRedirect.bind(this);
        this.setDefaultState();
    }

    setDefaultState(): void {
        const menuItems: IMenuItem[] = [];

        menuItems.push({
            name: 'Gaming Profiles', faIcons: ['fab fa-twitch fa-2x left-padding', 'fab fa-steam-square fa-2x left-padding', 'fab fa-discord fa-2x left-padding'], redirectURL: '/menu/gaming',
            subMenuItems: null
        });
        menuItems.push({
            name: 'Search Games', faIcons: ['fas fa-search fa-2x left-padding'], redirectURL: '/menu/search',
            subMenuItems: null
        });
        menuItems.push({
            name: 'Platform Exclusive Games', faIcons: ['fas fa-desktop fa-2x left-padding'], redirectURL: null, 
            subMenuItems: [
                {name: 'Steam', faIcons: [], redirectURL: '/menu/platform/6', subMenuItems: null},
                {name: 'Playstation 4', faIcons: [], redirectURL: '/menu/platform/48', subMenuItems: null},
                {name: 'Xbox One', faIcons: [], redirectURL: '/menu/platform/49', subMenuItems: null},
                {name: 'Nintendo Switch', faIcons: [], redirectURL: '/menu/platform/130', subMenuItems: null},
                {name: 'Playstation 3', faIcons: [], redirectURL: '/menu/platform/9', subMenuItems: null},
                {name: 'Xbox 360', faIcons: [], redirectURL: '/menu/platform/12', subMenuItems: null},
                {name: 'Nintendo 64', faIcons: [], redirectURL: '/menu/platform/18', subMenuItems: null},
                {name: 'Nintendo 3DS', faIcons: [], redirectURL: '/menu/platform/37', subMenuItems: null}
            ]
        });
        menuItems.push({
            name: 'Upcoming Games', faIcons: ['fa fa-calendar-alt fa-2x left-padding'], redirectURL: '/menu/upcoming',
            subMenuItems: null
        });
        menuItems.push({
            name: 'Recently Released Games', faIcons: ['far fa-clock fa-2x left-padding'], redirectURL: '/menu/recent',
            subMenuItems: null
        });
        menuItems.push({
            name: 'Genres', faIcons: ['fas fa-gamepad fa-2x left-padding'], redirectURL: '/menu/genre',
            subMenuItems: [
                {name: 'Real Time Strategy (RTS)', faIcons: [], redirectURL: '/menu/genre/11', subMenuItems: null},
                {name: 'Puzzle', faIcons: [], redirectURL: '/menu/genre/9', subMenuItems: null},
                {name: 'Hack and slash/Beat em up', faIcons: [], redirectURL: '/menu/genre/25', subMenuItems: null},
                {name: 'Pinball', faIcons: [], redirectURL: '/menu/genre/30', subMenuItems: null},
                {name: 'Role-playing (RPG)', faIcons: [], redirectURL: '/menu/genre/12', subMenuItems: null},
                {name: 'Adventure', faIcons: [], redirectURL: '/menu/genre/31', subMenuItems: null},
                {name: 'Shooter', faIcons: [], redirectURL: '/menu/genre/5', subMenuItems: null},
                {name: 'Music', faIcons: [], redirectURL: '/menu/genre/7', subMenuItems: null},
                {name: 'Point-and-click', faIcons: [], redirectURL: '/menu/genre/2', subMenuItems: null},
                {name: 'Simulator', faIcons: [], redirectURL: '/menu/genre/13', subMenuItems: null},
                {name: 'Quiz/Trivia', faIcons: [], redirectURL: '/menu/genre/26', subMenuItems: null},
                {name: 'Arcade', faIcons: [], redirectURL: '/menu/genre/33', subMenuItems: null},
                {name: 'Tactical', faIcons: [], redirectURL: '/menu/genre/24', subMenuItems: null},
                {name: 'Fighting', faIcons: [], redirectURL: '/menu/genre/4', subMenuItems: null},
                {name: 'Strategy', faIcons: [], redirectURL: '/menu/genre/15', subMenuItems: null},
                {name: 'Turn-based strategy (TBS)', faIcons: [], redirectURL: '/menu/genre/16', subMenuItems: null},
                {name: 'Platform', faIcons: [], redirectURL: '/menu/genre/8', subMenuItems: null},
                {name: 'Racing', faIcons: [], redirectURL: '/menu/genre/10', subMenuItems: null},
                {name: 'Sport', faIcons: [], redirectURL: '/menu/genre/14', subMenuItems: null},
                {name: 'Indie', faIcons: [], redirectURL: '/menu/genre/32', subMenuItems: null}
            ]
        });
        menuItems.push({
            name: 'Chatroom', faIcons: ['fas fa-comments fa-2x left-padding'], redirectURL: '/chat',
            subMenuItems: null
        });
        menuItems.push({
            name: 'Account Settings', faIcons: ['fas fa-cog fa-2x left-padding'], redirectURL: '/account',
            subMenuItems: null
        });

        this.state = { menuItems: menuItems };
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