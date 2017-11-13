import { connect } from "react-redux";
import Home from "../../home/home";

const mapStateToProps = state => {
    return {
        store: state
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onLoginClick: (obj) => {
            dispatch(obj)
        }
    }
}

export const HomeContainer = connect
    (mapStateToProps, mapDispatchToProps)
    (Home);