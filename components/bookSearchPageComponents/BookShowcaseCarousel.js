import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native'
import React from 'react'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


const BookShowcaseCarousel = ({data}) => {
  return (
    <View style={styles.container}>

      <FlatList
      horizontal = {true}
        data = {data}
        keyExtractor={item => {item.id}}
        renderItem={({item}) => (
          <Pressable>
            <Text>{item.title}</Text>
            <Image source={{
              uri: item.images[0],
              
              cache: ""
            }}/>
          </Pressable>
        )}
        />
        
      
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