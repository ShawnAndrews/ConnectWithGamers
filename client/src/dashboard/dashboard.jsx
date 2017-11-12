import * as React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {withRouter} from "react-router-dom";
import { Route, Switch } from 'react-router-dom';
import { ERR_LEVEL, log } from '../util/error';
import PropTypes from 'prop-types';

// interface IDashboardComponentProps {
//     history;
// }
//
// interface MenuItem {
//     label: string,
//     link: string
// }

const styles = {
    title: {
        textAlign: 'center',
        backgroundColor: '#00BCD4',
    },
    iconRoot: {

    },
    iconColor: {
        color: 'white'
    }
};


class Dashboard extends React.Component {

    constructor(props){
        super(props);
        
        this.state = {
            Pages: [
                {route: '/', menuItems: []},
                {route: '/login', menuItems: []},
            ]
        };
    }

    componentWillMount() {
        this.addMenuItem('/login', {label: 'Help', link: '/help'});

        this.addMenuItem('/', {label: 'Charts', link: '/charts'});
        this.addMenuItem('/', {label: 'Logout', link: '/logout'});
        this.addMenuItem('/', {label: 'Help', link: '/help'});

    }

    addMenuItem(route, item) {

        let currentRoutesMenuItems = null;

        // get route's menu items
        for(let page of this.state.Pages){
            if(page.route == route){
                currentRoutesMenuItems = page.menuItems;
                break;
            }
        }

        // error check - route not found
        if(!currentRoutesMenuItems)
            log('Route not found', ERR_LEVEL.HIGH);

        // add menu time
        currentRoutesMenuItems.push(item);
    }

    deleteMenuItem(route, item) {

        let currentRoutesMenuItems = null;
        let indexOfMenuItem = -1;

        // find route
        for(let page of this.state.Pages){
            if(page.route == route){
                currentRoutesMenuItems = page.menuItems;
                break;
            }
        }

        // error check - route not found
        if(!currentRoutesMenuItems)
            log('Route not found', ERR_LEVEL.HIGH);

        // find index of menu item
        for(let menuItemIndex in currentRoutesMenuItems){
            if(JSON.stringify(currentRoutesMenuItems[menuItemIndex]) == JSON.stringify(item)){
                indexOfMenuItem = parseInt(menuItemIndex);
                break;
            }
        }

        // error check - menu item not found
        if(indexOfMenuItem == -1)
            log('Menu item not found', ERR_LEVEL.HIGH, indexOfMenuItem);

        // delete element
        currentRoutesMenuItems.splice(indexOfMenuItem, 1);
    }

    renderRoutesMenuItems(route) {

        let menuItemElements = [];
        let currentRoutesMenuItems = null;

        // set page's menu items
        for(let page of this.state.Pages){
            if(page.route == route) {
                currentRoutesMenuItems = page.menuItems;
                break;
            }
        }

        // error check - route not found
        if(!currentRoutesMenuItems)
            return null;

        // add all menu items as elements
        for(let menuItem of currentRoutesMenuItems)
            menuItemElements.push(<MenuItem primaryText={menuItem.label} onClick={() => this.props.history.push(menuItem.link)} />);

        return menuItemElements;

    };

  render() {
    console.log("Dashboard rendered with props ", this.props);
    return (
      <div>
        <MuiThemeProvider>
            <AppBar
                title={<span>Dashboard</span>}
                style={styles.title}
                iconElementLeft={
                    <IconMenu
                        style={styles.iconRoot}
                        iconStyle={styles.iconColor}
                        iconButtonElement={
                            <IconButton>
                                <MoreVertIcon />
                            </IconButton>
                        }
                        targetOrigin={{horizontal: 'left', vertical: 'top'}}
                        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
                    >
                        <Route exact path='/' render={(props) => this.renderRoutesMenuItems('/') }/>
                        <Route exact path='/login' render={(props) => this.renderRoutesMenuItems('/login') }/>
                    </IconMenu>
                }
            />
        </MuiThemeProvider>
      </div>
    );
  }

}

Dashboard.propTypes = {
    history: PropTypes.object.isRequired,
}

export default withRouter(Dashboard);