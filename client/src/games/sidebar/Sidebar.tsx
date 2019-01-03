import * as React from 'react';

interface ISidebarProps {
    goToRedirect: (URL: string) => void;
    onSearchKeypress: (event: React.KeyboardEvent<Element>) => void;
    onSearchQueryChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
    sidebarExpanded: boolean;
}

const Sidebar: React.SFC<ISidebarProps> = (props: ISidebarProps) => {

    return (
        <div className={`sidebar d-inline-block align-top ${props.sidebarExpanded ? 'active' : ''}`}>
            {props.sidebarExpanded &&
                <div className="list w-75 mx-auto my-5">
                    <div className="searchbar-title text-center h4 mb-2">
                        Search
                    </div>
                    <div className="searchbar w-100 has-search mb-4">
                        <span className="fa fa-search form-control-feedback"/>
                        <input type="text" className="form-control" placeholder="Search games" onChange={props.onSearchQueryChanged} onKeyPress={props.onSearchKeypress} />
                    </div>
                    
                    <div className="text-uppercase">
                        Browse Categories
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/popular`)}>
                        Most Popular
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/recent`)}>
                        Recently Released
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/upcoming`)}>
                        Upcoming
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/news`)}>
                        News
                    </div>

                    <div className="text-uppercase mt-3">
                        Platforms
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?platforms=6`)}>
                        PC
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?platforms=162,165`)}>
                        Virtual Reality
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?platforms=48`)}>
                        Playstation 4
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?platforms=49`)}>
                        Xbox One
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?platforms=130`)}>
                        Nintendo Switch
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?platforms=3`)}>
                        Linux
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?platforms=14`)}>
                        Mac
                    </div>

                    <div className="text-uppercase mt-3">
                        Genres
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?genres=14`)}>
                        Action
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?genres=31`)}>
                        Adventure
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?genres=5`)}>
                        Shooter
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?genres=13`)}>
                        Simulation
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?genres=12`)}>
                        RPG
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?genres=10`)}>
                        Racing
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?genres=9`)}>
                        Puzzle
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/?genres=15,16,11`)}>
                        Strategy
                    </div>

                    <div className="text-uppercase mt-3 cursor-pointer" onClick={() => props.goToRedirect(`/games/gaming`)}>
                        Profiles
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/gaming/twitch`)}>
                        Twitch
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/gaming/steam`)}>
                        Steam
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/gaming/discord`)}>
                        Discord
                    </div>
                </div>}
        </div>
    );

};

export default Sidebar;