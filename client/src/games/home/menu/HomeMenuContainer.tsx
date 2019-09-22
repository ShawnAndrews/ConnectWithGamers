const popupS = require('popups');
const loadImage = require('image-promise');
import * as React from 'react';
import * as SteamService from '../../../service/steam/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, MultiGameResponse, ExcludedGameIds } from '../../../../client-server-common/common';
import HomeMenu from './HomeMenu';

interface IHomeMenuContainerProps extends RouteComponentProps<any> {
    
}

interface IHomeMenuContainerState {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    retry: boolean;
    editorsGamesIndicies: number[];
    bigGamesIndicies: number[];
}

class FullsizeResultsContainer extends React.Component<IHomeMenuContainerProps, IHomeMenuContainerState> {

    constructor(props: IHomeMenuContainerProps) {
        super(props);
        this.loadGames = this.loadGames.bind(this);
        this.onRetryClick = this.onRetryClick.bind(this);

        this.loadGames(props);

        this.state = {
            isLoading: true,
            loadingMsg: "Loading games...",
            games: undefined,
            retry: false,
            editorsGamesIndicies: [],
            bigGamesIndicies: [2,17,28,33]
        };
    }

    componentWillReceiveProps(newProps: IHomeMenuContainerProps): void {
        const pathChanged: boolean = newProps.location.pathname !== this.props.location.pathname;

        if (pathChanged) {
            this.loadGames(newProps);

            this.setState({
                isLoading: true
            });
        }
    }

    loadGames(someProps: IHomeMenuContainerProps): void {
        const clientPath: string = someProps.location.pathname;
        let serverPath: string;

        if (clientPath.startsWith("/search/steam/popular")) {
            serverPath = "/steam/steam/popular";
        } else if (clientPath.startsWith("/search/steam/recent")) {
            serverPath = "/steam/steam/recent";
        } else if (clientPath.startsWith("/search/steam/upcoming")) {
            serverPath = "/steam/steam/upcoming";
        } else if (clientPath.startsWith("/search/steam/genre/action")) {
            serverPath = "/steam/steam/genre/action";
        } else if (clientPath.startsWith("/search/steam/genre/adventure")) {
            serverPath = "/steam/steam/genre/adventure";
        } else if (clientPath.startsWith("/search/steam/genre/casual")) {
            serverPath = "/steam/steam/genre/casual";
        } else if (clientPath.startsWith("/search/steam/genre/strategy")) {
            serverPath = "/steam/steam/genre/strategy";
        } else if (clientPath.startsWith("/search/steam/genre/racing")) {
            serverPath = "/steam/steam/genre/racing";
        } else if (clientPath.startsWith("/search/steam/genre/simulation")) {
            serverPath = "/steam/steam/genre/simulation";
        } else if (clientPath.startsWith("/search/steam/genre/sports")) {
            serverPath = "/steam/steam/genre/sports";
        } else if (clientPath.startsWith("/search/steam/genre/indie")) {
            serverPath = "/steam/steam/genre/indie";
        } else if (clientPath.startsWith("/search/steam/genre/2d")) {
            serverPath = "/steam/steam/genre/2d";
        } else if (clientPath.startsWith("/search/steam/genre/puzzle")) {
            serverPath = "/steam/steam/genre/puzzle";
        } else if (clientPath.startsWith("/search/steam/genre/shooter")) {
            serverPath = "/steam/steam/genre/shooter";
        } else if (clientPath.startsWith("/search/steam/genre/rts")) {
            serverPath = "/steam/steam/genre/rts";
        } else if (clientPath.startsWith("/search/steam/genre/towerdefence")) {
            serverPath = "/steam/steam/genre/towerdefence";
        } else if (clientPath.startsWith("/search/steam/weeklydeals")) {
            serverPath = "/steam/steam/weeklydeals";
        } else if (clientPath.startsWith("/search/steam/compmulti")) {
            serverPath = "/steam/steam/compmulti";
        } else if (clientPath.startsWith("/search/steam/freeonlinemulti")) {
            serverPath = "/steam/steam/freeonlinemulti";
        } else if (clientPath.startsWith("/search/steam/paidonlinemulti")) {
            serverPath = "/steam/steam/paidonlinemulti";
        } else if (clientPath.startsWith("/search/steam/mostdifficult")) {
            serverPath = "/steam/steam/mostdifficult";
        } else if (clientPath.startsWith("/search/steam/horror")) {
            serverPath = "/steam/steam/horror";
        } else if (clientPath.startsWith("/search/steam/mobo")) {
            serverPath = "/steam/steam/moba";
        } else if (clientPath.startsWith("/search/steam/vrhtc")) {
            serverPath = "/steam/steam/vrhtc";
        } else if (clientPath.startsWith("/search/steam/vrvive")) {
            serverPath = "/steam/steam/vrvive";
        } else if (clientPath.startsWith("/search/steam/vrwindows")) {
            serverPath = "/steam/steam/vrwindows";
        } else if (clientPath.startsWith("/search/steam/vrall")) {
            serverPath = "/steam/steam/vrall";
        } else if (clientPath.startsWith("/search/steam/earlyaccess")) {
            serverPath = "/steam/steam/earlyaccess";
        } else if (clientPath.startsWith("/search/steam/openworld")) {
            serverPath = "/steam/steam/openworld";
        } else if (clientPath.startsWith("/search/steam/fps")) {
            serverPath = "/steam/steam/fps";
        } else if (clientPath.startsWith("/search/steam/cards")) {
            serverPath = "/steam/steam/cards";
        } else if (clientPath.startsWith("/search/steam/mmorpg")) {
            serverPath = "/steam/steam/mmorpg";
        } else if (clientPath.startsWith("/search/steam/survival")) {
            serverPath = "/steam/steam/survival";
        }

        SteamService.httpGenericGetData<MultiGameResponse>(serverPath)
        .then( (response: MultiGameResponse) => {
            const games: GameResponse[] = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1);

            this.setState({
                loadingMsg: 'Loading images...',
                games: games
            }, () => {
                const allScreenshots: string[] = [].concat(...this.state.games.map((x: GameResponse) => x.screenshots));

                loadImage(allScreenshots)
                .then(() => {
                    this.setState({ isLoading: false });
                })
                .catch((error: Object) => {
                    this.setState({ isLoading: false });
                });
            });
        })
        .catch( (error: string) => {
            let retry: boolean = error === "Retry";
            if (!retry) {
                popupS.modal({ content: `<div>• ${error}</div>` });
            }
            this.setState({ isLoading: false, retry: retry});
        });

    }

    onRetryClick(): void {
        this.setState({ isLoading: true, retry: false }, () => {
            this.loadGames(this.props);
        });
    }

    render() {
        return (
            <HomeMenu
                isLoading={this.state.isLoading}
                loadingMsg={this.state.loadingMsg}
                games={this.state.games}
                retry={this.state.retry}
                onRetryClick={this.onRetryClick}
                editorsGamesIndicies={this.state.editorsGamesIndicies}
                bigGamesIndicies={this.state.bigGamesIndicies}
            />
        );
    }

}

export default withRouter(FullsizeResultsContainer);