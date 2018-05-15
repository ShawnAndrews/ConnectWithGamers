import * as React from 'react';
import { RaisedButton } from 'material-ui';

interface IHomePageProps {
  onClickTwitch: () => void;
  onClickSteam: () => void;
  onClickDiscord: () => void;
}

const HomePage: React.SFC<IHomePageProps> = (props: IHomePageProps) => {

    return (
      <div className="centered-page">
        <div className="centered-page-info">Welcome to your gaming profiles!</div>
            <RaisedButton
                className="centered-page-button"
                label="Twitch Live Streams"
                primary={true}
                icon={<i className="fas fa-desktop"/>}
                onClick={props.onClickTwitch}
            />
            <RaisedButton
                className="centered-page-button"
                label="Steam Friends Online"
                primary={true}
                icon={<i className="fas fa-users"/>}
                onClick={props.onClickSteam}
            />
            <RaisedButton
                className="centered-page-button"
                label="Copy Discord Link"
                primary={true}
                icon={<i className="fas fa-copy"/>}
                onClick={props.onClickDiscord}
            />
      </div>
    );

};

export default HomePage;