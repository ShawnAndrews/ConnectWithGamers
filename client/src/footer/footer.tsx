import * as React from 'react';

interface IFooterProps { }

const Footer: React.SFC<IFooterProps> = (props: IFooterProps) => {

    return (
        <div className="footer text-center font-italic">
            <div className="d-inline-block">In partnership with IGDB.com</div>
            <a href="https://www.igdb.com"><img src="https://i.imgur.com/8127Huh.png" height="32px"/></a>
        </div>
    );

};

export default Footer;