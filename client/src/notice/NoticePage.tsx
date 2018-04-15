import * as React from 'react';

interface INoticePageProps {
  message: string;
}

const NoticePage: React.SFC<INoticePageProps> = (props: INoticePageProps) => {

  return (
    <div className="notice">
      <p>{props.message}</p>
    </div>
  );

};

export default NoticePage;