import * as React from 'react';
import PropTypes from 'prop-types';

import '../styles/background';

class Background extends React.Component {

    constructor(props){
        super(props);
    }

  render() {
    return (
        <div class="background">
            <ul class="background-floats">
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

Background.propTypes = {
    
}

export default Background;