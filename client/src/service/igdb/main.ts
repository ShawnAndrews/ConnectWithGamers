import axios from 'axios';
import { ResponseModel } from '../../../../client/client-server-common/common';

export function httpGetSearchGames(query: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/games/search/${query}`)
        .then((result) => {
            console.log(`data recieved: ${JSON.stringify(result.data)}`);
            return resolve(result.data);
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}.`);
            return reject(err);
        });
    }); 
}

export function httpGetUpcomingGamesList(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/igdb/games/upcoming')
        .then((result) => {
            console.log(`data recieved: ${JSON.stringify(result.data)}`);
            return resolve(result.data);
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}.`);
            return reject(err);
        });
    }); 
}

export function httpGetRecentlyReleasedGamesList(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        axios.post('/igdb/games/recent')
        .then((result) => {
            console.log(`data recieved: ${JSON.stringify(result.data)}`);
            return resolve(result.data);
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}.`);
            return reject(err);
        });
    }); 
}

export function httpGetPlatformGamesList(platformId: number): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/games/platform/${platformId}`)
        .then((result) => {
            console.log(`data recieved: ${JSON.stringify(result.data)}`);
            return resolve(result.data);
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}.`);
            return reject(err);
        });
    }); 
}

export function httpGetGame(id: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        axios.post(`/igdb/game/${id}`)
        .then((result) => {
            return resolve(result.data);
        })
        .catch((err) => {
            console.log(`HTTP error: ${err}.`);
            return reject(err);
        });
    }); 
}