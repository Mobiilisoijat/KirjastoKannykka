import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, Button } from 'react-native'
import React from 'react'
import { useEffect, useState } from 'react'
import { StatusBar } from 'expo-status-bar'
import { Title } from 'react-native-paper'
import BookList from '../components/BookList'


const BooklistScreen = () => {
  return (
    <SafeAreaView>
        <TextInput/>
        <Title>Käyttäjän Mikael lista</Title>
        <Button title='Luettu'/>
        <Button title='Lukemassa'/>
        <Button title='Haluan Lukea'/>
        <BookList/>
    </SafeAreaView>
  )
}

export default BooklistScreen

const styles = StyleSheet.create({})