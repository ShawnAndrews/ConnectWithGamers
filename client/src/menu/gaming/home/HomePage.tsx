import * as React from 'react';
import Button from '@material-ui/core/Button';

interface IHomePageProps {
  onClickTwitch: () => void;
  onClickSteam: () => void;
  onClickDiscord: () => void;
}

const HomePage: React.SFC<IHomePageProps> = (props: IHomePageProps) => {

    return (
      <div className="centered-page">
        <div className="centered-page-info">Welcome to your gaming profiles!</div>
            <Button 
                variant="raised"
                className="centered-page-button"
                color="primary"
                onClick={props.onClickTwitch}
            >
                <span>Twitch Live Streams  </span>
                <i className="fas fa-desktop"/>
            </Button>
            <Button 
                variant="raised"
                className="centered-page-button"
                color="primary"
                onClick={props.onClickSteam}
            >
                <span>Steam Friends Online  </span>
                <i className="fas fa-users"/>
            </Button>
            <Button 
                variant="raised"
                className="centered-page-button"
                color="primary"
                onClick={props.onClickDiscord}
            >
                <span>Copy Discord Link  </span>
                <i className="fas fa-copy"/>
            </Button>
      </div>
    );

};

export default HomePage;