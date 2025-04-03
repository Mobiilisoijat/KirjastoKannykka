import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const BookShowcaseList = ({ navigation, data }) => {

  return (
    <View style={styles.container}>
      <FlatList

        data={data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Pressable style={styles.listBook} onPress={() => navigation.navigate("BookInfo", { bookId: item.id })}>
            {item.images.length > 0 ? (
              <Image style={styles.image}
                source={{
                  uri: `https://api.finna.fi${item.images[0]}`
                }} />
            ) : (
              <MaterialCommunityIcons style={styles.image} name='block-helper' size={64} />
            )}
            <Text ellipsizeMode='tail' numberOfLines={2}>
              {item.title}{"\n"}
              {item.nonPresenterAuthors.map((person) => person.name || "Tuntematon tekijä")}
            </Text>
          </Pressable>
        )}
      />
    </View>

  )
}
const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,

    marginBottom: 10,
    justifyContent: 'center',
    borderRadius: 20,
  },
  listBook: {
    flexDirection: "row",
    backgroundColor: "#b5b5b5",
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 20,
    marginBottom: 20,
    marginLeft: 5,
    paddingRight: 5,
    borderBottomWidth: 1,
  },
  image: {
    height: 75,
    width: 75,
    resizeMode: "contain",
    margin: 10,
  },
  title: {

  },
  description: {

  },
})

export default BookShowcaseList