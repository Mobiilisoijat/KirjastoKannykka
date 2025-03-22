import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'
import TopAppSearchBar from '../components/TopAppSearchBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import BookCarousel from '../components/bookSearchPageComponents/BookCarousel'
import BookList from '../components/bookSearchPageComponents/BookList'
import { MenuProvider } from 'react-native-popup-menu'
import { PaperProvider } from 'react-native-paper'


export default function BookSearchPage() {
    
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