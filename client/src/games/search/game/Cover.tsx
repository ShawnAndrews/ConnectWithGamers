import * as React from 'react';
import { steamAppUrl } from '../../../../client-server-common/common';

interface ICoverProps {
    steamId: number;
    url: string;
}

const Cover: React.SFC<ICoverProps> = (props: ICoverProps) => {

    return (
        <a href={`${steamAppUrl}/${props.steamId}`} target="_blank"><img className="w-100" src={props.url} /></a>
    );

};

export default Cover;