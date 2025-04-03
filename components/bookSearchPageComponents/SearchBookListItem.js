import { View, Text, Pressable, StyleSheet, Image } from 'react-native'
import React from 'react'
import uuid from 'react-native-uuid'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const SearchBookListItem = ({ navigation, item }) => {
  return (
    <Pressable onPress={() => navigation.navigate("BookInfo", { bookId: item.id })}>
      <View style={styles.item}>
        {item.images.length > 0 ? (
          <Image style={styles.image}
            source={{
              uri: `https://api.finna.fi${item.images[0]}`
            }} />
        ) : (
          <MaterialCommunityIcons style={styles.image} name='block-helper' size={64} />
        )}
        <Text numberOfLines={3}>{item.title}</Text>
        {item.nonPresenterAuthors.map((person) => (
          <Text ellipsizeMode='head' key={uuid.v4()} numberOfLines={3}>{person.name} - {person.role || "Tuntematon rooli"}</Text>
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
  },
  image: {
    height: 199,
    width: 75,
    resizeMode: "contain",
  },
  title: {

  },
  description: {
    
  }
})

export default SearchBookListItem