import * as React from 'react';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';

interface IHomePageProps {
  onClickTwitch: () => void;
  onClickSteam: () => void;
  onClickDiscord: () => void;
}

const HomePage: React.SFC<IHomePageProps> = (props: IHomePageProps) => {

    return (
        <Paper className="homepage bg-primary p-4 mx-auto mt-5 position-relative" elevation={24}>
            <div className="text-center color-secondary">Welcome to your gaming profiles!</div>
            <Button 
                variant="raised"
                className="color-primary bg-secondary mt-4"
                onClick={props.onClickTwitch}
                fullWidth={true}
            >
                <span>Twitch Live Streams</span>
                <i className="fas fa-desktop ml-3"/>
            </Button>
            <Button 
                variant="raised"
                className="color-primary bg-secondary mt-2"
                onClick={props.onClickSteam}
                fullWidth={true}
            >
                <span>Steam Friends Online</span>
                <i className="fas fa-users ml-3"/>
            </Button>
            <Button 
                variant="raised"
                className="color-primary bg-secondary mt-2"
                onClick={props.onClickDiscord}
                fullWidth={true}
            >
                <span>Copy Discord Link</span>
                <i className="fas fa-copy ml-3"/>
            </Button>
        </Paper>
    );

};

export default HomePage;