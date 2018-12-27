import * as React from 'react';
import Spinner from '../../../spinner/main';
import Button from '@material-ui/core/Button';
import { Paper } from '@material-ui/core';

interface IDiscordPageProps {
    isLoading: boolean;
    link: string;
    onClickCopy: () => void;
}

const DiscordPage: React.SFC<IDiscordPageProps> = (props: IDiscordPageProps) => {

    if (props.isLoading) {
        return (
            <Spinner className="text-center mt-5" loadingMsg="Loading discord link..." />
        );
    }
    
    if (!props.link) {
        return (
            <Paper className="discord bg-secondary-solid text-center color-primary p-4 mx-auto mt-5 position-relative" elevation={24}>To proceed, go to Account → Links and set your Discord invitation link.</Paper>
        );
    }

    return (
        <Paper className="discord bg-secondary-solid p-4 mx-auto mt-5 position-relative" elevation={24}>
            <div className="text-center color-primary">
                Send this invitation link to friends to join your server!
            </div>
            <textarea
                className="text-readonly color-primary text-center w-100 mt-4"
                value={props.link}
            />
            <Button variant="raised" className="bg-primary-solid hover-primary-solid color-secondary" color="primary" onClick={props.onClickCopy} fullWidth={true}>
                Copy To Clipboard
            </Button>
        </Paper>
    );   

};

export default DiscordPage;