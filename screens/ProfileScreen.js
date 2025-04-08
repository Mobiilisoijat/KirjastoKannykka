import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Modal, TextInput } from 'react-native-paper';
import { getAuth, updateProfile } from 'firebase/auth'
import ChangeUsernamePopUp from '../components/ModalPopUp'

export default function ProfileScreen() {
  const [visible, setVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [loading, setLoading] = useState(false)
  const [pfp, setPfp] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    setLoading(true)
    if (user.displayName) {
      setUsername(user.displayName)
    } else {
      setUsername('no username')
    }

    if (user.photoURL) {
      setPfp(user.photoURL)
    } else {
      setPfp('')
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if(!loading) {
      changeUsername()
      changePfp()
    }
  }, [username])

  const changeUsername = async() => {
    await updateProfile(user, {displayName: username})
    .then(() => {
      setVisible(false)
      console.log(user.displayName)
      console.log('Username updated successfully')
    }).catch((error) => {
      console.log('Error updating username: ', error)
    })
  }

  const changePfp = async() => {
    await updateProfile(user, {photoURL: pfp})
    .then(() => {
      setVisible(false)
      console.log(user.photoURL)
      console.log('Profile picture updated successfully')
    }).catch((error) => {
      console.log('Error updating profile picture: ', error)
    })
  }

  const buttonTextHandler = (test) => {
    if (test === 'Change username') {
      console.log('Change username')
      setButtonText('Change username')
    } else {
      console.log('Change profile picture')
      setButtonText('Change profile picture')
    }
    setVisible(true)
  }

  return (
    <View style={styles.container}>
      <Avatar.Image size={150} source={{uri:pfp}}/>
      <Text>{username}</Text>
      <Button style={styles.button} mode='contained' title='Change username' onPress={() => buttonTextHandler('Change username')}>Change username</Button>
      <Button style={styles.button} mode='contained' title='Change profile picture' onPress={() => buttonTextHandler('Change profile picture')}>Change profile picture</Button>
      {visible && (
        <ChangeUsernamePopUp buttonText={buttonText} setPfp={setPfp} setValue={setUsername} visible={visible} setVisible={setVisible} />
      )}
    </View>
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