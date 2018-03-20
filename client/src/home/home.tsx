import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface IHomeProps {
    history: any;
}

class Home extends React.Component<IHomeProps, any> {

    constructor(props: IHomeProps) {
        super(props);
    }

    render() {

        return (
            <div className="menu">
                <img src="https://i.imgur.com/10UUUmo.png"/>
                <div className="menu-home">
                    <div className="menu-home-searchgames" onClick={() => { this.props.history.push("/menu/search"); }}/>
                    <div className="menu-home-recentgames" onClick={() => { this.props.history.push("/menu/recent"); }}/>
                    <div className="menu-home-upcominggames" onClick={() => { this.props.history.push("/menu/upcoming"); }}/>
                    <div className="menu-home-populargames" onClick={() => { this.props.history.push("/menu/platform"); }}/>
                    <div className="menu-home-uptodate" onClick={() => { this.props.history.push("/menu/search"); }}/>
                    <div className="menu-home-discover" onClick={() => { this.props.history.push("/menu/search"); }}/>
                    <div className="menu-home-review" onClick={() => { this.props.history.push("/menu/search"); }}/>
                    <div className="menu-home-chatroom" onClick={() => { this.props.history.push("/menu/chat"); }}/>
                    <div className="menu-home-chatroomlinks" onClick={() => { this.props.history.push("/menu/account"); }}/>
                </div>
            </div>
        );

    }

}

export default withRouter(Home);