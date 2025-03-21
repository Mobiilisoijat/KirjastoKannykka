import { View, Text, StyleSheet,  } from 'react-native'
import React, { useReducer, useState, } from 'react'
import { Searchbar,  PaperProvider, Button, IconButton } from 'react-native-paper'
import { SearchBarReducer, initialState } from '../redux/SearchBarReducer'
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu'


export default function TopAppSearchBar() {
    const [state, dispatch] = useReducer(SearchBarReducer, initialState)

    const [visible, setVisible] = useState(true)  //show menu when menu-button is pressed

    const openMenu = () => {setVisible(true); console.log("menu opened")}
    const closeMenu = () => {setVisible(false); console.log("closed")}

    return(
        <View>
        <Searchbar
    
        
        placeholder={state.placeholder}
        onChangeText={(text) => dispatch({type: 'search', text: text})}
        value={state.text}
        icon="menu"
        onIconPress={openMenu}
        />

        <Menu>
            <MenuTrigger text='Select action'  />
            <MenuOptions>
                <MenuOption onSelect={() => alert("save")} text="save" />
                <MenuOption onSelect={() => alert("del")} text="dell" /> 
            </MenuOptions>
        </Menu>

        <PaperProvider>
        <View style={{padding:50}}>        
           
        </View>
        </PaperProvider>
        
        </View>
        
    )

}

/*
<Menu
visible={visible}
onDismiss={closeMenu}
anchor={<IconButton icon="menu" onPress={openMenu}>Show menu</IconButton>}>
<Menu.Item onPress={() => {}} title="Item 1" />
<Menu.Item onPress={() => {}} title="Item 2" />
</Menu>
*/