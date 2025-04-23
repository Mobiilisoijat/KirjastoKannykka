import { ScrollView, View } from 'react-native'
import React, { useEffect, useReducer, useRef, useState, } from 'react'
import { Searchbar, Button, Menu } from 'react-native-paper'
import { SearchBarReducer, initialState } from '../redux/SearchBarReducer'
import { FIREBASE_AUTH } from '../firebase/Config'
import { useNavigation } from '@react-navigation/native'

const TopAppSearchBar = ({ bookdata={}, search='' }) => {
    const navigation = useNavigation()
    const [state, dispatch] = useReducer(SearchBarReducer, initialState)
    const [visible, setVisible] = useState(false)  //show menu when menu-button is pressed
    const controllerRef = useRef()

    const openMenu = () => {
        setVisible(true)
        console.log("menu opened")
        console.log(search)
    }
    const closeMenu = () => {
        setVisible(false)
        console.log("closed")
    }
    const resetPage = () => {
        setVisible(false)
        dispatch({ type: 'search', text: '' })
        bookdata({})

        /* Testing different state reseting methods when screen is changed
        const didBlurSubscription = navigation.addListener('didBlur', () => {
            bookdata({})
        })*/
    }

    useEffect(() => {
        searchBooks(search)
    }, [])



    const searchBooks = (text) => {
        dispatch({ type: 'search', text: text })
        console.log("searchbooks called")

        if (controllerRef.current) {    //Abort controller setups: Aborts an old API-call,
            controllerRef.current.abort() // if there is a new call incoming before the old one gets to finish.
        }
        controllerRef.current = new AbortController()
        const signal = controllerRef.current.signal
        if (text.length > 1) {         //Search replaces spaces with a '+', making the search work better (uri would otherwise just remove the spaces, typically they need to be converted to uri-suitable format)
            const searchURL = `https://api.finna.fi/api/v1/search?lookfor=${text.replace(/\s/g,'+')}+&type=AllFields&filter[]=~format:%220/Book/%22&sort=relevance&page=1&limit=20&prettyPrint=false&lng=fi`
           fetch(searchURL,{signal})
               .then(response => response.json())
               .then((json) => {
                   json === null ? bookdata({}) : bookdata(json) //If result is null, insert empty object into bookdata, otherwise insert data
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
                <Menu.Item onPress={() => { navigation.navigate('Tabs', { screen: 'BooklistScreen', initial: false }); resetPage() }} title="Kirjalista" />
                <Menu.Item onPress={() => { navigation.navigate('ISBNReaderScreen'); resetPage() }} title="Lue ISBN koodi" />
                <Menu.Item onPress={() => { navigation.navigate('QRCodeScreen'); resetPage() }} title="Näytä QR-koodi" />
                <Menu.Item onPress={() => { navigation.navigate('ReadingSessionScreen'); resetPage() }} title="Lukuhetki" />
                <Menu.Item onPress={() => { navigation.navigate(''); resetPage() }} title="Kaverit" />
                <Menu.Item onPress={() => { navigation.navigate(''); resetPage() }} title="Viestit" />
                <Menu.Item onPress={() => { navigation.navigate('BookRecommendScreen'); resetPage() }} title="Kirjasuosittelu" />
                <Menu.Item onPress={() => { navigation.navigate('KirjaBotti'); resetPage() }} title="KirjaBotti" />
                <Menu.Item onPress={() => { closeMenu() }} leadingIcon="weather-sunny" />
                <Menu.Item onPress={() => { navigation.navigate('Tabs', { screen: 'Profile', initial: false }); resetPage() }} title="Profiili" />
                <Menu.Item onPress={() => { navigation.navigate('FeedbackScreen'); resetPage() }} title="Käyttäjäpalaute" />
                <Menu.Item onPress={() => { navigation.navigate(''); resetPage() }} title="Asetukset" />
                <Menu.Item onPress={() => { FIREBASE_AUTH.signOut(); resetPage() }} title="Kirjaudu ulos" />
            </Menu>
        </View>

    )

}
export { TopAppSearchBar }
