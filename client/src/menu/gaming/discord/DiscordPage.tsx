import * as React from 'react';
import Spinner from '../../../spinner/main';
import { RaisedButton } from 'material-ui';

interface IDiscordPageProps {
    isLoading: boolean;
    link: string;
    onClickCopy: () => void;
}

const DiscordPage: React.SFC<IDiscordPageProps> = (props: IDiscordPageProps) => {

    if (props.isLoading) {
        return (
            <div className="menu-grid-center-abs">
                <Spinner loadingMsg="Loading discord link..." />
            </div>
        );
    }
    
    if (!props.link) {
        return (
            <p className="social-not-set">To proceed, go to Account → Links and set your Discord invitation link.</p>
        );
    }

    return (
        <div className="discord-page">
            <div className="discord-page-content">
                Send this invitation link to friends to join your server!
            </div>
            <textarea className="discord-page-link" rows={1}>
                {props.link}
            </textarea>
            <RaisedButton className="discord-page-copy-btn" label="Copy To Clipboard" primary={true} onClick={props.onClickCopy}/>
        </div>
    );   

};

export default DiscordPage;