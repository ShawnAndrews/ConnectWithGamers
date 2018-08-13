const popupS = require('popups');
import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

interface INotFoundPageContainerProps extends RouteComponentProps<any> { } 

class NotFoundPageContainer extends React.Component<INotFoundPageContainerProps, any> {

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