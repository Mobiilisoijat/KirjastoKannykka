import { StyleSheet, Text, View, Button, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH } from '../database/FirebaseConfig'
import { TextInput } from 'react-native-paper'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'


const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const auth = FIREBASE_AUTH

  const signIn = async () => {
    setLoading(true)
    try {
      const response = await signInWithEmailAndPassword(auth, email, password)
      console.log(response)
    } catch (error) {
      console.log(error)
      alert('Sign in failed: ' + error.message)
    } finally {
    setLoading(false)
    }
  }

  const signUp = async () => {
    setLoading(true)
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password)
      console.log(response)
      alert('Check your emails!')
    } catch (error) {
      console.log(error)
      alert('Sign up failed: ' + error.message)
    } finally {
    setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput value={email} style={styles.input} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)} />
      <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)} />
      { loading ? <ActivityIndicator size='large' color='#0000ff' /> 
      : (
        <>
          <Button title='Login' onPress={() => signIn()} />
        </>
      )}  
    </View>
  );
}

export default LoginScreen

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
})