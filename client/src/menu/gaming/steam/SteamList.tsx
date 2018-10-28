import * as React from 'react';
import Spinner from '../../../spinner/main';
import { SteamFriend } from '../../../../client-server-common/common';
import SteamListItem from './SteamListItem';

interface ISteamListProps {
    isLoading: boolean;
    steamId: number;
    onlineFriends: SteamFriend[];
    offlineFriends: SteamFriend[];
    goToSteamProfile: (link: string) => void;
    handleRawInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filter: string;
}

const SteamList: React.SFC<ISteamListProps> = (props: ISteamListProps) => {

    if (props.isLoading) {
        return (
            <div className="menu-grid-center-abs">
                <Spinner loadingMsg="Loading Steam friends..." />
            </div>
        );
    }
    
    if (!props.steamId) {
        return (
            <p className="social-not-set">To proceed, go to Account → Links and set your Steam name.</p>
        );
    }
    
    if (!props.onlineFriends && !props.offlineFriends) {
        return (
            <p className="profile-private">Steam profile is private.</p>
        );
    }

    return (
        <div>
            <input 
                className="gaming-searchbar" 
                type="text" 
                placeholder="Search friends..."
                onChange={props.handleRawInputChange} 
            />
            <div className="friends-list scrollable">
                {props.onlineFriends
                    .sort((x: SteamFriend, y: SteamFriend) => {
                        // sort friends alphabetically
                        const nameA = x.name.toLowerCase();
                        const nameB = y.name.toLowerCase();
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    })
                    .filter((x: SteamFriend) => {
                        if (!props.filter) {
                            return true;
                        }
                        return x.name.toLowerCase().includes(props.filter.toLowerCase());
                    })
                    .map((x: SteamFriend) => {
                        return (
                            <SteamListItem 
                                key={x.id}
                                name={x.name}
                                profilePicture={x.profilePicture}
                                profileLink={x.profileLink}
                                onProfileLinkClick={props.goToSteamProfile}
                                online={x.online}
                                lastOnline={x.lastOnline}
                                recentlyPlayedName={x.recentlyPlayedName}
                                recentlyPlayedImageLink={x.recentlyPlayedImageLink}
                                countryFlagLink={x.countryFlagLink}
                            />
                        );
                    })}
                {props.offlineFriends
                    .sort((x: SteamFriend, y: SteamFriend) => {
                        // sort friends alphabetically
                        const nameA = x.name.toLowerCase();
                        const nameB = y.name.toLowerCase();
                        if (nameA < nameB) {
                            return -1;
                        }
                        if (nameA > nameB) {
                            return 1;
                        }
                        return 0;
                    })
                    .filter((x: SteamFriend) => {
                        if (!props.filter) {
                            return true;
                        }
                        return x.name.toLowerCase().includes(props.filter.toLowerCase());
                    })
                    .map((x: SteamFriend) => {
                        return (
                            <SteamListItem 
                                key={x.id}
                                name={x.name}
                                profilePicture={x.profilePicture}
                                profileLink={x.profileLink}
                                onProfileLinkClick={props.goToSteamProfile}
                                online={x.online}
                                lastOnline={x.lastOnline}
                                recentlyPlayedName={x.recentlyPlayedName}
                                recentlyPlayedImageLink={x.recentlyPlayedImageLink}
                                countryFlagLink={x.countryFlagLink}
                            />
                        );
                    })}
            </div>
        </div>
    );   

};     

export default SteamList;