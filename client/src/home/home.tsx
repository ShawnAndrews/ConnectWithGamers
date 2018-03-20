import * as React from 'react';

class Home extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

    render() {

        return (
            <div className="menu">
                <img src="https://i.imgur.com/10UUUmo.png"/>
                <div className="menu-home">
                    <a href="/menu/search" className="menu-home-searchgames"><div/></a>
                    <a href="/menu/recent" className="menu-home-recentgames"><div/></a>
                    <a href="/menu/upcoming" className="menu-home-upcominggames"><div/></a>
                    <a href="/menu/platform" className="menu-home-populargames"><div/></a>
                    <a href="/menu/search" className="menu-home-uptodate"><div/></a>
                    <a href="/menu/search" className="menu-home-discover"><div/></a>
                    <a href="/menu/search" className="menu-home-review"><div/></a>
                    <a href="/menu/chat" className="menu-home-chatroom"><div/></a>
                    <a href="/menu/account" className="menu-home-chatroomlinks"><div/></a>
                </div>
            </div>
        );

    }

}

export default Home;