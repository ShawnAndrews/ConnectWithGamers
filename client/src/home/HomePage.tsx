import * as React from 'react';

interface IHomePageProps {
    goToRedirect: (URL: string) => void;
}

const HomePage: React.SFC<IHomePageProps> = (props: IHomePageProps) => {
    
    return (
        <div className="menu">
            <div className="menu-scrolling">
                <img src="https://i.imgur.com/10UUUmo.png"/>
                <div className="menu-home-header"/>
                <div className="menu-home-searchgames" onClick={() => { props.goToRedirect("/menu/search"); }}/>
                <div className="menu-home-recentgames" onClick={() => { props.goToRedirect("/menu/recent"); }}/>
                <div className="menu-home-upcominggames" onClick={() => { props.goToRedirect("/menu/upcoming"); }}/>
                <div className="menu-home-populargames" onClick={() => { props.goToRedirect("/menu/platform"); }}/>
                <div className="menu-home-uptodate" onClick={() => { props.goToRedirect("/menu/search"); }}/>
                <div className="menu-home-discover" onClick={() => { props.goToRedirect("/menu/search"); }}/>
                <div className="menu-home-review" onClick={() => { props.goToRedirect("/menu/search"); }}/>
                <div className="menu-home-chatroom" onClick={() => { props.goToRedirect("/chat"); }}/>
                <div className="menu-home-chatroomlinks" onClick={() => { props.goToRedirect("/account"); }}/>
            </div>
        </div>
    );

};

export default HomePage;