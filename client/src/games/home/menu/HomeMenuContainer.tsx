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
            serverPath = "/api/steam/popular";
        } else if (clientPath.startsWith("/search/steam/recent")) {
            serverPath = "/api/steam/recent";
        } else if (clientPath.startsWith("/search/steam/upcoming")) {
            serverPath = "/api/steam/upcoming";
        } else if (clientPath.startsWith("/search/steam/genre/action")) {
            serverPath = "/api/steam/genre/action";
        } else if (clientPath.startsWith("/search/steam/genre/adventure")) {
            serverPath = "/api/steam/genre/adventure";
        } else if (clientPath.startsWith("/search/steam/genre/casual")) {
            serverPath = "/api/steam/genre/casual";
        } else if (clientPath.startsWith("/search/steam/genre/strategy")) {
            serverPath = "/api/steam/genre/strategy";
        } else if (clientPath.startsWith("/search/steam/genre/racing")) {
            serverPath = "/api/steam/genre/racing";
        } else if (clientPath.startsWith("/search/steam/genre/simulation")) {
            serverPath = "/api/steam/genre/simulation";
        } else if (clientPath.startsWith("/search/steam/genre/sports")) {
            serverPath = "/api/steam/genre/sports";
        } else if (clientPath.startsWith("/search/steam/genre/indie")) {
            serverPath = "/api/steam/genre/indie";
        } else if (clientPath.startsWith("/search/steam/genre/2d")) {
            serverPath = "/api/steam/genre/2d";
        } else if (clientPath.startsWith("/search/steam/genre/puzzle")) {
            serverPath = "/api/steam/genre/puzzle";
        } else if (clientPath.startsWith("/search/steam/genre/shooter")) {
            serverPath = "/api/steam/genre/shooter";
        } else if (clientPath.startsWith("/search/steam/genre/rts")) {
            serverPath = "/api/steam/genre/rts";
        } else if (clientPath.startsWith("/search/steam/genre/towerdefence")) {
            serverPath = "/api/steam/genre/towerdefence";
        } else if (clientPath.startsWith("/search/steam/weeklydeals")) {
            serverPath = "/api/steam/weeklydeals";
        } else if (clientPath.startsWith("/search/steam/compmulti")) {
            serverPath = "/api/steam/compmulti";
        } else if (clientPath.startsWith("/search/steam/freeonlinemulti")) {
            serverPath = "/api/steam/freeonlinemulti";
        } else if (clientPath.startsWith("/search/steam/paidonlinemulti")) {
            serverPath = "/api/steam/paidonlinemulti";
        } else if (clientPath.startsWith("/search/steam/mostdifficult")) {
            serverPath = "/api/steam/mostdifficult";
        } else if (clientPath.startsWith("/search/steam/horror")) {
            serverPath = "/api/steam/horror";
        } else if (clientPath.startsWith("/search/steam/mobo")) {
            serverPath = "/api/steam/moba";
        } else if (clientPath.startsWith("/search/steam/vrhtc")) {
            serverPath = "/api/steam/vrhtc";
        } else if (clientPath.startsWith("/search/steam/vrvive")) {
            serverPath = "/api/steam/vrvive";
        } else if (clientPath.startsWith("/search/steam/vrwindows")) {
            serverPath = "/api/steam/vrwindows";
        } else if (clientPath.startsWith("/search/steam/vrall")) {
            serverPath = "/api/steam/vrall";
        } else if (clientPath.startsWith("/search/steam/earlyaccess")) {
            serverPath = "/api/steam/earlyaccess";
        } else if (clientPath.startsWith("/search/steam/openworld")) {
            serverPath = "/api/steam/openworld";
        } else if (clientPath.startsWith("/search/steam/fps")) {
            serverPath = "/api/steam/fps";
        } else if (clientPath.startsWith("/search/steam/cards")) {
            serverPath = "/api/steam/cards";
        } else if (clientPath.startsWith("/search/steam/mmorpg")) {
            serverPath = "/api/steam/mmorpg";
        } else if (clientPath.startsWith("/search/steam/survival")) {
            serverPath = "/api/steam/survival";
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