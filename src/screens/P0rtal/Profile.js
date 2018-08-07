import React from 'react'

import {
    Button,
    StyleSheet,
    ScrollView,
    Text,
    View
} from 'react-native'

import { Navigation } from 'react-native-navigation'

import { observable } from 'mobx'
import { observer } from 'mobx-react/native'
import stores from '../../stores'

import {
    FormLabel,
    FormInput,
    FormValidationMessage
} from 'react-native-elements'

import Icon from 'react-native-vector-icons/FontAwesome'

@observer
export default class Profile extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <View style={ styles.container }>
            <View>
                <Text style={ styles.heading }>
                    MY ACCOUNT PAGE
                </Text>
            </View>

            <FormLabel>Name</FormLabel>
            <FormInput onChangeText={ this._someFunction }/>
            <FormValidationMessage>Error message</FormValidationMessage>

            <Button title="Update" onPress={ this._chat.bind(this) } />

        </View>
    }

    _chat() {
        console.log('goto intro')

        Navigation.push(this.props.componentId, {
            component: {
                name: 'zeronet.SecondTabScreen'
            }
        })
    }

    _someFunction() {

    }

}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(30, 30, 30, 0.9)'
    },
    heading: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 20,
        textAlign: 'center'
    }
})
