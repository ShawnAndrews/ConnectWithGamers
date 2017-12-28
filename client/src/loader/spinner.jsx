import * as React from 'react';
import PropTypes from 'prop-types';

import '../styles/loginSpinner';

class Spinner extends React.Component {

    constructor(props){
        super(props);
    }

  render() {
    return (
        <div class="login-spinner">
            <i class="fa fa-spinner fa-pulse fa-5x fa-fw"/>
            {this.props.loadingMsg &&
                <div class='login-spinner-message'>{this.props.loadingMsg}</div>
                }
        </div>
    );
  }

}

Spinner.propTypes = {
    loadingMsg: PropTypes.string
}

export default Spinner;