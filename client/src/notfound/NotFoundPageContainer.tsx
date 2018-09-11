import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

interface INotFoundPageContainerProps extends RouteComponentProps<any> { } 

interface INotFoundPageContainerState { }

class NotFoundPageContainer extends React.Component<INotFoundPageContainerProps, INotFoundPageContainerState> {

    constructor(props: INotFoundPageContainerProps) {
        super(props);
        this.onClickHomeButton = this.onClickHomeButton.bind(this);
    }

    onClickHomeButton(): void {
        this.props.history.push('/');
    }

    render() {
        return (
            <NotFoundPage
                onClickHomeButton={this.onClickHomeButton}
            />
        );
    }

}

export default withRouter(NotFoundPageContainer);