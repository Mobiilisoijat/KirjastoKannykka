import { View, Text, StyleSheet, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TopAppSearchBar } from '../components/TopAppSearchBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import BookShowcaseCarousel from '../components/bookSearchPageComponents/BookShowcaseCarousel'
import BookShowcaseList from '../components/bookSearchPageComponents/BookShowcaseList'
import { MenuProvider } from 'react-native-popup-menu'
import { PaperProvider } from 'react-native-paper'
import SearchBookList from '../components/bookSearchPageComponents/SearchBookList'
import { FIREBASE_AUTH } from '../firebase/Config'


export default function BookSearchPage({ navigation }) {

  const [searchVisibility, setSearchVisibility] = useState(false)
  const [bookListData, setBookListData] = useState({})
  const [showcaseData, setShowcaseData] = useState({})
  const bookUpdate = (object) => {
    setBookListData(object.records)
    console.log(bookListData)
  }
  useEffect(() => {
    fetch('https://api.finna.fi/api/v1/search?lookfor=harry_potter&type=AllFields&filter[]=~format:%220/Book/%22&sort=relevance&page=1&limit=10&prettyPrint=false&lng=fi')
    .then(response => response.json())
    .then((json) => {
      setShowcaseData(json.records)

    }).catch((error) => {
      console.log("Error fetching showcase data: ",error)
    })
  },[])

  return (
    <PaperProvider>
      <MenuProvider>
        <SafeAreaView>
          <View>
            <TopAppSearchBar navigation={navigation} bookdata={bookUpdate} />
            {!bookListData ? (
              <View>
                <BookShowcaseCarousel data={showcaseData}/>
                <BookShowcaseList />
                <Button style={styles.button} mode='contained' title='Login screen' onPress={() => navigation.navigate('Login')} />
                <Button style={styles.button} mode='contained' title='BookInfo' onPress={() => navigation.navigate('BookInfo')} />
                {/* BooklistScreen differs since navigation goes trought Tabs -> BooklistScreen */}
                <Button style={styles.button} mode='contained' title='BooklistScreen' onPress={() => navigation.navigate('Tabs', { screen: 'BooklistScreen', initial: false })} />
                <Button style={styles.button} mode='contained' title='Logout' onPress={() => FIREBASE_AUTH.signOut()} />
              </View>
            ) : <SearchBookList navigation={navigation} data={bookListData}/>
            }
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
