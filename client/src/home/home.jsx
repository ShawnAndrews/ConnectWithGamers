import * as React from 'react';
import { Flex, Box } from 'reflexbox';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import PropTypes from 'prop-types';
import {Card, CardTitle, CardMedia, CardHeader} from 'material-ui/Card';

const styles = {
    rootStyle: {
        height: '27vh',
        backgroundColor: 'rgb(0, 188, 212)'
    }
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
                    <Box px={1} py={1} w={1/2.3}>
                        <Card
                            style={styles.rootStyle}
                        >
                            <CardHeader
                                title="Most active days"
                                style={{backgroundColor: 'white'}}
                                textStyle={{padding: '0'}}
                            />

                        </Card>
                    </Box>
                    <Box px={1} py={1} w={1/2.3}>
                        <Card
                            style={styles.rootStyle}
                        >
                            <CardHeader
                                title="Search for a game"
                                style={{backgroundColor: 'white'}}
                                textStyle={{padding: '0'}}
                            />

                        </Card>
                    </Box>
                    <Box px={1} py={1} w={1/2.3}>
                        <Card
                            style={styles.rootStyle}
                        >
                            <CardHeader
                                title="Find a player"
                                style={{backgroundColor: 'white'}}
                                textStyle={{padding: '0'}}
                            />

                        </Card>
                    </Box>
                    <Box px={1} py={1} w={1/2.3}>
                        <Card
                            style={styles.rootStyle}
                        >
                            <CardHeader
                                title="Roster"
                                style={{backgroundColor: 'white'}}
                                textStyle={{padding: '0'}}
                            />

                        </Card>
                    </Box>
                    <Box px={1} py={1} w={1/2.3}>
                        <Card
                            style={styles.rootStyle}
                        >
                            <CardHeader
                                title="!!!!!!!!!"
                                style={{backgroundColor: 'white'}}
                                textStyle={{padding: '0'}}
                            />

                        </Card>
                    </Box>
                    <Box px={1} py={1} w={1/2.3}>
                        <Card
                            style={styles.rootStyle}
                        >
                            <CardHeader
                                title="^^^^^^^"
                                style={{backgroundColor: 'white'}}
                                textStyle={{padding: '0'}}
                            />

                        </Card>
                    </Box>
                </Flex>
            </div>
        );
    }

}
