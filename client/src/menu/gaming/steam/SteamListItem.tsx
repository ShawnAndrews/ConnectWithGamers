import * as React from 'react';

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
        <div className="gaming-menu-item">
            <div className="gaming-menu-item-content">
                <div className="profile-picture steam">
                    <img src={props.profilePicture} alt="Profile picture"/>
                    <div className="profile-picture-overlay steam"/>
                    <div className={props.online ? `online-text` : `offline-text`}/>
                </div>
                <div className="profile-name">
                    <div className="name">{props.name}</div>
                    <i className="fas fa-external-link-alt link" onClick={() => { props.onProfileLinkClick(props.profileLink); }}/>
                </div>
                {props.recentlyPlayedName && 
                    <div className="profile-recentlyplayed steam">
                        <span>Recently played: </span> 
                        <i>{props.recentlyPlayedName}</i> 
                        <img src={props.recentlyPlayedImageLink} alt="Recently Played Game Picture"/>
                    </div>}
                {props.countryFlagLink &&
                    <img className="profile-countryflag" src={props.countryFlagLink} alt="Country Flag" />}
                {!props.online && props.lastOnline && 
                    <div className="last-online-time">{props.lastOnline}</div>}
            </div>
        </div>
    );

};     

export default SteamListItem;