import { GameResponse, RawGame, PriceInfoResponse } from "../../../../client/client-server-common/common";
import axios, { AxiosResponse } from "axios";
import { gameModel } from "../../../../models/db/game/main";

/**
 * Cache game.
 */
export function cacheGame(gameId: number, path: string): Promise<GameResponse> {

    return new Promise((resolve: any, reject: any) => {

        axios({
            method: "post",
            url: "",
            data: ""
        })
        .then( (response: AxiosResponse) => {
            const RawGame: RawGame = response.data[0];

            convertAndInsertGame(RawGame, path)
                .then((game: GameResponse) => {
                    return resolve(game);
                })
                .catch((error: string) => {
                    return reject(error);
                });
        })
        .catch((error: string) => {
            return reject(error);
        });

    });

}