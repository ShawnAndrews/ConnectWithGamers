const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

interface INotFoundPageContainerProps {
    history: any;
}

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