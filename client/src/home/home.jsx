import * as React from 'react';
import { Flex, Box } from 'reflexbox';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
//import {Card, CardTitle, CardMedia, CardHeader} from 'material-ui/Card';

const styles = {
    menuOneRootStyle: {
        height: '27vh',
        backgroundImage: 'url(https://i.imgur.com/GamY817.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    },
    menuTwoRootStyle: {
        height: '27vh',
        backgroundImage: 'url(https://i.imgur.com/u7dYF4q.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    },
    menuThreeRootStyle: {
        height: '27vh',
        backgroundImage: 'url(https://i.imgur.com/KTF6xMu.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    },

    menuFourRootStyle: {
        height: '27vh',
        backgroundImage: 'url(https://i.imgur.com/VZkIbR0.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    },
    menuFiveRootStyle: {
        height: '27vh',
        backgroundImage: 'url(https://i.imgur.com/9HhPAwR.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    },
    menuSixRootStyle: {
        height: '27vh',
        backgroundImage: 'url(https://i.imgur.com/EUHHCQM.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
    },
    headerStyle: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        textAlign: 'center'
    },
    headerContainerStyle: {
        padding: '0',
    },
    headerTitleColor: 'white'
};

export default class Home extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        console.log("Home rendered");
        return (
            <div>
                <Flex wrap justify='space-evenly'>
                    <Box px={1} py={1} w={1/2.25}>
                        {/* <Card
                            style={styles.menuOneRootStyle}
                        >
                            <CardHeader
                                title="Find a group"
                                style={styles.headerStyle}
                                textStyle={styles.headerContainerStyle}
                                titleColor={styles.headerTitleColor}
                            />

                        </Card> */}
                        <h1>Find a group</h1>
                    </Box>
                    <Box px={1} py={1} w={1/2.25}>
                        {/* <Card
                            style={styles.menuTwoRootStyle}
                        >
                            <CardHeader
                                title="Statistics"
                                style={styles.headerStyle}
                                textStyle={styles.headerContainerStyle}
                                titleColor={styles.headerTitleColor}
                            />

                        </Card> */}
                        <h1>Statistics</h1>
                    </Box>
                    <Box px={1} py={1} w={1/2.25}>
                        {/* <Card
                            style={styles.menuThreeRootStyle}
                        >
                            <CardHeader
                                title="Find a player"
                                style={styles.headerStyle}
                                textStyle={styles.headerContainerStyle}
                                titleColor={styles.headerTitleColor}
                            />

                        </Card> */}
                        <h1>Find a player</h1>
                    </Box>
                    <Box px={1} py={1} w={1/2.25}>
                        {/* <Card
                            style={styles.menuFourRootStyle}
                        >
                            <CardHeader
                                title="Roster"
                                style={styles.headerStyle}
                                textStyle={styles.headerContainerStyle}
                                titleColor={styles.headerTitleColor}
                            />

                        </Card> */}
                        <h1>Roster</h1>
                    </Box>
                    <Box px={1} py={1} w={1/2.25}>
                        {/* <Card
                            style={styles.menuFiveRootStyle}
                        >
                            <CardHeader
                                title="Create a profile"
                                style={styles.headerStyle}
                                textStyle={styles.headerContainerStyle}
                                titleColor={styles.headerTitleColor}
                            />

                        </Card> */}
                        <h1>Create a profile</h1>
                    </Box>
                    <Box px={1} py={1} w={1/2.25}>
                        {/* <Card
                            style={styles.menuSixRootStyle}
                        >
                            <CardHeader
                                title="Upgrade to pro"
                                style={styles.headerStyle}
                                textStyle={styles.headerContainerStyle}
                                titleColor={styles.headerTitleColor}
                            />

                        </Card> */}
                        <h1>Upgrade to pro</h1>
                    </Box>
                </Flex>
            </div>
        );
    }

}
