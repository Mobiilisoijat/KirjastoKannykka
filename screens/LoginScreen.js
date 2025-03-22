import { StyleSheet, Text, View, ActivityIndicator, KeyboardAvoidingView, } from 'react-native'
import React, { useState } from 'react'
import { FIREBASE_AUTH, FIREBASE_DB } from '../firebase/Config'
import { TextInput, Button } from 'react-native-paper'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      const userData = {
        email: user.email
      }
      await setDoc(doc(FIREBASE_DB, 'users', user.uid), userData)
      console.log(user)
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
      <KeyboardAvoidingView behavior='padding'>
        <TextInput style={styles.input} value={email} placeholder='Email' autoCapitalize='none' onChangeText={(text) => setEmail(text)} />
        <TextInput style={styles.input} secureTextEntry={true} value={password} placeholder='Password' autoCapitalize='none' onChangeText={(text) => setPassword(text)} />
        { loading ? <ActivityIndicator size='large' color='#0000ff' /> 
        : (
          <>
            <Button style={styles.button} mode="contained" title='Login' onPress={() => signIn()}>Login</Button>
            <Button style={styles.button} mode="contained" title='Create account' onPress={() => signUp()}>Create account</Button>
          </>
        )}  
      </KeyboardAvoidingView>
    </View>
  );

}

export default LoginScreen

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
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