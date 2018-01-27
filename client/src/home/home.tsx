import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface IHomeProps {
    history: any;
}

class Home extends React.Component<IHomeProps, any> {

    constructor(props: IHomeProps) {
        super(props);
    }

    render() {

        return (
            <div>
                HOME
            </div>
        );

    }

}

export default withRouter(Home);