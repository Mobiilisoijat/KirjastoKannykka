import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React from 'react'

const SearchBookListItem = ({ navigation, item }) => {
  return (
    <Pressable onPress={() => navigation.navigate("BookInfo",{bookId: item.id})}>
      <View style={styles.item}>
        { item.images && (
        <Image style={{
          height: 199,
          width: 75,
          resizeMode: "contain"
        }}
          source={{
            uri: `https://api.finna.fi${item.images[0]}`
          }} />

        )}
        <Text numberOfLines={3}>{item.title}</Text>
        {item.nonPresenterAuthors.map((person) => (
          <Text ellipsizeMode='head' numberOfLines={3}>{person.name} - {person.role || "Tuntematon rooli"}</Text>
        ))}
        
      </View>
    </Pressable>
  )
}
const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginVertical: 2,
        marginRight: 5,
        borderBottomWidth: 1,
        
  }
})

export default SearchBookListItem