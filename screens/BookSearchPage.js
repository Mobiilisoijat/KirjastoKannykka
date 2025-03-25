import { View, Text, StyleSheet, Button } from 'react-native'
import React, { useState } from 'react'
import { TopAppSearchBar } from '../components/TopAppSearchBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import BookShowcaseCarousel from '../components/bookSearchPageComponents/BookShowcaseCarousel'
import BookShowcaseList from '../components/bookSearchPageComponents/BookShowcaseList'
import { MenuProvider } from 'react-native-popup-menu'
import { PaperProvider } from 'react-native-paper'
import SearchBookList from '../components/bookSearchPageComponents/SearchBookList'


export default function BookSearchPage({ navigation }) {

  const [searchVisibility, setSearchVisibility] = useState(false)
  return (
    <PaperProvider>
      <MenuProvider>
        <SafeAreaView>
          <View>
            <TopAppSearchBar navigation={navigation} />
            <Text style={{ color: "tomato" }}>BookSearchPage</Text>

            <Button title="juu" onPress={() => setSearchVisibility(!searchVisibility)}></Button>
            {searchVisibility ? (
              <View>
                <BookShowcaseCarousel />
                <BookShowcaseList />
                <Button style={styles.button} mode='contained' title='Login screen' onPress={() => navigation.navigate('Login')} />
                <Button style={styles.button} mode='contained' title='BookInfo' onPress={() => navigation.navigate('BookInfo')} />
                {/* BooklistScreen differs since navigation goes trought Tabs -> BooklistScreen */}
                <Button style={styles.button} mode='contained' title='BooklistScreen' onPress={() => navigation.navigate('Tabs', { screen: 'BooklistScreen', initial: false })} />
                <Button style={styles.button} mode='contained' title='Logout' onPress={() => FIREBASE_AUTH.signOut()} />
              </View>
            ) : <SearchBookList data = {[
              { id: 150, author: "J.K. Rowling", title: "Harry Potter", score: "7", state: "completed" },
              { id: 56, author: "Jane Austen", title: "Pride and Prejudice", score: "8", state: "planning" },
              { id: 57, author: "Markus Zusak", title: "The Book Thief", score: "9", state: "completed" },
            ]}/>
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
