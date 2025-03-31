import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar, Button, Modal, TextInput } from 'react-native-paper';
import { getAuth, updateProfile } from 'firebase/auth'
import ChangeUsernamePopUp from '../components/ModalPopUp'

export default function ProfileScreen() {
  const [visible, setVisible] = useState(false)
  const [username, setUsername] = useState('')
  const [buttonText, setButtonText] = useState('')
  const [pfp, setPfp] = useState('https://github-production-user-asset-6210df.s3.amazonaws.com/72543424/426615926-ba944629-d763-4e80-a6e3-f77c2ed97e1b.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250325%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250325T155748Z&X-Amz-Expires=300&X-Amz-Signature=314b140fab09845049fe22effed6e9584abefc2cd43979e8a7fa2e0eb28561ae&X-Amz-SignedHeaders=host');
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    if (user.displayName) {
      setUsername(user.displayName)
    } else {
      setUsername('no username')
    }

    if (user.photoURL) {
      setPfp(user.photoURL)
    } else {
      setPfp('https://github-production-user-asset-6210df.s3.amazonaws.com/72543424/426615926-ba944629-d763-4e80-a6e3-f77c2ed97e1b.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20250325%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250325T155748Z&X-Amz-Expires=300&X-Amz-Signature=314b140fab09845049fe22effed6e9584abefc2cd43979e8a7fa2e0eb28561ae&X-Amz-SignedHeaders=host')
    }
  }, [])

  useEffect(() => {
    changeUsername()
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

  const usernameHandler = () => {
    setVisible(true)
    setButtonText('Change username')
  }

  return (
    <View style={styles.container}>
      <Avatar.Image size={150} source={{uri:pfp}}/>
      <Text>{username}</Text>
      <Button style={styles.button} mode='contained' title='Change username' onPress={() => usernameHandler()}>Change username</Button>
      <Button style={styles.button} mode='contained' title='Change profile picture' onPress={() => showModal()}>Change profile picture</Button>
      {visible && (
        <ChangeUsernamePopUp buttonText={buttonText} setValue={setUsername} visible={visible} setVisible={setVisible} />
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