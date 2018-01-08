/**
 * RoutesModel
 *
 */
export default class RoutesModel {

    routes: any;

    constructor() {
        this.routes = new Map();
    }

    addRoute(routeKey: string, routeValue: string) {
        this.routes.set(routeKey, routeValue);
    }

    getRoute(routeKey: string) {
        return this.routes.get(routeKey);
    }

}