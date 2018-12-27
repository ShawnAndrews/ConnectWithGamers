import * as React from 'react';
import Spinner from '../../../spinner/main';
import { TwitchUser } from '../../../../client-server-common/common';
import TwitchListItem from './TwitchListItem';
import { Paper, TextField } from '@material-ui/core';

interface ITwitchListProps {
    isLoading: boolean;
    twitchId: number;
    liveFollowers: TwitchUser[];
    goToTwitchProfile: (link: string) => void;
    handleRawInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filter: string;
    onVideoClick: (index: number) => void;
    onChatClick: (index: number) => void;
    onBothClick: (index: number) => void;
    onExpandClick: (index: number) => void;
    showVideo: boolean[];
    showChat: boolean[];
    showBoth: boolean[];
    expanded: boolean[];
}

const TwitchList: React.SFC<ITwitchListProps> = (props: ITwitchListProps) => {

    if (props.isLoading) {
        return (
            <div className="menu-grid-center-abs">
                <Spinner className="text-center mt-5" loadingMsg="Loading Twitch live streams..." />
            </div>
        );
    }
    
    if (!props.twitchId) {
        return (
            <Paper className="discord bg-primary text-center color-secondary p-4 mx-auto mt-5 position-relative" elevation={24}>To proceed, go to Account → Links and set your Twitch name.</Paper>
        );
    }
    
    return (
        <div className="twitch">
            <Paper className="title bg-tertiary p-4 mx-auto mt-3 mb-3 position-relative" elevation={24}>
                <div className="text-center color-secondary">
                    Twitch streams
                </div>
                <TextField
                    className="custom-account-form-group-secondary mt-2"
                    label="Search live streams..."
                    type="search"
                    margin="normal"
                    onChange={props.handleRawInputChange}
                    fullWidth={true}
                />
            </Paper>
            <div className="streams container">
                <div className="row">
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
                                    onVideoClick={props.onVideoClick}
                                    onChatClick={props.onChatClick}
                                    onBothClick={props.onBothClick}
                                    onExpandClick={props.onExpandClick}
                                    showVideo={props.showVideo[index]}
                                    showChat={props.showChat[index]}
                                    showBoth={props.showBoth[index]}
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
        </div>
    );

};

export default TwitchList;