import { StyleSheet, Text, View, Pressable } from 'react-native'
import React from 'react'

const BooklistItem = ({item}) => {
  return (
    <Pressable
        style={[styles.item]}
    >
        <View style={{flex: 1}}>
        <Text style={{fontSize: 18}}>{item.title}</Text>
        <Text style={{fontSize: 14}}>{item.author[0].name}</Text>
        </View>
        <Text style={{fontSize: 20}}>{item.score}</Text>
        <Pressable>

        </Pressable>
    </Pressable>
  )
}

export default BooklistItem

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 6,
        marginRight: 4
    }
})