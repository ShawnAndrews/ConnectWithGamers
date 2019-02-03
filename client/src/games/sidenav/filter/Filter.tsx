import * as React from 'react';
import Slider from '@material-ui/lab/Slider';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Select, FormControl, MenuItem, Input, Chip, FormControlLabel, Checkbox } from '@material-ui/core';
import { IdNamePair } from '../../../../client-server-common/common';
import { SortingOptionEnum } from './FilterContainer';

interface IFilterProps {
    browsePopularSelected: boolean;
    browseRecentSelected: boolean;
    browseUpcomingSelected: boolean;
    browseIOSSoonSelected: boolean;
    browseAndroidSoonSelected: boolean;
    browseNewsSelected: boolean;
    popularity: number;
    onPopularityChange: (value: number) => void;
    releaseDateStart: Date;
    releaseDateEnd: Date;
    onReleaseDateStartChange: (date: Date) => void;
    onReleaseDateEndChange: (date: Date) => void;
    sortingOptions: IdNamePair[];
    sortingSelection: SortingOptionEnum;
    onSortingSelectionChange: (event: any) => void;
    genreOptions: IdNamePair[];
    genresSelection: IdNamePair[];
    onGenresSelectionChange: (event: any) => void;
    platformOptions: IdNamePair[];
    platformsSelection: IdNamePair[];
    onPlatformSelectionChange: (event: any) => void;
    categoryOptions: IdNamePair[];
    categorySelection: IdNamePair[];
    onCategorySelectionChange: (event: any) => void;
    onRefreshClick: () => void;
    onCoverClick: (checked: boolean) => void;
    onScreenshotsClick: (checked: boolean) => void;
    onTrailerClick: (checked: boolean) => void;
    onSearchKeypress: (event: React.KeyboardEvent<Element>) => void;
    onSearchQueryChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPopularClick: (checked: boolean) => void;
    onRecentClick: (checked: boolean) => void;
    onUpcomingClick: (checked: boolean) => void;
    onIOSSoonClick: (checked: boolean) => void;
    onAndroidSoonClick: (checked: boolean) => void;
    onNewsClick: (checked: boolean) => void;
    cover: boolean;
    screenshots: boolean;
    trailer: boolean;
    disableNonBrowse: boolean;
}

const Filter: React.SFC<IFilterProps> = (props: IFilterProps) => {

    return (
        <div className={`filter d-inline-block align-top overflow-hidden`}>
            <div className="mb-5 mt-3">
                <div className="w-85 mx-auto">
                    <div className="title text-uppercase text-center font-weight-bold">
                        Search
                    </div>
                    <div className="options">
                        <div className={`searchbar w-100 has-search mb-2 mx-auto ${props.disableNonBrowse ? 'disabled' : ''}`}>
                            <span className="fa fa-search form-control-feedback"/>
                            <input type="text" className="form-control" placeholder="Game title" disabled={props.disableNonBrowse} onChange={props.onSearchQueryChanged} onKeyPress={props.onSearchKeypress} />
                        </div>
                        <div className="browse px-3 my-3">
                            <div className="mb-2">Browse</div>
                            <FormControlLabel
                                className="filter-checkbox"
                                control={
                                    <Checkbox className="check" checked={props.browsePopularSelected} value={props.browsePopularSelected} onChange={(event: any, checked: boolean) => props.onPopularClick(checked)} />
                                }
                                label="Most Popular"
                            />
                            <FormControlLabel
                                className="filter-checkbox"
                                control={
                                    <Checkbox className="check" checked={props.browseRecentSelected} value={props.browseRecentSelected} onChange={(event: any, checked: boolean) => props.onRecentClick(checked)} />
                                }
                                label="Recently Released"
                            />
                            <FormControlLabel
                                className="filter-checkbox"
                                control={
                                    <Checkbox className="check" checked={props.browseUpcomingSelected} value={props.browseUpcomingSelected} onChange={(event: any, checked: boolean) => props.onUpcomingClick(checked)} />
                                }
                                label="Upcoming"
                            />
                            <FormControlLabel
                                className="filter-checkbox"
                                control={
                                    <Checkbox className="check" checked={props.browseIOSSoonSelected} value={props.browseIOSSoonSelected} onChange={(event: any, checked: boolean) => props.onIOSSoonClick(checked)} />
                                }
                                label="IOS Apps Coming Soon"
                            />
                            <FormControlLabel
                                className="filter-checkbox"
                                control={
                                    <Checkbox className="check" checked={props.browseAndroidSoonSelected} value={props.browseAndroidSoonSelected} onChange={(event: any, checked: boolean) => props.onAndroidSoonClick(checked)} />
                                }
                                label="Android Apps Coming Soon"
                            />
                            <FormControlLabel
                                className="filter-checkbox"
                                control={
                                    <Checkbox className="check" checked={props.browseNewsSelected} value={props.browseNewsSelected} onChange={(event: any, checked: boolean) => props.onNewsClick(checked)} />
                                }
                                label="News"
                            />
                        </div>
                        <div className={`popularity px-3 mb-5 ${props.disableNonBrowse ? 'disabled' : ''}`}>
                            Popularity — {props.popularity}%+
                            <Slider
                                className="slider mt-3"
                                value={props.popularity}
                                onChange={(e: any, v: any) => props.onPopularityChange(v)}
                                min={0}
                                max={100}
                                step={1}
                                disabled={props.disableNonBrowse}
                            />
                        </div>
                        <div className={`release-date px-3 my-3 ${props.disableNonBrowse ? 'disabled' : ''}`}>
                            <div>Release Date</div>
                            <div className="mt-2">
                                <div className="date-picker cursor-pointer d-inline-block">
                                    <DatePicker
                                        selected={props.releaseDateStart}
                                        onChange={props.onReleaseDateStartChange}
                                        placeholderText="Start date"
                                        disabled={props.disableNonBrowse}
                                    />
                                </div>
                                <div className="divider text-center d-inline-block">—</div>
                                <div className="date-picker cursor-pointer d-inline-block">
                                    <DatePicker
                                        selected={props.releaseDateEnd}
                                        onChange={props.onReleaseDateEndChange}
                                        placeholderText="End date"
                                        disabled={props.disableNonBrowse}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`genres px-3 my-3 ${props.disableNonBrowse ? 'disabled' : ''}`}>
                            <div>Genres</div>
                            <FormControl className="filter-multi-select w-100">
                                <Select
                                    multiple
                                    value={props.genresSelection}
                                    onChange={props.onGenresSelectionChange}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={(selected: any) => (
                                        <div>
                                            {selected.map((x: IdNamePair) => (
                                                <Chip key={x.id} className="chip m-2" label={x.name}/>
                                            ))}
                                        </div>
                                    )}
                                    disabled={props.disableNonBrowse}
                                >
                                    {props.genreOptions.map((x: IdNamePair) => (
                                        <MenuItem key={x.id} value={x.name}>
                                            {x.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={`platforms px-3 my-3 ${props.disableNonBrowse ? 'disabled' : ''}`}>
                            <div>Platforms</div>
                            <FormControl className="filter-multi-select w-100">
                                <Select
                                    multiple
                                    value={props.platformsSelection}
                                    onChange={props.onPlatformSelectionChange}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={(selected: any) => (
                                        <div>
                                            {selected.map((x: IdNamePair) => (
                                                <Chip key={x.id} className="chip m-2" label={x.name}/>
                                            ))}
                                        </div>
                                    )}
                                    disabled={props.disableNonBrowse}
                                >
                                    {props.platformOptions.map((x: IdNamePair) => (
                                        <MenuItem key={x.id} value={x.name}>
                                            {x.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={`category px-3 my-3 ${props.disableNonBrowse ? 'disabled' : ''}`}>
                            <div>Category</div>
                            <FormControl className="filter-multi-select w-100">
                                <Select
                                    multiple
                                    value={props.categorySelection}
                                    onChange={props.onCategorySelectionChange}
                                    input={<Input id="select-multiple-chip" />}
                                    renderValue={(selected: any) => (
                                        <div>
                                            {selected.map((x: IdNamePair) => (
                                                <Chip key={x.id} className="chip m-2" label={x.name}/>
                                            ))}
                                        </div>
                                    )}
                                    disabled={props.disableNonBrowse}
                                >
                                    {props.categoryOptions.map((x: IdNamePair) => (
                                        <MenuItem key={x.id} value={x.name}>
                                            {x.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        <div className={`required px-3 my-3 ${props.disableNonBrowse ? 'disabled' : ''}`}>
                            <div className="mb-2">Required</div>
                            <FormControlLabel
                                className="filter-checkbox"
                                control={
                                    <Checkbox className="check" checked={props.cover} value={props.cover} onChange={(event: any, checked: boolean) => props.onCoverClick(checked)} />
                                }
                                label="Cover"
                                disabled={props.disableNonBrowse}
                            />
                            <FormControlLabel
                                className="filter-checkbox"
                                control={
                                    <Checkbox className="check" checked={props.screenshots} value={props.screenshots} onChange={(event: any, checked: boolean) => props.onScreenshotsClick(checked)} />
                                }
                                label="Screenshots"
                                disabled={props.disableNonBrowse}
                            />
                            <FormControlLabel
                                className="filter-checkbox"
                                control={
                                    <Checkbox className="check" checked={props.trailer} value={props.trailer} onChange={(event: any, checked: boolean) => props.onTrailerClick(checked)} />
                                }
                                label="Trailer"
                                disabled={props.disableNonBrowse}
                            />
                        </div>
                        <div className={`sorting px-3 ${props.disableNonBrowse ? 'disabled' : ''}`}>
                            <div className="mb-2">Sorting</div>
                            <FormControl>
                                <Select
                                    className="filter-select text-center"
                                    value={props.sortingSelection}
                                    onChange={props.onSortingSelectionChange}
                                    name="w-100"
                                    disabled={props.disableNonBrowse}
                                >
                                    {props.sortingOptions && 
                                        props.sortingOptions.map((x: IdNamePair) => 
                                            <MenuItem value={x.id}>{x.name}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </div>
                        {!props.disableNonBrowse && 
                            <div className="refresh color-primary cursor-pointer text-center text-uppercase font-weight-bold mt-4" onClick={props.onRefreshClick}>
                                Refresh
                            </div>}
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Filter;