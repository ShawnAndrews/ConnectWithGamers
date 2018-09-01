import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

interface ISpinnerProps {
    className?: string;
    loadingMsg: string;
}

class Spinner extends React.Component<ISpinnerProps, any> {

    constructor(props: ISpinnerProps) {
        super(props);
    }

    render() {
        return (
            <div className={`login-spinner ${this.props.className ? this.props.className : ''}`}>
                <CircularProgress
                    className="login-spinner-circle"
                    size={120} 
                    thickness={2}
                />
                {this.props.loadingMsg &&
                    <div className="login-spinner-message">{this.props.loadingMsg}</div>
                    }
            </div>
        );
    }

}

export default Spinner;