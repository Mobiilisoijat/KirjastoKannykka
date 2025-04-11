import { View, StyleSheet, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { TopAppSearchBar } from '../components/TopAppSearchBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import BookShowcaseCarousel from '../components/bookSearchPageComponents/BookShowcaseCarousel'
import BookShowcaseList from '../components/bookSearchPageComponents/BookShowcaseList'
import { MenuProvider } from 'react-native-popup-menu'
import { PaperProvider } from 'react-native-paper'
import SearchBookList from '../components/bookSearchPageComponents/SearchBookList'


export default function BookSearchPage({ navigation }) {
  const TESTURL = "https://api.finna.fi/api/v1/search?lookfor=harri_po&type=AllFields&filter[]=~format:%220/Book/%22&sort=relevance&page=1&limit=20&prettyPrint=false&lng=fi"
  const URL = "https://api.finna.fi/v1/search?page=1&filter[]=~format:%220/Book/%22&limit=5"
  const [bookListData, setBookListData] = useState({})
  const [showcaseData, setShowcaseData] = useState({})
  const [search, setSearch] = useState(navigation.params?.text)
  const bookUpdate = (object) => {
    setBookListData(object.records)
  }
  useEffect(() => {
    bookUpdate({search: navigation.params?.search})
    fetch(URL)
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
          <View style={{height: Dimensions.get("window").height}}>
            <TopAppSearchBar navigation={navigation} bookdata={bookUpdate} search={search} />
            
            {!bookListData ? (
              <View>
                <BookShowcaseCarousel navigation={navigation} data={showcaseData}/>
                <BookShowcaseList navigation={navigation} data={showcaseData}/>
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
