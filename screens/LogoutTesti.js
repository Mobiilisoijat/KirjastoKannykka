import { StyleSheet, View, Text } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../database/FirebaseConfig'
import { Button } from 'react-native-paper'


const LogoutTesti = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Button style={styles.button} mode='contained' title='Testi' onPress={() => navigation.navigate('Testi')}>Testipage</Button>
      <Button style={styles.button} mode='contained' title='Logout' onPress={() => FIREBASE_AUTH.signOut()}>Log out</Button>
    </View>
  )
}

export default LogoutTesti

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
  }
})