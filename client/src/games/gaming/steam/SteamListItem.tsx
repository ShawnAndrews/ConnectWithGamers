import * as React from 'react';
import { Paper } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface ISteamListItemProps {
    name: string;
    profilePicture: string;
    profileLink: string;
    onProfileLinkClick: (link: string) => void;
    online: boolean;
    lastOnline: string;
    recentlyPlayedName: string;
    recentlyPlayedImageLink: string;
    countryFlagLink: string;
}

const SteamListItem: React.SFC<ISteamListItemProps> = (props: ISteamListItemProps) => {

    return (
        <div className="col-md-6 col-lg-4 px-4 px-md-2 my-2">
            <Paper className="friend bg-primary hover-primary position-relative">
                <div className="profile-img-container steam">
                    <img src={props.profilePicture} alt="Profile picture"/>
                    <div className={`overlay ${props.online ? 'online' : 'offline'}`}/>
                </div>
                <div className="name-container text-right w-100 px-2">
                    {props.countryFlagLink &&
                        <img className="flag h-100" src={props.countryFlagLink} alt="Country Flag" />}
                    <Textfit className="name align-middle color-secondary font-weight-bold text-nowrap d-inline-block" min={11}>{props.name}</Textfit>
                    <i className="fas fa-external-link-alt color-secondary ml-2 d-inline-block" onClick={() => { props.onProfileLinkClick(props.profileLink); }}/>
                </div>
                {props.recentlyPlayedName &&
                    <>
                        <div className="recentlyplayed text-right pl-2 pr-4">
                            {`Recently played: ${props.recentlyPlayedName}`}
                        </div>
                        <img className="game-img mx-2" src={props.recentlyPlayedImageLink} alt="Recently Played Game Picture"/>
                    </>}
                {!props.online && props.lastOnline && 
                    <Textfit className="lastonline color-secondary text-right font-italic mx-2">{props.lastOnline}</Textfit>}
            </Paper>
        </div>
    );

};     

export default SteamListItem;