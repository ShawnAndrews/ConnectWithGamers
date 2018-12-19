import * as React from 'react';
import { Paper, Button } from '@material-ui/core';

interface INotFoundPageProps {
  onClickHomeButton: () => void;
}

const NotFoundPage: React.SFC<INotFoundPageProps> = (props: INotFoundPageProps) => {

    return (
        <Paper className="notfound bg-primary p-4 mx-auto mt-5 position-relative" elevation={24}>
            <h3 className="text-center color-secondary">404</h3>
            <div className="text-center color-secondary">Page not found!</div>
            <Button
                variant="raised" 
                className="color-primary bg-secondary mt-4"
                onClick={props.onClickHomeButton}
                fullWidth={true}
            >
                <i className="fa fa-home mr-3"/>Home
            </Button>
        </Paper>
    );

};

export default NotFoundPage;