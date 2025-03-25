import { View, Text, Pressable, StyleSheet } from 'react-native'
import React from 'react'

const SearchBookListItem = ({item}) => {
  return (
    <Pressable>
        <View style={styles.item}>
            <Text>{item.title}asdsad</Text>
        </View>
    </Pressable>
  )
}
const styles = StyleSheet.create({
    item: {
        padding: 5,
    }
})

export default SearchBookListItem