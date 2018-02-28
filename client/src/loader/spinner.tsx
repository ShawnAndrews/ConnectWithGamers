import * as React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

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
                <CircularProgress color="whitesmoke" size={120} thickness={7}/>
                {this.props.loadingMsg &&
                    <div className="login-spinner-message">{this.props.loadingMsg}</div>
                    }
            </div>
        );
    }

}

export default Spinner;