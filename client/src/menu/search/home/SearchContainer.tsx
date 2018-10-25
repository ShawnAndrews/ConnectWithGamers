import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Search from './Search';

interface ISearchContainerProps extends RouteComponentProps<any> { }

interface ISearchContainerState {
    gameId: number;
}

class SearchContainer extends React.Component<ISearchContainerProps, ISearchContainerState> {

    constructor(props: ISearchContainerProps) {
        super(props);
        this.state = { 
            gameId: this.props.match.params.id
        };
    }

    render() {
        return (
            <Search/>
        );
    }

}

export default withRouter(SearchContainer);