const popupS = require('popups');
const loadImage = require('image-promise');
import * as React from 'react';
import * as IGDBService from '../../../service/igdb/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, MultiGameResponse, ExcludedGameIds, getIGDBImage, IGDBImageSizeEnums, IGDBImage } from '../../../../client-server-common/common';
import FullsizeResults from './FullsizeResults';

interface IFullsizeResultsContainerProps extends RouteComponentProps<any> {
    
}

interface IFullsizeResultsContainerState {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
    retry: boolean;
    editorsGamesIndicies: number[];
    bigGamesIndicies: number[];
}

class FullsizeResultsContainer extends React.Component<IFullsizeResultsContainerProps, IFullsizeResultsContainerState> {

    constructor(props: IFullsizeResultsContainerProps) {
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

    componentWillReceiveProps(newProps: IFullsizeResultsContainerProps): void {
        const pathChanged: boolean = newProps.location.pathname !== this.props.location.pathname;

        if (pathChanged) {
            this.loadGames(newProps);

            this.setState({
                isLoading: true
            });
        }
    }

    loadGames(someProps: IFullsizeResultsContainerProps): void {
        const clientPath: string = someProps.location.pathname;
        let serverPath: string;

        if (clientPath.startsWith("/search/steam/popular")) {
            serverPath = "/igdb/steam/popular";
        } else if (clientPath.startsWith("/search/steam/recent")) {
            serverPath = "/igdb/steam/recent";
        } else if (clientPath.startsWith("/search/steam/upcoming")) {
            serverPath = "/igdb/steam/upcoming";
        } else if (clientPath.startsWith("/search/steam/genre/action")) {
            serverPath = "/igdb/steam/genre/action";
        } else if (clientPath.startsWith("/search/steam/genre/adventure")) {
            serverPath = "/igdb/steam/genre/adventure";
        } else if (clientPath.startsWith("/search/steam/genre/casual")) {
            serverPath = "/igdb/steam/genre/casual";
        } else if (clientPath.startsWith("/search/steam/genre/strategy")) {
            serverPath = "/igdb/steam/genre/strategy";
        } else if (clientPath.startsWith("/search/steam/genre/racing")) {
            serverPath = "/igdb/steam/genre/racing";
        } else if (clientPath.startsWith("/search/steam/genre/simulation")) {
            serverPath = "/igdb/steam/genre/simulation";
        } else if (clientPath.startsWith("/search/steam/genre/sports")) {
            serverPath = "/igdb/steam/genre/sports";
        } else if (clientPath.startsWith("/search/steam/genre/indie")) {
            serverPath = "/igdb/steam/genre/indie";
        } else if (clientPath.startsWith("/search/steam/genre/2d")) {
            serverPath = "/igdb/steam/genre/2d";
        } else if (clientPath.startsWith("/search/steam/genre/puzzle")) {
            serverPath = "/igdb/steam/genre/puzzle";
        } else if (clientPath.startsWith("/search/steam/genre/shooter")) {
            serverPath = "/igdb/steam/genre/shooter";
        } else if (clientPath.startsWith("/search/steam/genre/rts")) {
            serverPath = "/igdb/steam/genre/rts";
        } else if (clientPath.startsWith("/search/steam/genre/towerdefence")) {
            serverPath = "/igdb/steam/genre/towerdefence";
        } else if (clientPath.startsWith("/search/steam/weeklydeals")) {
            serverPath = "/igdb/steam/weeklydeals";
        } else if (clientPath.startsWith("/search/steam/compmulti")) {
            serverPath = "/igdb/steam/compmulti";
        } else if (clientPath.startsWith("/search/steam/freeonlinemulti")) {
            serverPath = "/igdb/steam/freeonlinemulti";
        } else if (clientPath.startsWith("/search/steam/paidonlinemulti")) {
            serverPath = "/igdb/steam/paidonlinemulti";
        } else if (clientPath.startsWith("/search/steam/mostdifficult")) {
            serverPath = "/igdb/steam/mostdifficult";
        } else if (clientPath.startsWith("/search/steam/horror")) {
            serverPath = "/igdb/steam/horror";
        } else if (clientPath.startsWith("/search/steam/mobo")) {
            serverPath = "/igdb/steam/moba";
        } else if (clientPath.startsWith("/search/steam/vrhtc")) {
            serverPath = "/igdb/steam/vrhtc";
        } else if (clientPath.startsWith("/search/steam/vrvive")) {
            serverPath = "/igdb/steam/vrvive";
        } else if (clientPath.startsWith("/search/steam/vrwindows")) {
            serverPath = "/igdb/steam/vrwindows";
        } else if (clientPath.startsWith("/search/steam/vrall")) {
            serverPath = "/igdb/steam/vrall";
        } else if (clientPath.startsWith("/search/steam/earlyaccess")) {
            serverPath = "/igdb/steam/earlyaccess";
        } else if (clientPath.startsWith("/search/steam/openworld")) {
            serverPath = "/igdb/steam/openworld";
        } else if (clientPath.startsWith("/search/steam/fps")) {
            serverPath = "/igdb/steam/fps";
        } else if (clientPath.startsWith("/search/steam/cards")) {
            serverPath = "/igdb/steam/cards";
        } else if (clientPath.startsWith("/search/steam/mmorpg")) {
            serverPath = "/igdb/steam/mmorpg";
        } else if (clientPath.startsWith("/search/steam/survival")) {
            serverPath = "/igdb/steam/survival";
        }

        IGDBService.httpGenericGetData<MultiGameResponse>(serverPath)
        .then( (response: MultiGameResponse) => {
            const games: GameResponse[] = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.id) === -1);

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
            <FullsizeResults
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