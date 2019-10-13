import * as React from 'react';
import { Avatar } from '@material-ui/core';
import { CurrencyType, GameSuggestion } from '../../client-server-common/common';
import * as Autosuggest from 'react-autosuggest';
import { SuggestionSelectedEventData } from 'react-autosuggest';

interface INavbarProps {
    index: number;
    onTabClick: (path: string) => void;
    onSubmitSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    onRedirect: (URL: string) => void;
    profileImage: string;
    profileName: string;
    currencyAnchorEl: HTMLElement;
    onCurrencyClick: (e: React.MouseEvent<HTMLElement>) => void;
    onCurrencyClose: () => void;
    onCurrencyChange: (newCurrencyType: CurrencyType) => void;
    currencyType: CurrencyType;
    suggestions: GameSuggestion[];
    onSuggestionsFetchRequested: (value: any) => void;
    onSuggestionsClearRequested: () => void;
    SearchValue: string;
    onSearchChange: (event: any, obj: any) => void;
    onSuggestionSelected: (event: React.FormEvent<any>, data: SuggestionSelectedEventData<GameSuggestion>) => void;
}

const Navbar: React.SFC<INavbarProps> = (props: INavbarProps) => {
    return (
        <div className="brand-navbar navbar py-0">
            <a className="logo navbar-brand" href="/">
                <img src="https://i.imgur.com/MwJUdK9.gif" width="30" height="30" className="d-inline-block align-top mx-3" alt=""/>
                <span className="logo-name">Connect With Gamers</span>
            </a>
            <ul className="brand-menu nav nav-tabs" role="tablist">
                <li className="nav-item mx-md-2">
                    <div className="d-table h-100">
                        <a className={`btn nav-link btn-flat-bot-rad d-table-cell align-middle h-100 ${ props.index === 0 ? 'active' : ''}`} data-toggle="pill" role="tab" onClick={() => { props.onTabClick("/"); }}>
                            <i className="fas fa-store mr-2"/>
                            Store
                        </a>
                    </div>
                </li>
                <li className="nav-item mx-md-2">
                    <div className="d-table h-100">
                        <a className={`btn nav-link btn-flat-bot-rad d-table-cell align-middle h-100 ${ props.index === 1 ? 'active' : ''}`} data-toggle="pill" role="tab" onClick={() => { props.onTabClick("/library"); }}>
                            <i className="fas fa-bars mr-2"/>
                            Library
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
            <form className="search-form form-inline my-1" onSubmit={props.onSubmitSearch}>
                {/* <Button className="currency d-inline-block py-1 px-2 mr-4 cursor-pointer" variant="contained" onClick={props.onCurrencyClick}>
                    <i className={`currency-icon fas ${getFAFromCurrency(props.currencyType)} mr-1`}/>
                    <span className="currency-type">{props.currencyType}</span>
                </Button>
                <Menu
                    id="currency-menu"
                    anchorEl={props.currencyAnchorEl}
                    open={Boolean(props.currencyAnchorEl)}
                    onClose={props.onCurrencyClose}
                >
                    <MenuItem onClick={() => props.onCurrencyChange(CurrencyType.USD)}>
                        <i className={`fas ${getFAFromCurrency(CurrencyType.USD)} mr-1`}/>
                        {CurrencyType.USD}
                    </MenuItem>
                    <MenuItem onClick={() => props.onCurrencyChange(CurrencyType.EUR)}>
                        <i className={`fas ${getFAFromCurrency(CurrencyType.EUR)} mr-1`}/>
                        {CurrencyType.EUR}
                    </MenuItem>
                    <MenuItem onClick={() => props.onCurrencyChange(CurrencyType.GBP)}>
                        <i className={`fas ${getFAFromCurrency(CurrencyType.GBP)} mr-1`}/>
                        {CurrencyType.GBP}
                    </MenuItem>
                    <MenuItem onClick={() => props.onCurrencyChange(CurrencyType.CAD)}>
                        <i className={`fas ${getFAFromCurrency(CurrencyType.CAD)} mr-1`}/>
                        {CurrencyType.CAD}
                    </MenuItem>
                    <MenuItem onClick={() => props.onCurrencyChange(CurrencyType.AUD)}>
                        <i className={`fas ${getFAFromCurrency(CurrencyType.AUD)} mr-1`}/>
                        {CurrencyType.AUD}
                    </MenuItem>
                </Menu> */}
                <i className="search-icon fas fa-search mr-3"/>
                <div className="searchbar d-inline-block mr-2">
                    <Autosuggest
                        suggestions={props.suggestions}
                        onSuggestionsFetchRequested={props.onSuggestionsFetchRequested}
                        onSuggestionsClearRequested={props.onSuggestionsClearRequested}
                        onSuggestionSelected={props.onSuggestionSelected}
                        getSuggestionValue={(suggestion: GameSuggestion) => suggestion.name}
                        renderSuggestion={(suggestion: GameSuggestion) => <div>{suggestion.name}</div>}
                        inputProps={{
                            placeholder: 'Search games',
                            value: props.SearchValue,
                            onChange: props.onSearchChange
                        }} 
                    />
                </div>
                {(props.profileImage || props.profileName) && 
                    <div className="icon d-inline-block align-middle cursor-pointer ml-4" onClick={() => props.onRedirect(`/account`)}>
                        {props.profileImage
                            ? <Avatar className="bg-transparent" src={props.profileImage}/>
                            : <Avatar>{props.profileName.slice(0, 2).toUpperCase()}</Avatar>}
                    </div>}
            </form>
        </div>
    );

};

export default Navbar;
