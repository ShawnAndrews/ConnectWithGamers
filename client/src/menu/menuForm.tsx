import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

interface IMenuItem {
    name: string;
    faIcon: string;
    redirectURL: string;
}

interface IMenuFormProps {
    history: any;
}

class MenuForm extends React.Component<IMenuFormProps, any> {

    constructor(props: IMenuFormProps) {
        super(props);
        this.setDefaultState = this.setDefaultState.bind(this);
        this.setDefaultState();
    }

    private setDefaultState(): void {
        const menuItems: IMenuItem[] = [];

        menuItems.push({name: 'Search Games', faIcon: 'fas fa-search fa-4x', redirectURL: '/menu/search'});
        menuItems.push({name: 'Exclusive Platform Games', faIcon: 'fas fa-desktop fa-4x', redirectURL: '/menu/platform'});
        menuItems.push({name: 'Upcoming Games', faIcon: 'fa fa-calendar-alt fa-4x', redirectURL: '/menu/upcoming'});
        menuItems.push({name: 'Recently Released Games', faIcon: 'far fa-clock fa-4x', redirectURL: '/menu/recent'});
        menuItems.push({name: 'Genres', faIcon: 'fas fa-gamepad fa-4x', redirectURL: '/menu/genre'});

        this.state = {menuItems: menuItems};
    }

    render() {

        return (
            <div>
                {this.state.menuItems && this.state.menuItems
                    .map((x: IMenuItem) => {
                        return (
                            <div key={x.name} className="menu-item" onClick={() => this.props.history.push(x.redirectURL)}>
                                <div className="menu-item-overlay"/>
                                <div className="menu-item-content">
                                    <i className={x.faIcon}/>
                                    <p>{x.name}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>
        );

    }

}

export default withRouter(MenuForm);