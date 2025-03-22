import { StyleSheet, Text, View, SafeAreaView, ScrollView, Button } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Title, TextInput } from 'react-native-paper'
import BookList from '../components/BookList'


const BooklistScreen = () => {
  const [toggleState, setToggleState] = useState('all')  
  const [text, onChangeText] = useState('')

  const onTogglePress = async (state) => {
    if( toggleState === state) {
        setToggleState("all")
    } else {
        setToggleState(state)
    }   
  }

  return (
    <SafeAreaView style={{marginHorizontal: 10, marginTop: 5}}>

        <TextInput
          onChangeText={onChangeText}
          value={text}
        />

        <View style = {styles.filterContainer}>
        <Button title="Lukemassa" onPress={() => onTogglePress("reading")}/>
        <Button title="Luettu" onPress={() => onTogglePress("completed")}/>
        <Button title="Aion Lukea" onPress={() => onTogglePress("planning")}/>
        </View>
        <Title>Käyttäjän Mikael lista</Title>
        <BookList toggleState = {toggleState} textInput = {text}/>
    </SafeAreaView>
  )
}

export default BooklistScreen

const styles = StyleSheet.create({
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 15,
        marginBottom: 15
    }
})