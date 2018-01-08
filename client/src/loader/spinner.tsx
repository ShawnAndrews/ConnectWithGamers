import * as React from 'react';

import '../styles/spinner/main';

interface ISpinnerProps {
    loadingMsg: string;
}

class Spinner extends React.Component<ISpinnerProps, any> {

    constructor(props: ISpinnerProps) {
        super(props);
    }

    render() {
        return (
            <div className="login-spinner">
                <i className="fa fa-spinner fa-pulse fa-5x fa-fw"/>
                {this.props.loadingMsg &&
                    <div className="login-spinner-message">{this.props.loadingMsg}</div>
                    }
            </div>
        );
    }

}

export default Spinner;