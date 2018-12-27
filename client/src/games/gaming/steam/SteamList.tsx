import * as React from 'react';
import Spinner from '../../../spinner/main';
import { SteamFriend } from '../../../../client-server-common/common';
import SteamListItem from './SteamListItem';
import { Paper, TextField } from '@material-ui/core';

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
            <Spinner className="text-center mt-5" loadingMsg="Loading Steam friends..." />
        );
    }
    
    if (!props.steamId) {
        return (
            <Paper className="discord bg-primary text-center color-secondary p-4 mx-auto mt-5 position-relative" elevation={24}>To proceed, go to Account → Links and set your Steam name.</Paper>
        );
    }
    
    if (!props.onlineFriends && !props.offlineFriends) {                           
        return (
            <Paper className="discord bg-primary text-center color-secondary p-4 mx-auto mt-5 position-relative" elevation={24}>Steam profile is private.</Paper>
        );
    }

    return (
        <div className="steam">
            <Paper className="title bg-tertiary p-4 mx-auto mt-3 mb-3 position-relative" elevation={24}>
                <div className="text-center color-secondary">
                    Steam friends
                </div>
                <TextField
                    className="custom-account-form-group-secondary mt-2"
                    label="Filter friends..."
                    type="search"
                    margin="normal"
                    onChange={props.handleRawInputChange}
                    fullWidth={true}
                />
            </Paper>
            <div className="friends container">
                <div className="row">
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
        </div>
    );   

};     

export default SteamList;