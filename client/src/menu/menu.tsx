import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface IMenuProps {
    history: any;
}

class Menu extends React.Component<IMenuProps, any> {

    constructor(props: IMenuProps) {
        super(props);
    }

    render() {

        return (
            <div>
                MENU
            </div>
        );

    }

}

export default withRouter(Menu);