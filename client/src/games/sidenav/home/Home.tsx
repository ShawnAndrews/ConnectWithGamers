import * as React from 'react';
import { SnackbarContent, IconButton } from '@material-ui/core';

export enum HomeOptionsEnum {
    Home,
    MostPopular,
    RecentlyReleased,
    Upcoming,
    Genres,
    GenreAction, GenreAdventure, GenreCasual, GenreStrategy, GenreRacing, GenreSimulation, GenreSports, GenreIndie, Genre2D, GenrePuzzle, GenreShooter, GenreRTS, GenreTowerDefence,
    WeeklyDeals,
    CompetitiveMultiplayer,
    FreeMultiplayer,
    PaidMultiplayer,
    MostDifficult,
    Horror,
    VRSupported,
    VRHTC, VROculus, VRWindows, VRAll,
    MOBO,
    EarlyAccess,
    OpenWorld,
    FPS,
    Cards,
    MMORPG,
    Survival
}

interface IHomeProps {
    isSelected: (homeOptionEnum: HomeOptionsEnum) => boolean;
    onOptionClick: (homeOptionEnum: HomeOptionsEnum) => void;
    onClickBreakingNews: (link: string) => void;
    onClickBreakingNewsCollapse: () => void;
    breakingNewsClickCollapsed: boolean;
    breakingNewsGameName: string;
    breakingNewsGameId: number;
    genresExpanded: boolean;
    vrExpanded: boolean;
}

const Home: React.SFC<IHomeProps> = (props: IHomeProps) => {

    return (
        <div className="home">
            <SnackbarContent
                className={`breaking-news ${props.breakingNewsClickCollapsed && `collapsed`} mx-auto px-3 py-1`}
                message={
                    <span>
                        Check out the new steam game <u className="cursor-pointer" onClick={() => props.onClickBreakingNews(`search/game/${props.breakingNewsGameId}`)}>{props.breakingNewsGameName}</u> releasing this summer!
                    </span>
                }
                action={[
                    <IconButton
                        key="close"
                        aria-label="Close"
                        color="inherit"
                        onClick={() => props.onClickBreakingNewsCollapse()}
                    >
                        <i className="fas fa-times"/>
                    </IconButton>,
                ]}
                
            />
            <div className="px-3 my-3">
                <div className={`option py-1 px-2 my-1 mb-2 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.Home) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.Home)}>
                    <i className="fas fa-home mr-3"/>
                    Home
                </div>
                <div className="title mb-2">Categories</div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.MostPopular) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.MostPopular)}>
                    <i className="fas fa-fire mr-3"/>
                    Most Popular
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.RecentlyReleased) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.RecentlyReleased)}>
                    <i className="far fa-calendar-alt mr-3"/>
                    Recently Released
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.Upcoming) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.Upcoming)}>
                    <i className="far fa-clock mr-3"/>
                    Upcoming
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.EarlyAccess) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.EarlyAccess)}>
                    <i className="fab fa-earlybirds mr-3"/>
                    Early Access
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.WeeklyDeals) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.WeeklyDeals)}>
                    <i className="far fa-calendar-alt mr-3"/>
                    Weekly Deals
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.CompetitiveMultiplayer) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.CompetitiveMultiplayer)}>
                    <i className="fas fa-users mr-3"/>
                    Competitive Multiplayer
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.FreeMultiplayer) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.FreeMultiplayer)}>
                    <i className="far fa-smile mr-3"/>
                    Free Multiplayer
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.PaidMultiplayer) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.PaidMultiplayer)}>
                    <i className="fas fa-dollar-sign mr-3"/>
                    Paid Multiplayer
                </div>
                <div className="title mb-2">Genres</div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.MostDifficult) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.MostDifficult)}>
                    <i className="fas fa-exclamation-circle mr-3"/>
                    Most Difficult
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.Horror) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.Horror)}>
                    <i className="fas fa-ghost mr-3"/>
                    Horror
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.VRSupported) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.VRSupported)}>
                    <i className="fas fa-align-justify mr-3"/>
                    VR Supported
                    <i className={`fas ${props.vrExpanded ? 'fa-chevron-left' : 'fa-chevron-right'} arrow float-right`}/>
                </div>
                {props.vrExpanded && 
                    <>
                        <div className={`option py-1 px-2 my-1 ml-4 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.VRHTC) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.VRHTC)}>
                            <i className="fas fa-vr-cardboard mr-3"/>
                            <span>HTC Vive</span>
                        </div>
                        <div className={`option py-1 px-2 my-1 ml-4 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.VROculus) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.VROculus)}>
                            <i className="fas fa-vr-cardboard mr-3"/>
                            <span>Oculus Rift</span>
                        </div>
                        <div className={`option py-1 px-2 my-1 ml-4 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.VRWindows) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.VRWindows)}>
                            <i className="fas fa-vr-cardboard mr-3"/>
                            <span>Windows Mixed Reality</span>
                        </div>
                        <div className={`option py-1 px-2 my-1 ml-4 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.VRAll) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.VRAll)}>
                            <i className="fas fa-boxes mr-3"/>
                            <span>All</span>
                        </div>
                    </>}
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreAction) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreAction)}>
                    <i className="fas fa-user-ninja mr-3"/>
                    <span>Action</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreAdventure) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreAdventure)}>
                    <i className="fas fa-hiking mr-3"/>
                    <span>Adventure</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreCasual) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreCasual)}>
                    <i className="fas fa-walking mr-3"/>
                    <span>Casual</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreStrategy) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreStrategy)}>
                    <i className="far fa-map mr-3"/>
                    <span>Strategy</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreRacing) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreRacing)}>
                    <i className="fas fa-car mr-3"/>
                    <span>Racing</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreSimulation) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreSimulation)}>
                    <i className="fas fa-robot mr-3"/>
                    <span>Simulation</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreSports) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreSports)}>
                    <i className="fas fa-snowboarding mr-3"/>
                    <span>Sports</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreIndie) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreIndie)}>
                    <i className="fas fa-user mr-3"/>
                    <span>Indie</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.Genre2D) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.Genre2D)}>
                    <i className="fas fa-cube mr-3"/>
                    <span>2D</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenrePuzzle) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenrePuzzle)}>
                    <i className="fas fa-puzzle-piece mr-3"/>
                    <span>Puzzle</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreShooter) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreShooter)}>
                    <i className="fas fa-fighter-jet mr-3"/>
                    <span>Shooter</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreRTS) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreRTS)}>
                    <i className="fas fa-headset mr-3"/>
                    <span>RTS</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.GenreTowerDefence) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.GenreTowerDefence)}>
                    <i className="fas fa-gopuram mr-3"/>
                    <span>Tower Defence</span>
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.MOBO) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.MOBO)}>
                    <i className="fas fa-dungeon mr-3"/>
                    MOBA
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.OpenWorld) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.OpenWorld)}>
                    <i className="fas fa-globe-americas mr-3"/>
                    Open World
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.FPS) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.FPS)}>
                    <i className="fas fa-gamepad mr-3"/>
                    FPS
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.Cards) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.Cards)}>
                    <i className="fas fa-id-badge mr-3"/>
                    Card games
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.MMORPG) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.MMORPG)}>
                    <i className="fas fa-users mr-3"/>
                    MMORPG
                </div>
                <div className={`option py-1 px-2 my-1 cursor-pointer color-tertiary ${props.isSelected(HomeOptionsEnum.Survival) ? 'selected' : ''}`} onClick={() => props.onOptionClick(HomeOptionsEnum.Survival)}>
                    <i className="fas fa-user-injured mr-3"/>
                    Survival
                </div>
            </div>
        </div>
    );

};

export default Home;
