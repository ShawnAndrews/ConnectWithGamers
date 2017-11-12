import * as React from 'react';
import PropTypes from 'prop-types';

export default class NotFound extends React.Component {


  constructor(props){
    super(props);
    console.log("NotFound");
  }

  render() {
    console.log("Child rendered");
    return (
      <p>Cloud Storage page not found, sorry!</p>
    );
  }

}
