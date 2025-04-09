import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import { Button, Text, ActivityIndicator } from 'react-native-paper'
import { doc, getDocs,collection, query, select, } from 'firebase/firestore'
import { FIREBASE_DB, BOOKLIST, USERS, GEMINI_MODEL } from '../firebase/Config'
import React, { useState, useEffect, useRef } from 'react'
import { getAuth } from 'firebase/auth'

export default function BookRecommendScreen() {
    const [buttonVisible, setButtonVisible] = useState (false) 
    const [prompt, setPrompt] = useState (null)
    const [modelResponse, setModelResponse] = useState (null)
    //for toggling button to prompt ai. need to implement timer for rate limiting
    const auth = getAuth()
    const user = auth.currentUser
    const basePrompt = "Tee minulle kirja suosituksia seuraavan kirjalistan perusteella suomeksi: "

    useEffect (() => {
        const getReadBooks = async () => {
            const bookList = []
            const booksRef = collection(FIREBASE_DB, USERS, user.uid, BOOKLIST)
            const booksQuery = query(booksRef, select(['title','author']))
            const querySnapshot = await getDocs(booksQuery)

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                bookList.push(`${data.title} ${data.author}`)
            })
            const bookString = bookList.join(", ")
            setPrompt(`${basePrompt}${bookString}`)
        }
        getReadBooks()
    }, [])

    const handlePromptButton = async () => {
        setButtonVisible(false)
        const result = await GEMINI_MODEL.generateContent(prompt)
        const response = result.response
        setModelResponse(response.text)
        
    }

  return (
    <SafeAreaView>
      <Text variant="titleLarge">Generoi kirjasuosituksia kirjalistasi perusteella Gemini AI:lla</Text>
      <Text variant="bodySmall">Current prompt {prompt}</Text>
      {  }
      <Text variant="bodyLarge">{result}</Text>
      <Button mode="contained" disabled={!buttonVisible} onPress={() => handlePromptButton() }> Generoi suositus</Button> 
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})