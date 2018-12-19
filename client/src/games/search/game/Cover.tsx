import * as React from 'react';

interface ICoverProps {
    cover: string;
    screenshots: string[];
}

const Cover: React.SFC<ICoverProps> = (props: ICoverProps) => {

    const blurredScreenshot: string = props.screenshots ? props.screenshots[0] : undefined;

    return (
        <>
            {blurredScreenshot && 
                <div className="blurred-screenshot position-relative">
                    <img className="w-100" src={blurredScreenshot}/>
                </div>}
            <div className="cover text-center">
                <img src={props.cover || 'https://i.imgur.com/WcPkTiF.png'} alt="Game cover"/>
            </div>
        </>
    );

};

export default Cover;