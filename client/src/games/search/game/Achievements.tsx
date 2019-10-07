import * as React from 'react';
import { Achievement } from '../../../../client-server-common/common';

interface IAchievementsProps {
    achievements: Achievement[];
}

const Achievements: React.SFC<IAchievementsProps> = (props: IAchievementsProps) => {

    return (
        <div className="achievements">
            {props.achievements.length === 0 &&
                    <h3 className="text-center my-4">Game does not have any achievements.</h3>}
            {props.achievements.length > 0 &&
                <div>
                    <div className="info-header"><span className="float-left">{props.achievements.length} Total achievements</span><span className="float-right">% of players completed achievement</span></div>
                    {props.achievements
                        .sort((a: Achievement, b: Achievement) => b.percent - a.percent)
                        .map((x: Achievement, index: number) => {
                            return (
                                <div key={index} className="achievement w-100 my-4">
                                    <img src={x.link}/>
                                    <div className="title">{x.name}</div>
                                    <div className="description">{x.description}</div>
                                    <div className="stat-bar">
                                        <span className="stat-bar-rating" role="stat-bar" style={{ width: `${x.percent}%` }}/>
                                        <span className="percent-text pl-2">{x.percent}%</span>
                                    </div>
                                </div>
                            );
                        })}
                </div>}
        </div>
    );

};

export default Achievements;