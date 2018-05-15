import * as React from 'react';
import Spinner from '../../../spinner/main';
import { TwitchUser, TwitchEmote } from '../../../../client-server-common/common';
import { RaisedButton, Paper } from 'material-ui';
import VerifiedIcon from './VerifiedIcon';
import Truncate from 'react-truncate';

interface ITwitchListItemProps {
    index: number;
    name: string;
    viewerCount: number;
    gameName: string;
    profilePicLink: string;
    profileLink: string;
    streamPreviewLink: string;
    onProfileLinkClick: (link: string) => void;
    onExpandClick: (index: number) => void;
    expanded: boolean;
    cheerEmotes: TwitchEmote[];
    subEmotes: TwitchEmote[];
    badgeEmotes: TwitchEmote[];
    partnered: boolean;
    streamTitle: string;
}

const TwitchListItem: React.SFC<ITwitchListItemProps> = (props: ITwitchListItemProps) => {

    return (
        <div className="gaming-menu-item">
            <div className="gaming-menu-item-content">
                <div className="profile-picture">
                    <img src={props.profilePicLink} alt="Profile picture"/>
                    <div className="profile-picture-overlay"/>
                </div>
                <div className="profile-name">
                    <div className="name">{props.name}</div>
                    {props.partnered && <VerifiedIcon/>}
                </div>
                <span className="profile-streamtitle">
                    {props.streamTitle}
                </span >
                <div className="profile-currentlyplaying">
                    <i>{props.gameName}</i>
                </div>
                <div className="profile-viewercount">
                    <i><div className="profile-viewercount-indicator"/> {props.viewerCount} viewers</i>
                </div>
                <div className="profile-streampreview" onClick={() => { props.onProfileLinkClick(props.profileLink); }}>
                    <img src={props.streamPreviewLink} alt="Stream preview picture"/>
                    <RaisedButton className="profile-stream" label="Watch" primary={true}/>
                </div>
                <RaisedButton className="profile-more" label="More" primary={true} icon={<i className={props.expanded ? "fas fa-chevron-up" : "fas fa-chevron-down"}/>} onClick={() => { props.onExpandClick(props.index); }}/>
                {props.expanded && 
                    <Paper className="profile-expand" zDepth={5} >
                        {!props.cheerEmotes && !props.subEmotes && !props.badgeEmotes &&
                            <div className="profile-expand-title">This stream has no emotes.</div>}
                        {props.subEmotes && 
                            <div className="profile-expand-emotes-container">
                                <div className="profile-expand-title">Sub emotes</div>
                                {props.subEmotes.map((x: TwitchEmote) => {
                                    return (
                                        <div key={x.name} className="profile-expand-emote">
                                            <div>{x.name}</div>
                                            <a href={x.link}><img src={x.link} alt="Emote picture"/></a>
                                        </div>
                                    );
                                })}
                            </div>}
                        {props.badgeEmotes && 
                            <div className="profile-expand-emotes-container">
                                <div className="profile-expand-title">Badge emotes</div>
                                {props.badgeEmotes.map((x: TwitchEmote) => {
                                    return (
                                        <div key={x.name} className="profile-expand-emote">
                                            <div>{x.name}</div>
                                            <a href={x.link}><img src={x.link} alt="Emote picture"/></a>
                                        </div>
                                    );
                                })}
                            </div>}
                        {props.cheerEmotes && 
                            <div className="profile-expand-emotes-container">
                                <div className="profile-expand-title">Cheer emotes</div>
                                {props.cheerEmotes.map((x: TwitchEmote) => {
                                    return (
                                        <div key={x.name} className="profile-expand-emote">
                                            <div>{x.name}</div>
                                            <a href={x.link}><img src={x.link} alt="Emote picture"/></a>
                                        </div>
                                    );
                                })}
                            </div>}
                    </Paper>}
            </div>
        </div>
    );

};     

export default TwitchListItem;