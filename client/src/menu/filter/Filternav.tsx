import * as React from 'react';
import { Button, ListItem, ListItemIcon, ListItemText, Collapse, List, Checkbox, TextField } from '@material-ui/core';
import { FilterOptions, FilterSortOptions, NameValuePair, FilterCategoryOptions, FilterGenreOptions } from './FilternavContainer';

interface IFilternavProps {
    filterMouseMoved: boolean;
    filterNavRef: React.RefObject<HTMLDivElement>;
    sortExpanded: boolean;
    popularityExpanded: boolean;
    categoryExpanded: boolean;
    genreExpanded: boolean;
    platformExpanded: boolean;
    onTouchStart: (e: React.TouchEvent<HTMLDivElement>) => void;
    onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
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

const Filternav: React.SFC<IFilternavProps> = (props: IFilternavProps) => {
    
    return (
        <div className='filternav scrollable' ref={props.filterNavRef}>
            <div className="filternav-header">
                Advanced Search
            </div>

            <div className="filternav-items-container" onTouchStart={props.onTouchStart} onTouchMove={props.onTouchMove}>
                <TextField
                    className="filternav-items-search"
                    placeholder="Search games"
                    margin="normal"
                    onChange={props.onQueryChanged}
                    value={props.filterOptions.query}
                />

                <ListItem className="filternav-item-parent" button={true} onTouchEnd={() => { props.onPlatformExpandClick(); }}>
                    <ListItemIcon>
                        <i className="fas fa-desktop"/>
                    </ListItemIcon>
                    <ListItemText inset={true} primary="Platform" />
                    {props.platformExpanded ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                </ListItem>
                <Collapse in={props.platformExpanded} timeout="auto" unmountOnExit={true}>
                    <List component="div" disablePadding={true}>
                        {props.platforms && 
                            props.platforms.map((pair: NameValuePair, index: number) => {
                                return (
                                    <ListItem
                                        key={pair.value}
                                        button={true}
                                        className='filternav-item-child no-padding'
                                        onTouchEnd={() => { props.onFilterPlatformClick(index); }}
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

                <ListItem className="filternav-item-parent" button={true} onTouchEnd={() => { props.onGenreExpandClick(); }}>
                    <ListItemIcon>
                        <i className="fas fa-gavel"/>
                    </ListItemIcon>
                    <ListItemText inset={true} primary="Genre" />
                    {props.genreExpanded ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                </ListItem>
                <Collapse in={props.genreExpanded} timeout="auto" unmountOnExit={true}>
                    <List component="div" disablePadding={true}>
                        {props.genres && 
                            props.genres.map((pair: NameValuePair, index: number) => {
                                return (
                                    <ListItem
                                        key={pair.value}
                                        button={true}
                                        className='filternav-item-child no-padding'
                                        onTouchEnd={() => { props.onFilterGenreClick(index); }}
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

                <ListItem className="filternav-item-parent" button={true} onTouchEnd={() => { props.onCategoryExpandClick(); }}>
                    <ListItemIcon>
                        <i className="fas fa-trophy"/>
                    </ListItemIcon>
                    <ListItemText inset={true} primary="Category" />
                    {props.categoryExpanded ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                </ListItem>
                <Collapse in={props.categoryExpanded} timeout="auto" unmountOnExit={true}>
                    <List component="div" disablePadding={true}>
                        {props.categories && 
                            props.categories.map((pair: NameValuePair, index: number) => {
                                return (
                                    <ListItem
                                        key={pair.value}
                                        button={true}
                                        className='filternav-item-child no-padding'
                                        onTouchEnd={() => { props.onFilterCategoryClick(index); }}
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

                <ListItem className="filternav-item-parent" button={true} onTouchEnd={() => { props.onPopularityExpandClick(); }}>
                    <ListItemIcon>
                        <i className="fas fa-fire"/>
                    </ListItemIcon>
                    <ListItemText inset={true} primary="Popularity" />
                    {props.popularityExpanded ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                </ListItem>
                <Collapse in={props.popularityExpanded} timeout="auto" unmountOnExit={true}>
                    <List component="div" disablePadding={true}>
                        {props.popularities &&
                            props.popularities.map((pair: NameValuePair, index: number) => {
                                return (
                                    <ListItem key={pair.value} className={`filternav-item-child ${props.filterOptions.popularitySelection === pair.value ? 'active' : ''}`} onTouchEnd={() => { props.onFilterPopularityClick(index); }} button={true}>
                                        <ListItemText inset={true} primary={pair.name} />
                                    </ListItem>
                                );
                            })}
                    </List>
                </Collapse>

                <ListItem className="filternav-item-parent" button={true} onTouchEnd={() => { props.onSortExpandClick(); }}>
                    <ListItemIcon>
                        <i className="fas fa-sort"/>
                    </ListItemIcon>
                    <ListItemText inset={true} primary="Sort" />
                    {props.sortExpanded ? <i className="fas fa-chevron-down"/> : <i className="fas fa-chevron-up"/>}
                </ListItem>
                <Collapse in={props.sortExpanded} timeout="auto" unmountOnExit={true}>
                    <List component="div" disablePadding={true}>
                        {props.sorts &&
                            props.sorts.map((pair: NameValuePair, index: number) => {
                                return (
                                    <ListItem key={pair.value} className={`filternav-item-child ${props.filterOptions.sortSelection === pair.value ? 'active' : ''}`} onTouchEnd={() => { props.onSortSelectionClick(index); }} button={true}>
                                        <ListItemIcon>
                                            <i className={`fas fa-sort-${pair.value === FilterSortOptions.Alphabetically ? 'alpha' : ''}${pair.value === FilterSortOptions.ReleaseDate ? 'numeric' : ''}${pair.value === FilterSortOptions.Popularity ? 'amount' : ''}-${props.filterOptions.sortState[pair.value] ? 'up' : 'down'}`}/>
                                        </ListItemIcon>
                                        <ListItemText inset={true} primary={pair.name} />
                                    </ListItem>
                                );
                            })}
                    </List>
                </Collapse>
            </div>

            <Button variant="raised" className="filternav-clear-btn" color="primary" onTouchEnd={() => { props.onClearBtnClick(); }}>
                Clear All
            </Button>

            <Button variant="raised" className="filternav-search-btn" color="primary" onTouchEnd={() => { props.onSearchBtnClick(); }}>
                <i className="fas fa-search"/>
                Search
            </Button>
        </div>
    );

}; 

export default Filternav;