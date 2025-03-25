import { View } from 'react-native'
import React, { useReducer, useRef, useState, } from 'react'
import { Searchbar, Button, Menu } from 'react-native-paper'
import { SearchBarReducer, initialState } from '../redux/SearchBarReducer'

const TopAppSearchBar = ({ navigation }) => {
    const [state, dispatch] = useReducer(SearchBarReducer, initialState)
    const [visible, setVisible] = useState(false)  //show menu when menu-button is pressed

    const controllerRef = useRef()

    const openMenu = () => { setVisible(true); console.log("menu opened") }
    const closeMenu = () => { setVisible(false); console.log("closed") }

    

    const searchBooks = (text) => {
        dispatch({ type: 'search', text: text })

        if(controllerRef.current) {
            controllerRef.current.abort()
        }
        controllerRef.current = new AbortController()
        const signal = controllerRef.current.signal

        const searchURL = `https://api.finna.fi/api/v1/search?lookfor=${state.search}&type=AllFields&sort=relevance&page=1&limit=20&prettyPrint=false&lng=fi`
        fetch(searchURL, {signal})
        .then(response => response.json())
        .then((json) => {
            console.log(json.records[0])
            console.log(searchURL)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <View>
            <Searchbar
                placeholder={state.placeholder}
                onChangeText={(text) => searchBooks(text)}
                value={state.text}
                icon="menu"
                onIconPress={openMenu}
            />
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Button onPress={openMenu} disabled={true}></Button>}>
                <Menu.Item onPress={() => { navigation.navigate('Tabs', {screen: 'BookSearchPage', initial: false}); closeMenu() }} title="Koti" />
                <Menu.Item onPress={() => { navigation.navigate('BookInfo'); closeMenu() }} title="BookInfo Example" />
                <Menu.Item onPress={() => { navigation.navigate('Tabs', {screen: 'BooklistScreen', initial: false}); closeMenu() }} title="Kirjalista" />
                <Menu.Item onPress={() => { navigation.navigate(''); closeMenu() }} title="Lue ISBN koodi" />
                <Menu.Item onPress={() => { navigation.navigate(''); closeMenu() }} title="Kaverit" />
                <Menu.Item onPress={() => { navigation.navigate(''); closeMenu() }} title="Viestit" />
                <Menu.Item onPress={() => { navigation.navigate(''); closeMenu() }} title="Menu item" />
                <Menu.Item onPress={() => { closeMenu() }} leadingIcon="weather-sunny" />
                <Menu.Item onPress={() => { navigation.navigate('Tabs', {screen: 'Profile', initial: false}); closeMenu() }} title="Profiili" />
                <Menu.Item onPress={() => { navigation.navigate(''); closeMenu() }} title="Käyttäjäpalaute" />
                <Menu.Item onPress={() => { navigation.navigate(''); closeMenu() }} title="Asetukset" />
            </Menu>
        </View>

    )

}
export { TopAppSearchBar }