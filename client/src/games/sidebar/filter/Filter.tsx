import * as React from 'react';
import Slider from '@material-ui/lab/Slider';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Select, FormControl, MenuItem, InputLabel, Input, Chip, FormControlLabel, Checkbox } from '@material-ui/core';
import { IdNamePair } from '../../../../client-server-common/common';
import { SortingOptionEnum } from './FilterContainer';
import FormGroup from 'reactstrap/lib/FormGroup';

interface IFilterProps {
    expanded: boolean;
    popularity: number;
    onPopularityChange: (value: number) => void;
    releaseDateStart: Date;
    releaseDateEnd: Date;
    onExpandClick: () => void;
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
    cover: boolean;
    screenshots: boolean;
    trailer: boolean;
}

const Filter: React.SFC<IFilterProps> = (props: IFilterProps) => {

    return (
        <div className={`filter ${props.expanded ? 'expanded' : ''} overflow-hidden w-100 mb-4`}>
            <div className="title cursor-pointer text-center text-uppercase font-weight-bold" onClick={props.onExpandClick}>
                Filter
            </div>
            {props.expanded &&
                <div className="options">
                    <div className="popularity px-3">
                        Popularity — {props.popularity}%+
                        <Slider
                            className="slider my-2"
                            value={props.popularity}
                            onChange={(e: any, v: any) => props.onPopularityChange(v)}
                            min={0}
                            max={100}
                            step={1}
                        />
                    </div>
                    <div className="release-date px-3 mt-3">
                        <div>Release Date</div>
                        <div>
                            <div className="date-picker cursor-pointer d-inline-block">
                                <DatePicker
                                    selected={props.releaseDateStart}
                                    onChange={props.onReleaseDateStartChange}
                                    placeholderText="Start date"
                                />
                            </div>
                            <div className="divider text-center d-inline-block">—</div>
                            <div className="date-picker cursor-pointer d-inline-block">
                                <DatePicker
                                    selected={props.releaseDateEnd}
                                    onChange={props.onReleaseDateEndChange}
                                    placeholderText="End date"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="genres px-3">
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
                            >
                                {props.genreOptions.map((x: IdNamePair) => (
                                    <MenuItem key={x.id} value={x.name}>
                                        {x.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="platforms px-3">
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
                            >
                                {props.platformOptions.map((x: IdNamePair) => (
                                    <MenuItem key={x.id} value={x.name}>
                                        {x.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="category px-3">
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
                            >
                                {props.categoryOptions.map((x: IdNamePair) => (
                                    <MenuItem key={x.id} value={x.name}>
                                        {x.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="required px-3">
                        <div>Required</div>
                        <FormControlLabel
                            className="filter-checkbox"
                            control={
                                <Checkbox className="check" checked={props.cover} value={props.cover} onChange={(event: any, checked: boolean) => props.onCoverClick(checked)} />
                            }
                            label="Cover"
                        />
                        <FormControlLabel
                            className="filter-checkbox"
                            control={
                                <Checkbox className="check" checked={props.screenshots} value={props.screenshots} onChange={(event: any, checked: boolean) => props.onScreenshotsClick(checked)} />
                            }
                            label="Screenshots"
                        />
                        <FormControlLabel
                            className="filter-checkbox"
                            control={
                                <Checkbox className="check" checked={props.trailer} value={props.trailer} onChange={(event: any, checked: boolean) => props.onTrailerClick(checked)} />
                            }
                            label="Trailer"
                        />
                    </div>
                    <div className="sorting px-3">
                        <div>Sorting</div>
                        <FormControl>
                            <Select
                                className="filter-select text-center"
                                value={props.sortingSelection}
                                onChange={props.onSortingSelectionChange}
                                name="w-100"
                            >
                                {props.sortingOptions && 
                                    props.sortingOptions.map((x: IdNamePair) => 
                                        <MenuItem value={x.id}>{x.name}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="refresh color-primary cursor-pointer text-center text-uppercase font-weight-bold mt-4" onClick={props.onRefreshClick}>
                        Refresh
                    </div>
                </div>}
        </div>
    );

};

export default Filter;