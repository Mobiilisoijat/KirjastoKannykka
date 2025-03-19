import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

const BooklistItem = ({item}) => {
  return (
    <Pressable
        style={[styles.item]}
    >
        <Text>{item.title}</Text>
        <Text>{item.author}</Text>
        <Text>{item.score}</Text>
        <Pressable>

        </Pressable>
    </Pressable>
  )
}

export default BooklistItem

const styles = StyleSheet.create({
    item: {

    }
})