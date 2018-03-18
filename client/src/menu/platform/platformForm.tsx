import * as React from 'react';
import { withRouter } from 'react-router-dom';
import { PlatformOption, platformOptions } from './platformGameListForm';

interface IPlatformMenuItem {
    imgSrc: string;
    platformOption: PlatformOption;
}

interface IPlatformFormProps {
    history: any;
}

class PlatformForm extends React.Component<IPlatformFormProps, any> {

    constructor(props: IPlatformFormProps) {
        super(props);
        this.setDefaultState = this.setDefaultState.bind(this);
        this.setDefaultState();
    }

    private setDefaultState(): void {
        const platformMenuItems: IPlatformMenuItem[] = [];
        const platformURL: string = '/menu/platform';

        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/1vDwtju.png', platformOption: platformOptions[0] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/FUaI1r1.png', platformOption: platformOptions[1] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/CFu1lX1.png', platformOption: platformOptions[2] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/dPd4Tqc.png', platformOption: platformOptions[3] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/aaEcKiz.png', platformOption: platformOptions[4] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/IM1Tliy.png', platformOption: platformOptions[5] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/E2RrnNw.png', platformOption: platformOptions[6] });
        platformMenuItems.push({ imgSrc: 'https://i.imgur.com/Hgco6Gy.png', platformOption: platformOptions[7] });

        this.state = {platformURL: platformURL, platformMenuItems: platformMenuItems};
    }

    render() {

        return (
            <div>
                {this.state.platformMenuItems && this.state.platformMenuItems
                    .map((x: IPlatformMenuItem) => {
                        return (
                            <div key={x.imgSrc} className="menu-item" onClick={() => this.props.history.push(`${this.state.platformURL}/${x.platformOption.id}`)}>
                                <div className="menu-item-overlay"/>
                                <div className="menu-item-content">
                                    <img src={x.imgSrc}/>
                                </div>
                            </div>
                        );
                    })}
            </div>
        );       

    }

}

export default withRouter(PlatformForm);