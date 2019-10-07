import * as React from 'react';
import { PriceInfoResponse } from '../../../../client-server-common/common';
import { getUniquePricings } from '../../../util/main';

interface IPriceHistoryProps {
    pricings: PriceInfoResponse[];
}

const PriceHistory: React.SFC<IPriceHistoryProps> = (props: IPriceHistoryProps) => {

    if (props.pricings && props.pricings.length === 0) {
        return <h3 className="text-center my-4">Game does not have any pricings.</h3>;
    }

    const uniquePricings: PriceInfoResponse[] = getUniquePricings(props.pricings);

    return (
        <div className="price-history">
            {uniquePricings.length > 0 && 
                uniquePricings.map((pricing: PriceInfoResponse, i: number) => {
                    return <canvas id={`lineChart${i}`}/>;
                })}
        </div>
    );

};

export default PriceHistory;