import { View, StyleSheet, Image } from 'react-native'
import React, { useState } from 'react'
import { Modal, Button, TextInput } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const ModalPopUp = ({ setVisible, visible, setValue, buttonText }) => {
  const [text, setText] = useState('')
  const [image, setImage] = useState(null)

  const valueHandler = () => {
    if(text.length > 0) {
      setValue(text)
    } else {
      alert("Field cannot be empty")
    }
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    console.log(result);
  }

  return (
    <Modal
    style={styles.modalView}
    visible={visible}
    onDismiss={() => {
      setVisible(false);
    }}>
    <View style={styles.container}>
    {buttonText === 'Change username' ? (
      <>
        <TextInput style={styles.input} value={text} placeholder={buttonText} autoCapitalize='none' onChangeText={(text) => setText(text)} />
        <Button style={styles.button} mode='contained' onPress={() => valueHandler()}>{buttonText}</Button>
      </>
    ) : (
      <>
        <Button title="Pick an image from camera roll" onPress={pickImage}>Pick an image</Button>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <Button style={styles.button} mode='contained' onPress={() => imageHandler()}>{buttonText}</Button>
      </>
    )}
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