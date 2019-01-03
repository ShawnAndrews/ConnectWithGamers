import * as React from 'react';
import { Button } from '@material-ui/core';

interface ISteamInfoProps {
    steam: string;
    price: string;
    discount_percent: number;
    handleSteamClick: (url: string) => void;
}

const SteamInfo: React.SFC<ISteamInfoProps> = (props: ISteamInfoProps) => {

    const discounted: boolean = props.discount_percent && props.discount_percent !== 0;

    return (
        <div className="price-container w-100">
            {props.steam && 
                <Button
                    className="steam-btn d-inline-block h-100" 
                    variant="raised"
                    onClick={() => { props.handleSteamClick(props.steam); }}
                >
                    Buy now
                </Button>}
            {props.price && 
                <div className="price d-inline-block color-secondary h-100">
                    {(props.price === 'Free' || props.price === 'Coming Soon')
                        ? <div className="p-1 px-2">{props.price}</div>
                        : 
                        <>
                            <div className={`usd ${!discounted ? 'nodiscount' : ''} d-inline-block`}>${props.price} USD</div>
                            {discounted && 
                                <div className="discount d-inline-block mx-2"><span>{'-' + props.discount_percent + '%'}</span></div>}
                        </>}
                </div>}
        </div>
    );

};

export default SteamInfo;