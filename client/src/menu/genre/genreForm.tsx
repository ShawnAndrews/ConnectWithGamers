const popupS = require('popups');
import * as React from 'react';
import { withRouter } from 'react-router-dom';
import * as IGDBService from '../../service/igdb/main';
import { GenreListResponse, GenrePair } from '../../../client-server-common/common';

interface GenreOption {
    id: number;
    name: string;
}

interface IGenreFormProps {
    history: any;
}

class GenreForm extends React.Component<IGenreFormProps, any> {

    constructor(props: IGenreFormProps) {
        super(props);
        this.setDefaultState = this.setDefaultState.bind(this);
        this.setDefaultState();
        this.loadGenres();
    }

    private setDefaultState(): void {
        const genreURL: string = '/menu/genre';
        this.state = {isLoading: true, genreURL: genreURL};
    }

    private loadGenres(): void {
        IGDBService.httpGetGenreList()
            .then( (response: GenreListResponse) => {
                this.setState({ isLoading: false, genreMenuItems: response.data });
            })
            .catch( (error: string) => {
                popupS.modal({ content: error });
                this.setState({ isLoading: false });
            });
    } 

    render() {

        return (
            <div>
                {this.state.genreMenuItems && this.state.genreMenuItems
                    .map((x: GenreOption) => {
                        return (
                            <div key={x.id} className="menu-item" onClick={() => this.props.history.push(`${this.state.genreURL}/${x.id}`)}>
                                <div className="menu-item-overlay"/>
                                <div className="menu-item-text">
                                    {x.name}
                                </div>
                            </div>
                        );
                    })}
            </div>
        );      

    }

}

export default withRouter(GenreForm);