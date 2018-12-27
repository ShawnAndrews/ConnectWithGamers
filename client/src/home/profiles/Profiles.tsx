import * as React from 'react';
import Button from '@material-ui/core/Button';

interface IProfilesProps {
    goToRedirectCallback: (URL: string) => void;
}

const Profiles: React.SFC<IProfilesProps> = (props: IProfilesProps) => {

    return (
        <div className="col-md-3 col-lg-3 pr-md-0 pr-lg-3 pl-lg-0">
            <div className="profiles-table">
                <div className="profiles-header mb-3 pt-2" onClick={() => { props.goToRedirectCallback(`/games/gaming`); }}>
                    <a className="mr-2">Gaming Profiles</a>
                    <i className="fas fa-chevron-right"/>
                </div>
                <div className="profiles-buttons">
                    <Button className="profiles-twitch primary-shadow w-100" variant="contained" color="primary" onClick={() => { props.goToRedirectCallback(`/games/gaming/twitch`); }}>
                        TWITCH
                        <i className="fab fa-twitch ml-2"/>
                    </Button>
                    <Button className="profiles-steam primary-shadow w-100 mt-1" variant="contained" color="primary" onClick={() => { props.goToRedirectCallback(`/games/gaming/steam`); }}>
                        STEAM
                        <i className="fab fa-steam ml-2"/>
                    </Button>
                    <Button className="profiles-discord primary-shadow w-100 mt-1" variant="contained" color="primary" onClick={() => { props.goToRedirectCallback(`/games/gaming/discord`); }}>
                        DISCORD
                        <i className="fab fa-discord ml-2"/>
                    </Button>
                </div>
            </div>
        </div>
    );

};

export default Profiles;