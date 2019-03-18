import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { NewsArticle } from '../../../../client-server-common/common';
import FullsizeNews from './FullsizeNews';

interface IFullsizeNewsContainerProps extends RouteComponentProps<any> {
    news: NewsArticle;
}

interface IFullsizeNewsContainerState {

}

class FullsizeNewsContainer extends React.Component<IFullsizeNewsContainerProps, IFullsizeNewsContainerState> {

    constructor(props: IFullsizeNewsContainerProps) {
        super(props);

        this.state = {

        };
    }

    render() {
        return (
            <FullsizeNews
                news={this.props.news}
            />
        );
    }

}

export default withRouter(FullsizeNewsContainer);