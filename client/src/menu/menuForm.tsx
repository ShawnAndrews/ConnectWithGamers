import * as React from 'react';
import { Route, Switch } from 'react-router-dom';
import { withRouter } from 'react-router-dom';

interface IMenuFormProps {
    history: any;
}

class MenuForm extends React.Component<IMenuFormProps, any> {

    constructor(props: IMenuFormProps) {
        super(props);
    }

    render() {

        return (
            <div>
                <div className="menu-item" onClick={() => this.props.history.push('/menu/search')}>
                    <div className="menu-item-overlay"/>
                    <div className="menu-item-content">
                        <i className="fas fa-search fa-4x"/>
                        <p>Search Games</p>
                    </div>
                </div>
                <div className="menu-item" onClick={() => this.props.history.push('/menu/upcoming')}>
                    <div className="menu-item-overlay"/>
                    <div className="menu-item-content">
                        <i className="fa fa-calendar-alt fa-4x"/>
                        <p>Upcoming Games</p>
                    </div>
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    <div className="menu-item-content">
                        <i className="fas fa-gamepad fa-4x"/>
                        <p>Recently Released</p>
                    </div>
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    <div className="menu-item-content">
                        <i className="fa fa-chart-line fa-4x"/>
                        <p>Most Popular Games</p>
                    </div>
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    <div className="menu-item-content">
                        <i className="far fa-star fa-4x"/>
                        <p>Highest Rated</p>
                    </div>
                </div>
                <div className="menu-item">
                    <div className="menu-item-overlay"/>
                    <div className="menu-item-content">
                        <i className="fas fa-desktop fa-4x"/>
                        <p>By Platform</p>
                    </div>
                </div>
            </div>
        );

    }

}

export default withRouter(MenuForm);