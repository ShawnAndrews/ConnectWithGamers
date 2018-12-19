import * as React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { ListItem, ListItemIcon, ListItemText, Collapse, List, Checkbox, TextField } from '@material-ui/core';
import { FilterOptions, FilterSortOptions, NameValuePair } from './ModalFilternavContainer';

interface IModalFilternavProps {
    toggle: boolean;
    onToggle: () => void;
    sortExpanded: boolean;
    popularityExpanded: boolean;
    categoryExpanded: boolean;
    genreExpanded: boolean;
    platformExpanded: boolean;
    onSortExpandClick: () => void;
    onPopularityExpandClick: () => void;
    onCategoryExpandClick: () => void;
    onGenreExpandClick: () => void;
    onPlatformExpandClick: () => void;
    filterOptions: FilterOptions;
    onSortSelectionClick: (sortSelection: number) => void;
    onFilterPopularityClick: (popularitySelection: number) => void;
    onFilterCategoryClick: (categorySelection: number) => void;
    onFilterGenreClick: (genreSelection: number) => void;
    onFilterPlatformClick: (platformSelection: number) => void;
    onClearBtnClick: () => void;
    onSearchBtnClick: () => void;
    onQueryChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
    sorts: NameValuePair[];
    popularities: NameValuePair[];
    categories: NameValuePair[];
    genres: NameValuePair[];
    platforms: NameValuePair[];
}

const ModalFilternav: React.SFC<IModalFilternavProps> = (props: IModalFilternavProps) => {
    
    return (
        <Modal className="filternav" isOpen={props.toggle} toggle={props.onToggle}>
            <ModalHeader toggle={props.onToggle}>Advanced Search</ModalHeader>
            <ModalBody>
                <TextField
                    className="searchbar w-100"
                    placeholder="Search games"
                    margin="normal"
                    onChange={props.onQueryChanged}
                    value={props.filterOptions.query}
                />

                <ListItem className="filter" button={true} onClick={props.onPlatformExpandClick}>
                    <ListItemIcon>
                        <i className="fas fa-desktop"/>
                    </ListItemIcon>
                    <ListItemText inset={true} primary="Platform" />
                    {props.platformExpanded ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                </ListItem>
                <Collapse className="filter-items" in={props.platformExpanded} timeout="auto" unmountOnExit={true}>
                    <List disablePadding={true}>
                        {props.platforms && 
                            props.platforms.map((pair: NameValuePair, index: number) => {
                                return (
                                    <ListItem
                                        key={pair.value}
                                        button={true}
                                        className='no-padding'
                                        onClick={() => { props.onFilterPlatformClick(index); }}
                                    >
                                        <Checkbox
                                            checked={props.filterOptions.platformSelection[index]}
                                            tabIndex={-1}
                                            disableRipple={true}
                                        />
                                        <ListItemText primary={pair.name} />
                                    </ListItem>
                                );
                            })}
                    </List>
                </Collapse>

                <ListItem className="filter" button={true} onClick={props.onGenreExpandClick}>
                    <ListItemIcon>
                        <i className="fas fa-gavel"/>
                    </ListItemIcon>
                    <ListItemText inset={true} primary="Genre" />
                    {props.genreExpanded ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                </ListItem>
                <Collapse className="filter-items" in={props.genreExpanded} timeout="auto" unmountOnExit={true}>
                    <List disablePadding={true}>
                        {props.genres && 
                            props.genres.map((pair: NameValuePair, index: number) => {
                                return (
                                    <ListItem
                                        key={pair.value}
                                        button={true}
                                        className='no-padding'
                                        onClick={() => { props.onFilterGenreClick(index); }}
                                    >
                                        <Checkbox
                                            checked={props.filterOptions.genreSelection[index]}
                                            tabIndex={-1}
                                            disableRipple={true}
                                        />
                                        <ListItemText primary={pair.name} />
                                    </ListItem>
                                );
                            })}
                    </List>
                </Collapse>

                <ListItem className="filter" button={true} onClick={props.onCategoryExpandClick}>
                    <ListItemIcon>
                        <i className="fas fa-trophy"/>
                    </ListItemIcon>
                    <ListItemText inset={true} primary="Category" />
                    {props.categoryExpanded ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                </ListItem>
                <Collapse className="filter-items" in={props.categoryExpanded} timeout="auto" unmountOnExit={true}>
                    <List disablePadding={true}>
                        {props.categories && 
                            props.categories.map((pair: NameValuePair, index: number) => {
                                return (
                                    <ListItem
                                        key={pair.value}
                                        button={true}
                                        className='no-padding'
                                        onClick={() => { props.onFilterCategoryClick(index); }}
                                    >
                                        <Checkbox
                                            checked={props.filterOptions.categorySelection[index]}
                                            tabIndex={-1}
                                            disableRipple={true}
                                        />
                                        <ListItemText primary={pair.name} />
                                    </ListItem>
                                );
                            })}
                    </List>
                </Collapse>

                <ListItem className="filter" button={true} onClick={props.onPopularityExpandClick}>
                    <ListItemIcon>
                        <i className="fas fa-fire"/>
                    </ListItemIcon>
                    <ListItemText inset={true} primary="Popularity" />
                    {props.popularityExpanded ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                </ListItem>
                <Collapse className="filter-items" in={props.popularityExpanded} timeout="auto" unmountOnExit={true}>
                    <List disablePadding={true}>
                        {props.popularities &&
                            props.popularities.map((pair: NameValuePair, index: number) => {
                                return (
                                    <ListItem key={pair.value} className={`${props.filterOptions.popularitySelection === pair.value ? 'active' : ''}`} onClick={() => { props.onFilterPopularityClick(index); }} button={true}>
                                        <ListItemText inset={true} primary={pair.name} />
                                    </ListItem>
                                );
                            })}
                    </List>
                </Collapse>

                <ListItem className="filter" button={true} onClick={props.onSortExpandClick}>
                    <ListItemIcon>
                        <i className="fas fa-sort"/>
                    </ListItemIcon>
                    <ListItemText inset={true} primary="Sort" />
                    {props.sortExpanded ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                </ListItem>
                <Collapse className="filter-items" in={props.sortExpanded} timeout="auto" unmountOnExit={true}>
                    <List disablePadding={true}>
                        {props.sorts &&
                            props.sorts.map((pair: NameValuePair, index: number) => {
                                return (
                                    <ListItem key={pair.value} className={`${props.filterOptions.sortSelection === pair.value ? 'active' : ''}`} onClick={() => { props.onSortSelectionClick(index); }} button={true}>
                                        <ListItemIcon>
                                            <i className={`fas fa-sort-${pair.value === FilterSortOptions.Alphabetically ? 'alpha' : ''}${pair.value === FilterSortOptions.ReleaseDate ? 'numeric' : ''}${pair.value === FilterSortOptions.Popularity ? 'amount' : ''}-${props.filterOptions.sortState[pair.value] ? 'up' : 'down'}`}/>
                                        </ListItemIcon>
                                        <ListItemText inset={true} primary={pair.name} />
                                    </ListItem>
                                );
                            })}
                    </List>
                </Collapse>
            </ModalBody>
            <ModalFooter>
                <Button className="search-btn" color="primary" onClick={props.onSearchBtnClick}><i className="fas fa-search mr-2"/>Search</Button>{' '}
                <Button className="clear-btn" color="secondary" onClick={props.onClearBtnClick}>Clear All</Button>
            </ModalFooter>
        </Modal>
    );

}; 

export default ModalFilternav;