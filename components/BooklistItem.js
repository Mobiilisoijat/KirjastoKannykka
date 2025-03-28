import { StyleSheet, Text, View, Pressable, Modal } from 'react-native'
import React from 'react'
import { useState } from 'react'
import ReadingListPopUp from './ReadingListPopUp'

const BooklistItem = ({item}) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <Pressable
        style={[styles.item]}
    >
        <View style={{flex: 1}}>
        <Text style={{fontSize: 18}}>{item.title}</Text>
        <Text style={{fontSize: 14}}>{item.author[0].name}</Text>
        </View>
        <Text style={{fontSize: 20}}>{item.score}</Text>
        
        <Pressable onPress={() => setModalVisible(true)}>
          <Text>Edit</Text>
        </Pressable>
        
        <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        >
          <View>
            <ReadingListPopUp bookId={item.id} book={item} />
            <Pressable onPress={() => setModalVisible(false)}>
              <Text>Close</Text>
            </Pressable>
          </View>
        </Modal>
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