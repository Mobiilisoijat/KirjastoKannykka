import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const BookShowcaseCarousel = ({navigation, data}) => {
  return (
    <View style={styles.container}>

      <FlatList
      horizontal = {true}
        data = {data}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Pressable onPress={() => navigation.navigate("BookInfo",{bookId: item.id})}>
            <Image source={{
              uri: `https://api.finna.fi${item.images[0]}`
              
              
              }}/>
            {item.images.length > 0 ? (
              <View style={styles.carouselBook}>
              <Image 
              source={{
                uri: `https://api.finna.fi${item.images[0]}`
              }}/>
              <Text>{item.images[0]}</Text>
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
        margin: 50,
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
})

export default BookShowcaseCarousel