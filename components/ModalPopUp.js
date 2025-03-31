import { View, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { Modal, Button, TextInput } from 'react-native-paper';

const ModalPopUp = ({ setVisible, visible, setValue, buttonText }) => {
  const [text, setText] = useState('')

  const valueHandler = () => {
    if(text.length > 0) {
      setValue(text)
    } else {
      alert("Username cannot be empty")
    }
  }

  return (
    <Modal
    style={styles.modalView}
    visible={visible}
    onDismiss={() => {
      setVisible(false);
    }}>
    <View style={styles.container}>
      <TextInput style={styles.input} value={text} placeholder='New username' autoCapitalize='none' onChangeText={(text) => setText(text)} />
      <Button style={styles.button} mode='contained' title='Change username' onPress={() => valueHandler()}>{buttonText}</Button>
    </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  button: {
    marginVertical: 4,
  },
  modalView: {
    margin: 20,
    flex: 1,
    justifyContent: 'center',
    height: 200,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
})

export default ModalPopUp