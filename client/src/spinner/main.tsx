import * as React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

interface ISpinnerProps {
    className?: string;
    loadingMsg: string;
}

interface ISpinnerState { }

class Spinner extends React.Component<ISpinnerProps, ISpinnerState> {

    constructor(props: ISpinnerProps) {
        super(props);
    }

    render() {
        return (
            <div className={`login-spinner ${this.props.className ? this.props.className : ''}`}>
                <CircularProgress
                    size={120} 
                    thickness={2}
                />
                {this.props.loadingMsg &&
                    <div className="my-3">{this.props.loadingMsg}</div>
                    }
            </div>
        );
    }

}

export default Spinner;