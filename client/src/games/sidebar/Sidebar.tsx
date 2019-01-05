import * as React from 'react';
import { GamesPresets } from '../../../client-server-common/common';

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
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.popular}`)}>
                        Most Popular
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.recentlyReleased}`)}>
                        Recently Released
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.upcoming}`)}>
                        Upcoming
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/news`)}>
                        News
                    </div>

                    <div className="text-uppercase mt-3">
                        Platforms
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.pc}`)}>
                        PC
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.virtualReality}`)}>
                        Virtual Reality
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.playstation4}`)}>
                        Playstation 4
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.xboxOne}`)}>
                        Xbox One
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.nintendoSwitch}`)}>
                        Nintendo Switch
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.linux}`)}>
                        Linux
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.mac}`)}>
                        Mac
                    </div>

                    <div className="text-uppercase mt-3">
                        Genres
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.action}`)}>
                        Action
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.adventure}`)}>
                        Adventure
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.shooter}`)}>
                        Shooter
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.simulation}`)}>
                        Simulation
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.rpg}`)}>
                        RPG
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.racing}`)}>
                        Racing
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.puzzle}`)}>
                        Puzzle
                    </div>
                    <div className="pl-3 mt-1 cursor-pointer" onClick={() => props.goToRedirect(`/games/search/filter/${GamesPresets.strategy}`)}>
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