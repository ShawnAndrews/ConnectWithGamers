import * as React from 'react';
import { Button } from '@material-ui/core';

interface ISteamInfoProps {
    steam_url: string;
    price: string;
    discount_percent: number;
    handleSteamClick: (url: string) => void;
}

const SteamInfo: React.SFC<ISteamInfoProps> = (props: ISteamInfoProps) => {

    const discounted: boolean = props.discount_percent !== 0;

    return (
        <div className="steam-info">
            {props.steam_url && 
                <Button
                    className="steam-btn" 
                    variant="raised"
                    onClick={() => { props.handleSteamClick(props.steam_url); }}
                >
                    Steam page
                </Button>}
            {props.price && 
                <div className="price-container d-inline-block bg-primary-solid color-secondary">
                    {(props.price === 'Free' || props.price === 'Coming Soon')
                        ? <div className="p-1 px-2">{props.price}</div>
                        : 
                        <>
                            <div className={`usd ${!discounted ? 'nodiscount' : ''} d-inline-block`}>${props.price} USD</div>
                            {discounted && 
                                <div className="discount d-inline-block mx-2"><span>{'(-' + props.discount_percent + '% SALE)'}</span></div>}
                        </>}
                </div>}
        </div>
    );

};

export default SteamInfo;