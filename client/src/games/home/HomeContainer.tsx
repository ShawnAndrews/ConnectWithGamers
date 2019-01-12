const popupS = require('popups');
const loadImage = require('image-promise');
import * as React from 'react';
import Home from './Home';
import * as IGDBService from '../../service/igdb/main';
import { MultiGameResponse, GameResponse, GamesPresets } from '../../../client-server-common/common';
import { withRouter, RouteComponentProps } from 'react-router';

interface IHomeContainerProps extends RouteComponentProps<any> { }

interface IHomeContainerState {
    isLoading: boolean;
    loadingMsg: string;
    games: GameResponse[];
}

class HomeContainer extends React.Component<IHomeContainerProps, IHomeContainerState> {

    constructor(props: IHomeContainerProps) {
        super(props);

        this.state = {
            isLoading: true,
            loadingMsg: 'Loading games...',
            games: undefined,
        };

    }

    componentDidMount(): void {

        IGDBService.httpGenericGetData<MultiGameResponse>(`/igdb/games/results/${GamesPresets.highlighted}`)
        .then((gamesResponse: MultiGameResponse) => {
            const highlightedGamesWithHardcoded: GameResponse[] = gamesResponse.data;

            highlightedGamesWithHardcoded[0] = hardCodedDNM;

            this.setState({
                loadingMsg: 'Loading images...',
                games: gamesResponse.data
            }, () => {
                const allHomepageScreenshots: string[] = [].concat(...this.state.games.map((x: GameResponse) => x.screenshots));

                loadImage(allHomepageScreenshots)
                .then(() => {
                    this.setState({ isLoading: false });
                })
                .catch((error: Object) => {
                    this.setState({ isLoading: false });
                });
            });
        })
        .catch((error: string) => {
            popupS.modal({ content: `<div>• Error loading homepage games.</div>` });
        });

    }

    render() {
        return (
            <Home
                isLoading={this.state.isLoading}
                loadingMsg={this.state.loadingMsg}
                games={this.state.games}
            />
        );
    }

}

export default withRouter(HomeContainer);

const hardCodedDNM: GameResponse = {
    id: 105196,
        name: "Don't Notice Me",
        aggregated_rating: 0,
        total_rating_count: 0,
        price: "7.99",
        discount_percent: undefined,
        steamid: 859740,
        cover: {
            id: 68377,
            height: 347,
            image_id: "tjiibzaypq6cbx4qouik",
            url: "https://images.igdb.com/igdb/image/upload/t_cover_big/tjiibzaypq6cbx4qouik.jpg",
            width: 264,
            alpha_channel: false,
            animated: false
        },
        summary: "Don't Notice Me is an adventure puzzle game where you play as Mika Kittinger, a normal teen girl who just wants to get back a love letter she gave to her crush. All you need to do is sneak into his room and find the letter before anyone notices. You may need to find his address, break into his house and crack the codes on all the locks he seems to have in his room. You may even get an opportunity to snoop through his phone and computer while you're there.",
        linkIcons: [
            "fab fa-windows",
            "fab fa-apple"
        ],
        genres: [
            {
                id: 2,
                name: "Point-and-click"
            },
            {
                id: 9,
                name: "Puzzle"
            },
            {
                id: 13,
                name: "Simulator"
            },
            {
                id: 31,
                name: "Adventure"
            },
            {
                id: 32,
                name: "Indie"
            }
        ],
        platforms: [
            {
                id: 6,
                name: "PC (Microsoft Windows)"
            },
            {
                id: 14,
                name: "Mac"
            }
        ],
        release_dates: [
            1541548800,
            1541548800
        ],
        first_release_date: 1541548800,
        screenshots: [
            "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/qidm2bqrwlapwd7qvny6.jpg",
            "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/azsd45ympn28gpprkali.jpg",
            "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/c7svc4553wmfegbkmukg.jpg",
            "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/lnqfvcs5hg3hpg1fm30v.jpg",
            "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/dk71ff2myqlpkxwccun6.jpg",
            "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/mvkwpffsw6ospss5ugny.jpg",
            "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/rurosekzmuhttqpqtmps.jpg",
            "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/atqmj1czsndccp50evg4.jpg",
            "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/kn5ogyp80elf2scn2dxo.jpg",
            "https://images.igdb.com/igdb/image/upload/t_screenshot_huge/tldw89b88sl1k6jblvlz.jpg"
        ],
        video: "https://www.youtube.com/embed/NZIN1uluCSk"
};