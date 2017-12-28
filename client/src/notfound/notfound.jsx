import * as React from 'react';
import {withRouter} from "react-router-dom";
import PropTypes from 'prop-types';

import '../styles/notfound';

class NotFound extends React.Component {

    constructor(props){
        super(props);
    }

  render() {
    return (
        <div class="notfound">
            <div class="notfound-header">404</div>
            <div class="notfound-info">Page not found!</div>
            <button type="button" class="notfound-home-button" onClick={this.props.history.push('/')}><i class="fa fa-home notfound-home-icon" />Home</button>
        </div>
    );
  }

}

NotFound.propTypes = {
  history: PropTypes.object.isRequired
}

export default withRouter(NotFound);