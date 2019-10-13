import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Topnav from './Topnav';
import { IdNamePair } from '../../../../../client-server-common/common';
import { SortingOptionEnum } from '../../../sidenav/filter/FilterContainer';

interface ITopnavContainerProps extends RouteComponentProps<any> {
    title: string;
    onSortingSelectionChange: (event: any) => void;
    sortingSelection: SortingOptionEnum;
    totalGames: number;
}

interface ITopnavContainerState {
    title: string;
    sortingOptions: IdNamePair[];
}

class TopnavContainer extends React.Component<ITopnavContainerProps, ITopnavContainerState> {

    constructor(props: ITopnavContainerProps) {
        super(props);

        const sortingOptions: IdNamePair[] = [
            { id: SortingOptionEnum.PopularityAsc, name: 'Popularity ↑' },
            { id: SortingOptionEnum.PopularityDesc, name: 'Popularity ↓' },
            { id: SortingOptionEnum.ReleaseDateAsc, name: 'Release Date ↑' },
            { id: SortingOptionEnum.ReleaseDateDesc, name: 'Release Date ↓' },
            { id: SortingOptionEnum.AlphabeticallyAsc, name: 'Alphabetical ↑' },
            { id: SortingOptionEnum.AlphabeticallyDesc, name: 'Alphabetical ↓' },
        ];

        this.state = {
            title: props.title,
            sortingOptions: sortingOptions
        };
    }

    render() {
        return (
            <Topnav
                goBack={this.props.history.goBack}
                title={this.state.title}
                sortingOptions={this.state.sortingOptions}
                sortingSelection={this.props.sortingSelection}
                onSortingSelectionChange={this.props.onSortingSelectionChange}
                totalGames={this.props.totalGames}
            />
        );
    }

}

export default withRouter(TopnavContainer);