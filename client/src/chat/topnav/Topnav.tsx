import * as React from 'react';
import { Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import { Textfit } from 'react-textfit';

interface ITopnavProps {
    title: string;
    anchorEl: HTMLElement;
    handleSearchKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onSearchTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onMenuClick: (e: React.MouseEvent<HTMLElement>) => void;
    onMenuClose: () => void;
    onCreateEmoteLinkClick: () => void;
    onViewEmotesLinkClick: () => void;
    onUserlistLinkClick: () => void;
    expanded: boolean;
    toggleExpanded: () => void;
}

const Topnav: React.SFC<ITopnavProps> = (props: ITopnavProps) => {   

    return (
        <div className='topbar navbar row mx-0'>
            <div className="nav">
                <IconButton color="inherit" aria-label="Open drawer" onClick={props.onMenuClick}>
                    <i className="fas fa-bars"/>
                </IconButton>
            </div>
            <Typography className="title nav text-center d-table" noWrap={true}>
                <Textfit className="font-weight-bold d-table-cell align-middle" min={10} max={22}>{props.title}</Textfit>
            </Typography>
            <Menu
                id="topbar-menu"
                anchorEl={props.anchorEl}
                open={Boolean(props.anchorEl)}
                onClose={props.onMenuClose}
            >
                <MenuItem onClick={props.onCreateEmoteLinkClick}>Create an emote</MenuItem>
                <MenuItem onClick={props.onViewEmotesLinkClick}>View emotes</MenuItem>
                <MenuItem onClick={props.onUserlistLinkClick}>User list</MenuItem>
            </Menu>
            <div className="nav">
                <i className={`fas fa-users text-center ${props.expanded ? 'active' : ''}`} onClick={props.toggleExpanded}/>
                <div className="searchbar form-inline has-search">
                    <span className="fa fa-search form-control-feedback"/>
                    <input type="text" className="form-control" placeholder="Search user" onKeyPress={props.handleSearchKeyPress} onChange={props.onSearchTextChange}/>
                </div>
            </div>
        </div>
    );

};

export default Topnav;