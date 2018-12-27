import * as React from 'react';
import { TwitchEmote } from '../../../../client-server-common/common';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import VerifiedIcon from './VerifiedIcon';

interface ITwitchListItemProps {
    index: number;
    name: string;
    viewerCount: number;
    gameName: string;
    profilePicLink: string;
    profileLink: string;
    streamPreviewLink: string;
    onProfileLinkClick: (link: string) => void;
    onVideoClick: (index: number) => void;
    onChatClick: (index: number) => void;
    onBothClick: (index: number) => void;
    onExpandClick: (index: number) => void;
    showVideo: boolean;
    showChat: boolean;
    showBoth: boolean;
    expanded: boolean;
    cheerEmotes: TwitchEmote[];
    subEmotes: TwitchEmote[];
    badgeEmotes: TwitchEmote[];
    partnered: boolean;
    streamTitle: string;
}

const TwitchListItem: React.SFC<ITwitchListItemProps> = (props: ITwitchListItemProps) => {

    return (
        <div className="col-lg-6 px-4 px-md-2 my-2">
            <Paper className="stream bg-tertiary hover-tertiary-solid position-relative">
                <img className="cover-img" src={props.profilePicLink} alt="Profile picture"/>
                <div className="name px-2">
                    <div className="d-inline-block color-secondary">{props.name}</div>
                    {props.partnered && <VerifiedIcon/>}
                </div>
                <div className="preview" onClick={() => { props.onProfileLinkClick(props.profileLink); }}>
                    <img src={props.streamPreviewLink} alt="Stream preview picture"/>
                    <Button 
                        className="color-primary bg-secondary-solid font-weight-bold p-0"
                        variant="raised" 
                    >
                        Watch
                    </Button>
                </div>
                <span className="title px-2">
                    {props.streamTitle}
                </span >
                <div className="currentlyplaying font-italic px-2">
                    {props.gameName}
                </div>
                <div className="viewercount font-italic text-right color-secondary">
                    <div className="indicator"/>{`${props.viewerCount} viewers`}
                </div>
                <div className="view w-100">
                    <Button variant="raised" className="color-primary bg-secondary-solid br-0" color="primary" onClick={() => { props.onVideoClick(props.index); }}>
                        Video
                        <i className="fas fa-video color-primary mx-1"/>
                    </Button>
                    <Button variant="raised" className="color-primary bg-secondary-solid br-0" color="primary" onClick={() => { props.onChatClick(props.index); }}>
                        Chat
                        <i className="fas fa-comment-alt color-primary mx-1"/>
                    </Button>
                    <Button variant="raised" className="color-primary bg-secondary-solid br-0" color="primary" onClick={() => { props.onBothClick(props.index); }}>
                        Both
                        <i className="fas fa-video color-primary mx-1"/>
                        <i className="fas fa-comment-alt color-primary mx-1"/>
                    </Button>
                </div>
                <Button variant="raised" className="more color-primary bg-secondary-solid w-100 br-0" onClick={() => { props.onExpandClick(props.index); }}>
                    More
                    <i className={props.expanded ? "fas fa-chevron-up mx-1" : "fas fa-chevron-down mx-1"}/>
                </Button>
                {props.showVideo && 
                    <Paper className="expand" elevation={5}>
                        <iframe
                            className="video w-100"
                            src={`https://player.twitch.tv/?channel=${props.name}`}
                            frameBorder="0"
                        />
                    </Paper>}
                {props.showChat && 
                    <Paper className="expand" elevation={5} >
                        <iframe 
                            className="chat w-100"
                            src={`https://www.twitch.tv/embed/${props.name}/chat`}
                            frameBorder="0"
                            scrolling="no"
                        />
                    </Paper>}
                {props.showBoth && 
                    <Paper className="expand" elevation={5} >
                        <iframe
                            className="video w-100"
                            src={`https://player.twitch.tv/?channel=${props.name}`}
                            frameBorder="0"
                        />
                        <iframe 
                            className="chat w-100"
                            src={`https://www.twitch.tv/embed/${props.name}/chat`}
                            frameBorder="0"
                            scrolling="no"
                            allowTransparency={true}
                        />
                    </Paper>}
                {props.expanded && 
                    <div className="emotes text-center color-secondary" >
                        {!props.cheerEmotes && !props.subEmotes && !props.badgeEmotes &&
                            <h4 className="noemotes text-center font-weight-bold p-3">This stream has no emotes.</h4>}
                        {props.subEmotes && 
                            <>
                                <div className="subtitle text-center font-weight-bold my-2">Sub emotes</div>
                                {props.subEmotes.map((x: TwitchEmote) => {
                                    return (
                                        <div key={x.name} className="emote-container m-2 color-secondary d-inline-block">
                                            <div>{x.name}</div>
                                            <a href={x.link}><img src={x.link} alt="Emote picture"/></a>
                                        </div>
                                    );
                                })}
                            </>}
                        {props.badgeEmotes && 
                            <>
                                <div className="subtitle text-center font-weight-bold my-2">Badge emotes</div>
                                {props.badgeEmotes.map((x: TwitchEmote) => {
                                    return (
                                        <div key={x.name} className="emote-container m-2 color-secondary d-inline-block">
                                            <div>{x.name}</div>
                                            <a href={x.link}><img src={x.link} alt="Emote picture"/></a>
                                        </div>
                                    );
                                })}
                            </>}
                        {props.cheerEmotes && 
                            <>
                                <div className="subtitle text-center font-weight-bold my-2">Cheer emotes</div>
                                {props.cheerEmotes.map((x: TwitchEmote) => {
                                    return (
                                        <div key={x.name} className="emote-container m-2 color-secondary d-inline-block">
                                            <div>{x.name}</div>
                                            <a href={x.link}><img src={x.link} alt="Emote picture"/></a>
                                        </div>
                                    );
                                })}
                            </>}
                    </div>}
            </Paper>
        </div>
    );

};     

export default TwitchListItem;