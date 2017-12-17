
/** 
 * RoutesModel
 * 
 */
class RoutesModel {
    
    constructor() {
        this.routes = new Map();
    }

    addRoute(routeKey, routeValue) {
        this.routes.set(routeKey, routeValue);
    }

    getRoute(routeKey) {
        return this.routes.get(routeKey);
    }

}

module.exports = RoutesModel;