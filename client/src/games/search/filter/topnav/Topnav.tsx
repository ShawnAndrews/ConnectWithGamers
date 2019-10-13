import * as React from 'react';
import { Paper, Select, MenuItem } from '@material-ui/core';
import { IdNamePair } from '../../../../../client-server-common/common';
import { SortingOptionEnum } from '../../../sidenav/filter/FilterContainer';

interface ITopnavProps {
    goBack: () => void;
    title: string;
    sortingOptions: IdNamePair[];
    sortingSelection: SortingOptionEnum;
    onSortingSelectionChange: (event: any) => void;
    totalGames: number;
}

const Topnav: React.SFC<ITopnavProps> = (props: ITopnavProps) => {
    
    return (
        <div className="topnav p-2 mx-auto">
            <div className="text-center color-tertiary mb-3 mt-2">
                {props.title}
            </div>
            <hr/>
            <div className="total-results d-inline-block">Total results: {props.totalGames}</div>
            <div className="filter-wrapper align-top d-inline-block">
                <div className="title color-tertiary mr-2">Sort by</div>
                <Select
                    className="filter-select text-center short"
                    value={props.sortingSelection}
                    onChange={props.onSortingSelectionChange}
                >
                    {props.sortingOptions && 
                        props.sortingOptions.map((x: IdNamePair) => 
                            <MenuItem value={x.id}>{x.name}</MenuItem>)}
                </Select>
            </div>
            <hr/>
        </div>
    );

}; 

export default Topnav;