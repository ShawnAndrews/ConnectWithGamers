import * as React from 'react';

interface INotFoundPageProps {
  onClickHomeButton: () => void;
}

const NotFoundPage: React.SFC<INotFoundPageProps> = (props: INotFoundPageProps) => {

    return (
      <div className="notfound">
        <div className="notfound-header">404</div>
        <div className="notfound-info">Page not found!</div>
        <button type="button" className="notfound-home-button" onClick={props.onClickHomeButton}><i className="fa fa-home notfound-home-icon"/>Home</button>
      </div>
    );

};

export default NotFoundPage;