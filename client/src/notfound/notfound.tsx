import * as React from 'react';
import { withRouter } from 'react-router-dom';

interface INotFoundProps {
  history: any;
}

class NotFound extends React.Component<INotFoundProps, any> {

  constructor(props: INotFoundProps) {
      super(props);
      this.onClickHomeButton = this.onClickHomeButton.bind(this);
  }

  onClickHomeButton() {
    this.props.history.push('/');
  }

  render() {
    return (
        <div className="notfound">
            <div className="notfound-header">404</div>
            <div className="notfound-info">Page not found!</div>
            <button type="button" className="notfound-home-button" onClick={this.onClickHomeButton}><i className="fa fa-home notfound-home-icon"/>Home</button>
        </div>
    );
  }

}

export default withRouter(NotFound);