import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import SearchBookListItem from './SearchBookListItem'

const SearchBookList = ({navigation, data}) => {

  return (
    <View styles={styles.container}>
        <Text style={styles.header}>Hakutulokset</Text>
      <FlatList
      data = {data}
      keyExtractor={item => {item.id.toString(); console.log(data)}}
      renderItem={({item}) => (
      <SearchBookListItem navigation={navigation} item={item}/>
    )}
      />

      
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    borderTopWidth: 2
  },
  header: {
    fontSize: 24,
    alignSelf: 'center'
  }
})


export default SearchBookList