import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const BookList = () => {
  return (
    <View style={styles.container}>
      <Text style={{color:"green"}}>BookList</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        margin: 50,
    },
})

export default BookList