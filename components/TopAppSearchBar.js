import { View, Text, StyleSheet,  } from 'react-native'
import React, { useReducer, useState, } from 'react'
import { Searchbar, Menu, PaperProvider, Button, IconButton } from 'react-native-paper'
import { SearchBarReducer, initialState } from '../redux/SearchBarReducer'



export default function TopAppSearchBar() {
    const [state, dispatch] = useReducer(SearchBarReducer, initialState)

    const [visible, setVisible] = useState(false)  //show menu when menu-button is pressed

    const openMenu = () => {setVisible(true); console.log("menu opened")}
    const closeMenu = () => setVisible(false)

    return(
        <View>
        <Searchbar
        
        placeholder={state.placeholder}
        onChangeText={(text) => dispatch({type: 'search', text: text})}
        value={state.text}
        icon="menu"
        onIconPress={openMenu}
        />

        <PaperProvider>
        <View style={{padding:50}}>         {/* Menus WIP*/}
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<IconButton icon="menu" onPress={openMenu} title="juu">onIconPress</IconButton>}>
                <Menu.Item onPress={() => {}} title="Item 1" />
                <Menu.Item onPress={() => {}} title="Item 2" />
            </Menu>
        </View>
        </PaperProvider>
        
        </View>
        
    )

}