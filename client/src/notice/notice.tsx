import * as React from 'react';

interface INoticeProps {
  message: string;
}

class Notice extends React.Component<INoticeProps, any> {

  constructor(props: INoticeProps) {
      super(props);
  }

  render() {
    return (
      <div className="notice">
          <p>{this.props.message}</p>
      </div>
    );
  }

}

export default Notice;