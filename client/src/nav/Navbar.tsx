import * as React from 'react';
import { Avatar } from '@material-ui/core';

interface INavbarProps {
    index: number;
    searchQuery: string;
    toggleAdvancedSearch: boolean;
    onTabClick: (path: string) => void;
    onToggleAdvancedSearch: () => void;
    onSubmitSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    onSearchQueryChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRedirect: (URL: string) => void;
    profileImage: string;
    profileName: string;
}

const Navbar: React.SFC<INavbarProps> = (props: INavbarProps) => {
    
    return (
        <div className="brand-navbar navbar bg-secondary-solid pb-0">
            <a className="logo navbar-brand" href="/">
                <img src="https://i.imgur.com/MwJUdK9.gif" width="40" height="40" className="d-inline-block align-top mx-3" alt=""/>
                <span className="logo-name color-primary align-middle">Connect With Gamers</span>
            </a>
            <ul className="brand-menu nav nav-tabs" role="tablist">
                <li className="nav-item mx-md-2">
                    <div className="d-table h-100">
                        <a className={`btn nav-link btn-flat-bot-rad d-table-cell align-middle h-100 ${ props.index === 0 ? 'active' : ''}`} data-toggle="pill" role="tab" onClick={() => { props.onTabClick("/"); }}>
                            <i className="fas fa-home mr-2"/>
                            Home
                        </a>
                    </div>
                </li>
                <li className="nav-item mx-md-2">
                    <div className="d-table h-100">
                        <a className={`btn nav-link btn-flat-bot-rad d-table-cell align-middle h-100 ${ props.index === 1 ? 'active' : ''}`} data-toggle="pill" role="tab" onClick={() => { props.onTabClick("/games"); }}>
                            <i className="fas fa-gamepad mr-2"/>
                            Games
                        </a>
                    </div>
                </li>
                <li className="nav-item mx-md-2">
                    <div className="d-table h-100">
                        <a className={`btn nav-link btn-flat-bot-rad d-table-cell align-middle h-100 ${ props.index === 2 ? 'active' : ''}`} data-toggle="pill" role="tab" onClick={() => { props.onTabClick("/chat"); }}>
                            <i className="far fa-comments mr-2"/>
                            Chat
                        </a>
                    </div>
                </li>
                <li className="nav-item mx-md-2">
                    <div className="d-table h-100">
                        <a className={`btn nav-link btn-flat-bot-rad d-table-cell align-middle h-100 ${ props.index === 3 ? 'active' : ''}`} data-toggle="pill" role="tab" onClick={() => { props.onTabClick("/account"); }}>
                            <i className="far fa-user mr-2"/>
                            Account
                        </a>
                    </div>
                </li>
            </ul>
            <form className="search-form form-inline my-2 mb-3" onSubmit={props.onSubmitSearch}>
                <input className="form-control mr-sm-2" value={props.searchQuery} onChange={props.onSearchQueryChanged} type="search" placeholder="Search games" aria-label="Search"/>
                <button className="btn btn-outline-success my-2 my-sm-0 mr-sm-2" type="submit"><i className="fas fa-search"/></button>
                <button className="btn btn-outline-success my-2 my-sm-0" type="button" onClick={props.onToggleAdvancedSearch}><i className="fas fa-cog"/></button>
                {(props.profileImage || props.profileName) && 
                    <div className="d-inline-block align-middle cursor-pointer ml-4" onClick={() => props.onRedirect(`/account`)}>
                        {props.profileImage
                            ? <Avatar src={props.profileImage}/>
                            : <Avatar className="bg-primary-solid">{props.profileName.slice(0, 2).toUpperCase()}</Avatar>}
                    </div>}
            </form>
        </div>
    );

};

export default Navbar;