import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';


const BookShowcaseCarousel = ({ data }) => {
  const navigation = useNavigation()
  return (
    <View style={styles.container}>

      <FlatList
      horizontal = {true}
        data = {data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable onPress={() => navigation.navigate("BookInfo",{bookId: item.id})}>
            {item.images.length > 0 ? (
              <View style={styles.carouselBook}>
              <Image style={styles.image}
              source={{
                uri: `https://api.finna.fi${item.images[0]}`
              }}
              />
              <Text>{item.title}</Text>
              </View>
            ):(
              <View style={styles.carouselBook}>
                <MaterialCommunityIcons name='block-helper' size={64} />
                <Text>{item.title}</Text>
              </View>
            )}
            
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
    },
    carouselBook: {
      height: 199, 
      width: 200,
      backgroundColor: "#b5b5b5",
      alignItems: 'center', 
      justifyContent: 'center',
      borderRadius: 20,
      marginRight: 20
    },
    image: {
      height: 149,
      width: 149,
    }
})

export default BookShowcaseCarousel