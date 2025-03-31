import { View, Text, StyleSheet, FlatList, Pressable, Image } from 'react-native'
import React from 'react'

const BookShowcaseList = ({navigation, data}) => {
  return (
    <View style={styles.container}>
      <FlatList 
      data={data}
      keyExtractor={item => item.id}
      renderItem={({item}) => {
        <Pressable>
          {item.images ? (
              <View style={styles.listBook}>
              <Image source={{
              uri: `https://api.finna.fi${item.images[0]}`
              
              
              }}/>
              <Text>{item.images}</Text>
              </View>
            ):(
              <View style={styles.listBook}>
                <MaterialCommunityIcons name='block-helper' size={64} />
                <Text>{item.title}</Text>
              </View>
            )}
        </Pressable>
      }}
      />
      <Text>DAAAApadaa</Text>
    </View>
    
  )
}
const styles = StyleSheet.create({
    container: {
        margin: 50,
    },
})

export default BookShowcaseList