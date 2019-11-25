import * as React from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Select, FormControl, MenuItem, Input, Chip, Slider } from '@material-ui/core';
import { IdNamePair, CurrencyType } from '../../../../client-server-common/common';
import { SortingOptionEnum, MIN_PRICE_RANGE, MAX_PRICE_RANGE } from './FilterContainer';
import { getCurrencySymbol } from '../../../util/main';

interface IFilterProps {
    priceRange: number[];
    onPricesChange: (event: any, newValue: number | number[]) => void;
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
    onRefreshClick: () => void;
    onSearchKeypress: (event: React.KeyboardEvent<Element>) => void;
    onSearchQueryChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
    currencyType: CurrencyType;
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
                        <div className={`searchbar w-100 has-search mb-2 mx-auto`}>
                            <span className="fa fa-search form-control-feedback"/>
                            <input type="text" className="form-control" placeholder="Game title" onChange={props.onSearchQueryChanged} onKeyPress={props.onSearchKeypress} />
                        </div>
                        <div className={`release-date px-3 my-3`}>
                            <div>Release Date</div>
                            <div className="mt-2">
                                <div className="date-picker left cursor-pointer d-inline-block position-relative">
                                    <DatePicker
                                        selected={props.releaseDateStart}
                                        onChange={props.onReleaseDateStartChange}
                                        placeholderText="Start date"
                                    />
                                </div>
                                <div className="divider text-center d-inline-block">—</div>
                                <div className="date-picker right cursor-pointer d-inline-block position-relative">
                                    <DatePicker
                                        selected={props.releaseDateEnd}
                                        onChange={props.onReleaseDateEndChange}
                                        placeholderText="End date"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`genres px-3 my-3`}>
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
                        <div className={`platforms px-3 my-3`}>
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
                        <div className={`sorting px-3 `}>
                            <div className="mb-2">Sorting</div>
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
                        <div className={`prices px-3 mt-4 mb-5`}>
                            Price — {getCurrencySymbol(props.currencyType)} {props.priceRange[0]} to {getCurrencySymbol(props.currencyType)} {props.priceRange[1]} {props.currencyType}
                            <Slider
                                className="slider mt-3"
                                value={props.priceRange}
                                onChange={props.onPricesChange}
                                valueLabelDisplay="auto"
                                min={MIN_PRICE_RANGE}
                                max={MAX_PRICE_RANGE}
                            />
                        </div>
                        <div className="refresh color-primary cursor-pointer text-center text-uppercase font-weight-bold mt-4" onClick={props.onRefreshClick}>
                            Refresh
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

};

export default Filter;