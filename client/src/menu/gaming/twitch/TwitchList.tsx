import * as React from 'react';
import Spinner from '../../../spinner/main';
import { TwitchUser } from '../../../../client-server-common/common';
import { TwitchUserOption } from './TwitchListContainer';
import TwitchListItem from './TwitchListItem';

interface ITwitchListProps {
    isLoading: boolean;
    twitchId: boolean;
    liveFollowers: TwitchUser[];
    goToTwitchProfile: (link: string) => void;
    handleRawInputChange: (event: any) => void;
    filter: string;
    onExpandClick: (index: number) => void;
    expanded: boolean[];
}

const TwitchList: React.SFC<ITwitchListProps> = (props: ITwitchListProps) => {

    if (props.isLoading) {
        return (
            <div className="menu-grid-center-abs">
                <Spinner loadingMsg="Loading Twitch live streams..." />
            </div>
        );
    }
    
    if (!props.twitchId) {
        return (
            <p className="social-not-set">To proceed, go to Account → Links and set your Twitch name.</p>
        );
    }
    
    return (
        <div>
            <input 
                className="gaming-searchbar" 
                type="text" 
                placeholder="Search live streams..."
                onChange={props.handleRawInputChange} 
            />
            <div className="friends-list scrollable">
                {props.liveFollowers
                    .sort((x: TwitchUser, y: TwitchUser) => {
                        return y.viewerCount - x.viewerCount;
                    })
                    .filter((x: TwitchUser) => {
                        if (!props.filter) {
                            return true;
                        }
                        return x.name.toLowerCase().includes(props.filter.toLowerCase());
                    })
                    .map((x: TwitchUser, index: number) => {
                        return (
                            <TwitchListItem 
                                key={index}
                                index={index}
                                name={x.name}
                                viewerCount={x.viewerCount}
                                gameName={x.gameName}
                                profilePicLink={x.profilePicLink}
                                profileLink={x.profileLink}
                                streamPreviewLink={x.streamPreviewLink}
                                onProfileLinkClick={props.goToTwitchProfile}
                                onExpandClick={props.onExpandClick}
                                expanded={props.expanded[index]}
                                cheerEmotes={x.cheerEmotes}
                                subEmotes={x.subEmotes}
                                badgeEmotes={x.badgeEmotes}
                                partnered={x.partnered}
                                streamTitle={x.streamTitle}
                            />
                        );
                    })}
            </div>
        </div>
    ); 

};

export default TwitchList;