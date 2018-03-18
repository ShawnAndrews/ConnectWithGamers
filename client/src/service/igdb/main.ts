import axios from 'axios';

export function httpGetSearchGames(query: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/games/search/${query}`)
        .then((result) => {
            console.log(`data recieved: ${JSON.stringify(result.data)}`);
            return resolve(result.data.data);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

export function httpGetUpcomingGamesList(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/igdb/games/upcoming')
        .then((result) => {
            console.log(`data recieved: ${JSON.stringify(result.data)}`);
            return resolve(result.data.data);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

export function httpGetRecentlyReleasedGamesList(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/igdb/games/recent')
        .then((result) => {
            console.log(`data recieved: ${JSON.stringify(result.data)}`);
            return resolve(result.data.data);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

export function httpGetPlatformGamesList(platformId: number): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/games/platform/${platformId}`)
        .then((result) => {
            console.log(`data recieved: ${JSON.stringify(result.data)}`);
            return resolve(result.data.data);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}

export function httpGetGame(id: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/game/${id}`)
        .then((result) => {
            return resolve(result.data.data);
        })
        .catch((error: string) => {
            return reject(error);
        });
    }); 
}