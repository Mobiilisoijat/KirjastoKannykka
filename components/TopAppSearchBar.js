import { View } from 'react-native'
import React, { useReducer, useState, } from 'react'
import { Searchbar, Button, Menu } from 'react-native-paper'
import { SearchBarReducer, initialState } from '../redux/SearchBarReducer'

export default function TopAppSearchBar({ navigation }) {
    const [state, dispatch] = useReducer(SearchBarReducer, initialState)

    const [visible, setVisible] = useState(false)  //show menu when menu-button is pressed

    const openMenu = () => { setVisible(true); console.log("menu opened") }
    const closeMenu = () => { setVisible(false); console.log("closed") }

    return (
        <View>
            <Searchbar
                placeholder={state.placeholder}
                onChangeText={(text) => dispatch({ type: 'search', text: text })}
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
