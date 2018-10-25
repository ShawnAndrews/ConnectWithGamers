import * as React from 'react';

interface IHomePageProps {
    goToRedirect: (URL: string) => void;
}

const HomePage: React.SFC<IHomePageProps> = (props: IHomePageProps) => {
    
    return (
        <div className="homepage">
            <div className="homepage-scrolling">
                <img src="https://i.imgur.com/10UUUmo.png"/>
                <div className="homepage-home-header"/>
                <div className="homepage-home-searchgames" onClick={() => { props.goToRedirect("/menu/search"); }}/>
                <div className="homepage-home-recentgames" onClick={() => { props.goToRedirect("/menu/search/recent"); }}/>
                <div className="homepage-home-upcominggames" onClick={() => { props.goToRedirect("/menu/search/upcoming"); }}/>
                <div className="homepage-home-populargames" onClick={() => { props.goToRedirect("/menu/search/popular"); }}/>
                <div className="homepage-home-uptodate" onClick={() => { props.goToRedirect("/menu/search"); }}/>
                <div className="homepage-home-discover" onClick={() => { props.goToRedirect("/menu/search"); }}/>
                <div className="homepage-home-review" onClick={() => { props.goToRedirect("/menu/search"); }}/>
                <div className="homepage-home-chatroom" onClick={() => { props.goToRedirect("/chat"); }}/>
                <div className="homepage-home-chatroomlinks" onClick={() => { props.goToRedirect("/menu/gaming"); }}/>
            </div>
        </div>
    );

};

export default HomePage;