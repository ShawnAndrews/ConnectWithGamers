import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import Topnav from './Topnav';

interface ITopnavContainerProps extends RouteComponentProps<any> {
    title: string;
    totalGames: number;
}

interface ITopnavContainerState {
    title: string;
    sortByOpen: boolean;
    sortByIndex: number;
}

class TopnavContainer extends React.Component<ITopnavContainerProps, ITopnavContainerState> {

    constructor(props: ITopnavContainerProps) {
        super(props);
        this.handleToggle = this.handleToggle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.detectSortingIndexByQueryString = this.detectSortingIndexByQueryString.bind(this);

        this.state = {
            title: props.title,
            sortByOpen: false,
            sortByIndex: this.detectSortingIndexByQueryString(),
        };
    }

    handleToggle(): void {
        this.setState({ sortByOpen: !this.state.sortByOpen });
    }

    handleClose(event: React.MouseEvent<Document, MouseEvent>): void {
        this.setState({ sortByOpen: false });
    };

    handleMenuItemClick(event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number): void {

        let newSearch: string = this.removeURLParameter(this.props.history.location.search, "sort");

        if (index === 0) {
            newSearch += `&sort=price:desc`;
        } else if (index === 1) {
            newSearch += `&sort=price:asc`;
        } else if (index === 2) {
            newSearch += `&sort=release_date:desc`;
        } else if (index === 3) {
            newSearch += `&sort=release_date:asc`;
        } else if (index === 4) {
            newSearch += `&sort=name:desc`;
        } else if (index === 5) {
            newSearch += `&sort=name:asc`;
        }

        this.props.history.push(newSearch);
    };

    removeURLParameter(url: string, parameter: string): string {
        const urlparts: string[] = url.split('?');   
        if (urlparts.length >= 2) {
    
            const prefix: string = encodeURIComponent(parameter) + '=';
            const pars: string[] = urlparts[1].split(/[&;]/g);

            for (var i = pars.length; i-- > 0;) {    
                if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                    pars.splice(i, 1);
                }
            }
    
            return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
        }
        return url;
    }

    detectSortingIndexByQueryString(): number {

        const urlParams: URLSearchParams = new URLSearchParams(this.props.history.location.search);
        let sortIndex: number = -1;

        if (urlParams.has("sort")) {
            const sortString: string = urlParams.get("sort");

            if (sortString === "price:desc") {
                sortIndex = 0;
            } else if (sortString === "price:asc") {
                sortIndex = 1;
            } else if (sortString === "release_date:desc") {
                sortIndex = 2;
            } else if (sortString === "release_date:asc") {
                sortIndex = 3;
            } else if (sortString === "name:desc") {
                sortIndex = 4;
            } else if (sortString === "name:asc") {
                sortIndex = 5;
            }
        }

        return sortIndex;
    }

    render() {
        return (
            <Topnav
                goBack={this.props.history.goBack}
                title={this.state.title}
                totalGames={this.props.totalGames}
                handleToggle={this.handleToggle}
                handleClose={this.handleClose}
                handleMenuItemClick={this.handleMenuItemClick}
                sortByOpen={this.state.sortByOpen}
                sortByIndex={this.state.sortByIndex}
            />
        );
    }

}

export default withRouter(TopnavContainer);