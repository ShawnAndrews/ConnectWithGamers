import * as React from 'react';
import { Paper, Button, Grid, TextField } from '@material-ui/core';

interface IHomeProps {
    searchQuery: string;
    onSearchQueryChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSearch: (e: React.MouseEvent<HTMLElement>) => void;
    onAdvancedSearch: (e: React.MouseEvent<HTMLElement>) => void;
    onKeyPress: (event: React.KeyboardEvent<Element>) => void;
}

const Home: React.SFC<IHomeProps> = (props: IHomeProps) => {

    return (
        <Paper className="games bg-primary p-4 mx-auto mt-5 position-relative" elevation={24}>
            <h4 className="title text-center color-secondary">Search for games!</h4>
            <div className="searchbar mx-auto mt-4">
                <Grid container={true} spacing={8} alignItems="flex-end">
                    <Grid item={true}>
                        <i className="fas fa-search color-secondary"/>
                    </Grid>
                    <Grid item={true}>
                        <TextField 
                            className="text custom-account-form-group text-center"
                            label="Game title"
                            value={props.searchQuery}
                            onChange={props.onSearchQueryChanged}
                            onKeyPress={props.onKeyPress}
                        />
                    </Grid>
                </Grid>
            </div>
            <Button 
                variant="raised" 
                className="color-primary bg-secondary mt-4"
                onClick={props.onSearch}
                fullWidth={true}
            >
                Search
            </Button>
            <div className="text-center">
                <Button 
                    variant="raised" 
                    className="advanced-search-btn color-secondary bg-primary mt-2"
                    onClick={props.onAdvancedSearch}
                >
                    Advanced search
                </Button>
            </div>
        </Paper>
    );

};

export default Home;