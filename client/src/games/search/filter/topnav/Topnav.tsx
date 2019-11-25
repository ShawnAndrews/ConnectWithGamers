import * as React from 'react';
import { Paper, MenuItem, ButtonGroup, Button, Popper, Grow, ClickAwayListener, MenuList } from '@material-ui/core';

enum sortByOptions {
    PriceDesc = 'Price ▼',
    PriceAsc = 'Price ▲',
    ReleaseDateDesc = 'Release date ▼',
    ReleaseDateAsc = 'Release date ▲',
    NameDesc = 'Name ▼',
    NameAsc = 'Name ▲',
};

interface ITopnavProps {
    goBack: () => void;
    title: string;
    totalGames: number;
    handleToggle: () => void;
    handleClose: (event: React.MouseEvent<Document, MouseEvent>) => void;
    handleMenuItemClick: (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => void;
    sortByOpen: boolean;
    sortByIndex: number;
}

const options = ['Create a merge commit', 'Squash and merge', 'Rebase and merge'];

const Topnav: React.SFC<ITopnavProps> = (props: ITopnavProps) => {

    return (
        <div className="topnav p-2 mx-auto">
            <div className="text-center color-tertiary mb-3 mt-2">
                {props.totalGames} {props.title}
            </div>
            <div className="sort-by mb-3">
                <span className="mr-2">Sort by</span>
                <ButtonGroup variant="contained" color="primary" aria-label="split button">
                    <Button>
                        {props.sortByIndex === 0 ? sortByOptions.PriceDesc : ''}
                        {props.sortByIndex === 1 ? sortByOptions.PriceAsc : ''}
                        {props.sortByIndex === 2 ? sortByOptions.ReleaseDateDesc : ''}
                        {props.sortByIndex === 3 ? sortByOptions.ReleaseDateAsc : ''}
                        {props.sortByIndex === 4 ? sortByOptions.NameDesc : ''}
                        {props.sortByIndex === 5 ? sortByOptions.NameAsc : ''}
                    </Button>
                    <Button
                        color="primary"
                        size="small"
                        aria-controls={props.sortByOpen ? 'split-button-menu' : undefined}
                        aria-expanded={props.sortByOpen ? 'true' : undefined}
                        aria-label="select merge strategy"
                        aria-haspopup="menu"
                        onClick={props.handleToggle}
                    >
                        <i className="fas fa-chevron-down"/>
                    </Button>
                    </ButtonGroup>
                    <Popper className="popper" open={props.sortByOpen} role={undefined} transition disablePortal>
                        <Paper>
                            <ClickAwayListener onClickAway={props.handleClose}>
                            <MenuList id="split-button-menu">
                                {Object.keys(sortByOptions).map((val: any, index: number) => (
                                    <MenuItem
                                        selected={val == props.sortByIndex}
                                        onClick={event => props.handleMenuItemClick(event, index)}
                                    >
                                        {sortByOptions[val]}
                                    </MenuItem>
                                ))}
                            </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Popper>
            </div>
        </div>
    );

}; 

export default Topnav;