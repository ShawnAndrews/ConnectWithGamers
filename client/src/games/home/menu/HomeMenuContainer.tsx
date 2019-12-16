import * as React from 'react';
import * as SteamService from '../../../service/steam/main';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { GameResponse, MultiGameResponse, ExcludedGameIds } from '../../../../client-server-common/common';
import HomeMenu from './HomeMenu';

export enum GamesOptions {
    Upcoming,
    Recent,
    Early,
    Preorder,
    TopSelling
}

interface IHomeMenuContainerProps extends RouteComponentProps<any> {

}

interface IHomeMenuContainerState {
    isLoading: boolean;
    loadingMsg: string;
    title: string;
    upcomingGames: GameResponse[];
    recentGames: GameResponse[];
    earlyGames: GameResponse[];
    preorderGames: GameResponse[];
    topSellingGames: GameResponse[];
    highlightedGames: GameResponse[];
    games: GameResponse[];
    currentPage: number;
    resultGamesOption: GamesOptions;
    highlightedMouseDownX: number;
    highlightedMouseDownY: number;
}

class FullsizeResultsContainer extends React.Component<IHomeMenuContainerProps, IHomeMenuContainerState> {

    constructor(props: IHomeMenuContainerProps) {
        super(props);
        this.loadGames = this.loadGames.bind(this);
        this.onChangePage = this.onChangePage.bind(this);
        this.changeResultGamesOption = this.changeResultGamesOption.bind(this);
        this.onMouseDownHighlighted = this.onMouseDownHighlighted.bind(this);
        this.onMouseUpHighlighted = this.onMouseUpHighlighted.bind(this);

        this.loadGames(props);

        this.state = {
            isLoading: true,
            loadingMsg: "Loading games...",
            title: "Not Found",
            upcomingGames: undefined,
            recentGames: undefined,
            earlyGames: undefined,
            preorderGames: undefined,
            topSellingGames: undefined,
            highlightedGames: undefined,
            games: undefined,
            currentPage: 1,
            resultGamesOption: GamesOptions.Upcoming,
            highlightedMouseDownX: -1,
            highlightedMouseDownY: -1
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
        let serverPathBase: string;
        let title: string;

        if (clientPath.startsWith("/search/steam/popular")) {
            serverPathBase = "/api/steam/popular";
            title = "Popular games";
        } else if (clientPath.startsWith("/search/steam/recent")) {
            serverPathBase = "/api/steam/recent";
            title = "Recent games";
        } else if (clientPath.startsWith("/search/steam/upcoming")) {
            serverPathBase = "/api/steam/upcoming";
            title = "Upcoming games";
        } else if (clientPath.startsWith("/search/steam/genre/action")) {
            serverPathBase = "/api/steam/genre/action";
            title = "Action games";
        } else if (clientPath.startsWith("/search/steam/genre/adventure")) {
            serverPathBase = "/api/steam/genre/adventure";
            title = "Adventure games";
        } else if (clientPath.startsWith("/search/steam/genre/casual")) {
            serverPathBase = "/api/steam/genre/casual";
            title = "Casual games";
        } else if (clientPath.startsWith("/search/steam/genre/strategy")) {
            serverPathBase = "/api/steam/genre/strategy";
            title = "Strategy games";
        } else if (clientPath.startsWith("/search/steam/genre/racing")) {
            serverPathBase = "/api/steam/genre/racing";
            title = "Racing games";
        } else if (clientPath.startsWith("/search/steam/genre/simulation")) {
            serverPathBase = "/api/steam/genre/simulation";
            title = "Simulation games";
        } else if (clientPath.startsWith("/search/steam/genre/sports")) {
            serverPathBase = "/api/steam/genre/sports";
            title = "Sports games";
        } else if (clientPath.startsWith("/search/steam/genre/indie")) {
            serverPathBase = "/api/steam/genre/indie";
            title = "Indie games";
        } else if (clientPath.startsWith("/search/steam/genre/2d")) {
            serverPathBase = "/api/steam/genre/2d";
            title = "2D games";
        } else if (clientPath.startsWith("/search/steam/genre/puzzle")) {
            serverPathBase = "/api/steam/genre/puzzle";
            title = "Puzzle games";
        } else if (clientPath.startsWith("/search/steam/genre/shooter")) {
            serverPathBase = "/api/steam/genre/shooter";
            title = "Shooter games";
        } else if (clientPath.startsWith("/search/steam/genre/rts")) {
            serverPathBase = "/api/steam/genre/rts";
            title = "RTS games";
        } else if (clientPath.startsWith("/search/steam/genre/towerdefence")) {
            serverPathBase = "/api/steam/genre/towerdefence";
            title = "Tower Defence games";
        } else if (clientPath.startsWith("/search/steam/weeklydeals")) {
            serverPathBase = "/api/steam/weeklydeals";
            title = "Weekyly Deals";
        } else if (clientPath.startsWith("/search/steam/compmulti")) {
            serverPathBase = "/api/steam/compmulti";
            title = "Competitive multiplayer games";
        } else if (clientPath.startsWith("/search/steam/freeonlinemulti")) {
            serverPathBase = "/api/steam/freeonlinemulti";
            title = "Free online multiplayer games";
        } else if (clientPath.startsWith("/search/steam/paidonlinemulti")) {
            serverPathBase = "/api/steam/paidonlinemulti";
            title = "Paid online multiplayer games";
        } else if (clientPath.startsWith("/search/steam/mostdifficult")) {
            serverPathBase = "/api/steam/mostdifficult";
            title = "Most Difficult games";
        } else if (clientPath.startsWith("/search/steam/horror")) {
            serverPathBase = "/api/steam/horror";
            title = "Horror games";
        } else if (clientPath.startsWith("/search/steam/mobo")) {
            serverPathBase = "/api/steam/moba";
            title = "MOBA games";
        } else if (clientPath.startsWith("/search/steam/vrhtc")) {
            serverPathBase = "/api/steam/vrhtc";
            title = "VR HTC games";
        } else if (clientPath.startsWith("/search/steam/vrvive")) {
            serverPathBase = "/api/steam/vrvive";
            title = "VR Vive games";
        } else if (clientPath.startsWith("/search/steam/vrwindows")) {
            serverPathBase = "/api/steam/vrwindows";
            title = "VR Windows games";
        } else if (clientPath.startsWith("/search/steam/vrall")) {
            serverPathBase = "/api/steam/vrall";
            title = "All VR games";
        } else if (clientPath.startsWith("/search/steam/earlyaccess")) {
            serverPathBase = "/api/steam/earlyaccess";
            title = "Early Access games";
        } else if (clientPath.startsWith("/search/steam/openworld")) {
            serverPathBase = "/api/steam/openworld";
            title = "Open World games";
        } else if (clientPath.startsWith("/search/steam/fps")) {
            serverPathBase = "/api/steam/fps";
            title = "FPS games";
        } else if (clientPath.startsWith("/search/steam/cards")) {
            serverPathBase = "/api/steam/cards";
            title = "Card games";
        } else if (clientPath.startsWith("/search/steam/mmorpg")) {
            serverPathBase = "/api/steam/mmorpg";
            title = "MMORPG games";
        } else if (clientPath.startsWith("/search/steam/survival")) {
            serverPathBase = "/api/steam/survival";
            title = "Survival games";
        }

        SteamService.httpGenericGetData<MultiGameResponse>(serverPathBase.concat('/upcoming'))
        .then( (response: MultiGameResponse) => {
            const games: GameResponse[] = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1);

            this.setState({  upcomingGames: games, games: games, resultGamesOption: GamesOptions.Upcoming });

            return SteamService.httpGenericGetData<MultiGameResponse>(serverPathBase.concat('/recent'));
        })
        .then( (response: MultiGameResponse) => {
            const games: GameResponse[] = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1);

            this.setState({  recentGames: games });

            return SteamService.httpGenericGetData<MultiGameResponse>(serverPathBase.concat('/early'));
        })
        .then( (response: MultiGameResponse) => {
            const games: GameResponse[] = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1);

            this.setState({  earlyGames: games });

            return SteamService.httpGenericGetData<MultiGameResponse>(serverPathBase.concat('/preorder'));
        })
        .then( (response: MultiGameResponse) => {
            const games: GameResponse[] = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1);

            this.setState({  preorderGames: games });

            return SteamService.httpGenericGetData<MultiGameResponse>(serverPathBase.concat('/topselling'));
        })
        .then( (response: MultiGameResponse) => {
            const games: GameResponse[] = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1);

            this.setState({  topSellingGames: games });

            return SteamService.httpGenericGetData<MultiGameResponse>(serverPathBase.concat('/highlighted'));
        })
        .then( (response: MultiGameResponse) => {
            const games: GameResponse[] = response.data.filter((game: GameResponse) => ExcludedGameIds.findIndex((x: number) => x === game.steamId) === -1);

            this.setState({  highlightedGames: games, title: title, isLoading: false });
        })
        .catch( (error: string) => {
            this.setState({ isLoading: false});
        });

    }

    onChangePage(page: number, pageSize: number): void {
        this.setState({ currentPage: page });
    }

    changeResultGamesOption(option: GamesOptions): void {

        if (option === GamesOptions.Upcoming) {
            this.setState({ resultGamesOption: option, games: this.state.upcomingGames });
        } else if (option === GamesOptions.Recent) {
            this.setState({ resultGamesOption: option, games: this.state.recentGames });
        } else if (option === GamesOptions.Early) {
            this.setState({ resultGamesOption: option, games: this.state.earlyGames });
        } else if (option === GamesOptions.Preorder) {
            this.setState({ resultGamesOption: option, games: this.state.preorderGames });
        } else if (option === GamesOptions.TopSelling) {
            this.setState({ resultGamesOption: option, games: this.state.topSellingGames });
        }

    }

    onMouseDownHighlighted(event: React.MouseEvent<HTMLDivElement>): void {
        this.setState({ highlightedMouseDownX: event.clientX, highlightedMouseDownY: event.clientY });
    }

    onMouseUpHighlighted(event: React.MouseEvent<HTMLDivElement>, steamId: number): void {
        const marginOfError: number = 10;

        if ((event.clientX > (this.state.highlightedMouseDownX - marginOfError)) &&  (event.clientX < (this.state.highlightedMouseDownX + marginOfError))) {
            if ((event.clientY > (this.state.highlightedMouseDownY - marginOfError)) &&  (event.clientY < (this.state.highlightedMouseDownY + marginOfError))) {
                this.props.history.push(`/search/game/${steamId}`);
            }
        }
        this.setState({ highlightedMouseDownX: event.clientX, highlightedMouseDownY: event.clientY });
    }

    render() {
        return (
            <HomeMenu
                isLoading={this.state.isLoading}
                loadingMsg={this.state.loadingMsg}
                highlightedGames={this.state.highlightedGames}
                resultsGames={this.state.games}
                title={this.state.title}
                onChangePage={this.onChangePage}
                currentPage={this.state.currentPage}
                resultGamesOption={this.state.resultGamesOption}
                changeResultGamesOption={this.changeResultGamesOption}
                onMouseDownHighlighted={this.onMouseDownHighlighted}
                onMouseUpHighlighted={this.onMouseUpHighlighted}
            />
        );
    }

}

export default withRouter(FullsizeResultsContainer);