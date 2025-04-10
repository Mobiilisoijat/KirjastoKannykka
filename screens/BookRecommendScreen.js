import { StyleSheet, View, SafeAreaView } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { getDocs,collection, query,} from 'firebase/firestore'
import { FIREBASE_DB, BOOKLIST, USERS, GEMINI_MODEL } from '../firebase/Config'
import React, { useState, useEffect} from 'react'
import { getAuth } from 'firebase/auth'

export default function BookRecommendScreen() {
    const [buttonEnabled, setButtonEnabled] = useState(false)
    const [prompt, setPrompt] = useState (null)
    const [modelResponse, setModelResponse] = useState (null)
    const auth = getAuth()
    const user = auth.currentUser
    const basePrompt = "vastaus max 500 merkkiä. Tee minulle kirjasuosituksia seuraavan jo luetuen listan perusteella suomeksi tyyliin uuden suosituksen: kirjan nimi, kirjoittaja, max 2 lausetta kuvausta: "

    useEffect (() => {
      const getReadBooks = async () => {
        try {
            const bookList = []
            const booksRef = collection(FIREBASE_DB, USERS, user.uid, BOOKLIST)
            const booksQuery = query(booksRef)
            const querySnapshot = await getDocs(booksQuery)
            let bookAmountLimiter = 0
            querySnapshot.forEach((doc) => {
                const data = doc.data()
                if(bookAmountLimiter < 3) {
                bookList.push(`${data.title} ${data.author[0].name}`)
                bookAmountLimiter++
                }
            })
            const bookString = bookList.join(", ")
            setPrompt(`${basePrompt}${bookString}`)
            console.log("Prompt set:", `${basePrompt}${bookString}`)
            setButtonEnabled(true) // Enable button after getting books
        } catch (err) {
            console.error("Error getting books:", err)
        }
    }
    getReadBooks()
        
    }, [])

    const handlePromptButton = async () => {
      if (!buttonEnabled) return
        
      try {
          setButtonEnabled(false)
          
          console.log("Sending prompt to Gemini:", prompt)
          const result = await GEMINI_MODEL.generateContent(prompt)
          
          if (!result || !result.response) {
              throw new Error("No response from Gemini")
          }
          
          console.log("Got response from Gemini")
          const response = result.response
          setModelResponse(response.text)
          
          //rate limit for 30 seconds
          setTimeout(() => {
              setButtonEnabled(true)
          }, 30000)
          
      } catch (err) {
          console.error("Gemini API error:", err)
          setButtonEnabled(true)
      } 
    }

  return (
    <SafeAreaView style={styles.container}>
      <Text variant="titleLarge">Generoi kirjasuosituksia kirjalistasi perusteella Gemini AI:lla</Text>
      {/*<Text variant="bodySmall">Current prompt {prompt}</Text>*/}
      {  }
      <Text variant="bodyLarge">{modelResponse}</Text>
      <Button mode="contained" disabled={!buttonEnabled} onPress={() => handlePromptButton() }> Generoi suositus</Button> 
      
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50, // Add top margin to prevent clipping
    marginHorizontal: 16, // Add horizontal margins
    paddingBottom: 16, // Some padding at the bottom
  }
})