import { ScrollView, View } from 'react-native'
import React, { useEffect, useReducer, useRef, useState, } from 'react'
import { Searchbar, Button, Menu } from 'react-native-paper'
import { SearchBarReducer, initialState } from '../redux/SearchBarReducer'
import { FIREBASE_AUTH } from '../firebase/Config'

const TopAppSearchBar = ({ navigation, bookdata={} }) => {
    const [state, dispatch] = useReducer(SearchBarReducer, initialState)
    const [visible, setVisible] = useState(false)  //show menu when menu-button is pressed
    const controllerRef = useRef()

    const openMenu = () => { setVisible(true); console.log("menu opened") }
    const closeMenu = () => { setVisible(false); console.log("closed") }
    const resetPage = () => {
        setVisible(false)
        dispatch({ type: 'search', text: '' })
        bookdata({})

        /* Testing different state reseting methods when screen is changed
        const didBlurSubscription = navigation.addListener('didBlur', () => {
            bookdata({})
        })*/

    }
    // useEffect(() => {
    //     const unsubscribe = navigation.addListener('focus', () => {
    //         setTest("");
    //     })

    //     return unsubscribe
    //     console.log("Search cleared!")
    // },[navigation])


    const searchBooks = (text) => {
        dispatch({ type: 'search', text: text })
        if (controllerRef.current) {    //Abort controller setups: Aborts an old API-call, 
            controllerRef.current.abort() // if there is a new call incoming before the old one gets to finish. 
        }
        controllerRef.current = new AbortController()
        const signal = controllerRef.current.signal
        if (state.search.length > 1) {
            const searchURL = `https://api.finna.fi/api/v1/search?lookfor=${state.search.replace(/\s/g,'+')}&type=AllFields&filter[]=~format:%220/Book/%22&sort=relevance&page=1&limit=20&prettyPrint=false&lng=fi`
            fetch(searchURL, { signal })
                .then(response => response.json())
                .then((json) => {
                    json === null ? bookdata({}) : bookdata(json)
                }).catch((error) => {
                    console.log(error)
                })
        } else {
            bookdata({})
        }

    }

    return (
        <View>
            <Searchbar
                placeholder={state.placeholder}
                onChangeText={(text) => {searchBooks(text)}}
                value={state.search}
                icon="menu"
                onIconPress={openMenu}

                onClearIconPress={() => { bookdata({}); dispatch({ type: 'search', text: '' }); console.log("cancel painettu") }}
            />
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Button onPress={openMenu} disabled={true}></Button>}>
                <Menu.Item onPress={() => { navigation.navigate('Tabs', { screen: 'BookSearchPage', initial: false }); resetPage() }} title="Koti" />
                <Menu.Item onPress={() => { navigation.navigate('BookInfo'); resetPage() }} title="BookInfo Example" />
                <Menu.Item onPress={() => { navigation.navigate('Tabs', { screen: 'BooklistScreen', initial: false }); resetPage() }} title="Kirjalista" />
                <Menu.Item onPress={() => { navigation.navigate(''); resetPage() }} title="Lue ISBN koodi" />
                <Menu.Item onPress={() => { navigation.navigate(''); resetPage() }} title="Kaverit" />
                <Menu.Item onPress={() => { navigation.navigate(''); resetPage() }} title="Viestit" />
                <Menu.Item onPress={() => { navigation.navigate(''); resetPage() }} title="Menu item" />
                <Menu.Item onPress={() => { closeMenu() }} leadingIcon="weather-sunny" />
                <Menu.Item onPress={() => { navigation.navigate('Tabs', { screen: 'Profile', initial: false }); resetPage() }} title="Profiili" />
                <Menu.Item onPress={() => { navigation.navigate(''); resetPage() }} title="Käyttäjäpalaute" />
                <Menu.Item onPress={() => { navigation.navigate(''); resetPage() }} title="Asetukset" />
                <Menu.Item onPress={() => { FIREBASE_AUTH.signOut(); resetPage() }} title="Kirjaudu ulos" />
            </Menu>
        </View>
        
    )

}
export { TopAppSearchBar }