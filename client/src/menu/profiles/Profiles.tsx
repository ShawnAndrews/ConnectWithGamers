import * as React from 'react';
import Button from '@material-ui/core/Button';

interface IProfilesProps {
    goToRedirectCallback: (URL: string) => void;
}

const Profiles: React.SFC<IProfilesProps> = (props: IProfilesProps) => {

    return (
        <div className="profiles-container">
            <div className="profiles-header" onClick={() => { props.goToRedirectCallback(`/menu/gaming`); }}>
                <a className="profiles-header-link">Gaming Profiles</a>
                <i className="fas fa-chevron-right"/>
            </div>
            <div className="profiles-buttons">
                <Button className="profiles-twitch" variant="contained" color="primary" onClick={() => { props.goToRedirectCallback(`/menu/gaming/twitch`); }}>
                    TWITCH
                    <i className="fab fa-twitch"/>
                </Button>
                <Button className="profiles-steam" variant="contained" color="primary" onClick={() => { props.goToRedirectCallback(`/menu/gaming/steam`); }}>
                    STEAM
                    <i className="fab fa-steam"/>
                </Button>
                <Button className="profiles-discord" variant="contained" color="primary" onClick={() => { props.goToRedirectCallback(`/menu/gaming/discord`); }}>
                    DISCORD
                    <i className="fab fa-discord"/>
                </Button>
            </div>
        </div>
    );

};

export default Profiles;