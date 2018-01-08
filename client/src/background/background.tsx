import * as React from 'react';

import '../styles/background';

class Background extends React.Component<any, any> {

    constructor(props: any) {
        super(props);
    }

  render() {
    return (
        <div className="background">
            <ul className="background-floats">
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
                <li/>
            </ul>
        </div>
    );
  }

}

export default Background;