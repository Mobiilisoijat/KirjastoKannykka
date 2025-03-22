import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import TopAppSearchBar from '../components/TopAppSearchBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import BookCarousel from '../components/bookSearchPageComponents/BookCarousel'
import BookList from '../components/bookSearchPageComponents/BookList'
import { MenuProvider } from 'react-native-popup-menu'
import { PaperProvider } from 'react-native-paper'


export default function BookSearchPage({navigation}) {

    return (
      <PaperProvider>
      <MenuProvider>
    <SafeAreaView>
      <View>
        <TopAppSearchBar />
        <Text style={{color:"tomato"}}>BookSearchPage</Text>

        <Button title="juu"></Button>
        <BookCarousel />
        <BookList />
        <Button style={styles.button} mode='contained' title='Login screen' onPress={() => navigation.navigate('Login')}>Testipage</Button>
        <Button style={styles.button} mode='contained' title='BookInfo' onPress={() => navigation.navigate('BookInfo')}/>
        <Button style={styles.button} mode='contained' title='BooklistScreen' onPress={() => navigation.navigate('BooklistScreen')}>Testipage</Button>
        <Button style={styles.button} mode='contained' title='Logout' onPress={() => FIREBASE_AUTH.signOut()}>Log out</Button>
      </View>
    </SafeAreaView>
    </MenuProvider>
    </PaperProvider>
  )
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
})
