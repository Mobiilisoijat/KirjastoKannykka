import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const BookShowcaseCarousel = () => {
  return (
    <View style={styles.container}>
      <Text style={{color: "yellow"}}>BookCarousel</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        margin: 50,
    },
})

export default BookShowcaseCarousel