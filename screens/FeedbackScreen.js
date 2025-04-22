import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native'
import * as MailComposer from 'expo-mail-composer'

const FeedbackScreen = () => {
  const [senderEmail, setSenderEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const handleSendFeedback = async () => {
    const isAvailable = await MailComposer.isAvailableAsync()
    if (isAvailable) {
      const options = {
        recipients: ['INSERTEMAILHERE'], // Insert email where to send feecback
        subject: subject,
        body: `Palaute käyttäjältä: ${senderEmail}\n\n${message}`,
      }
      await MailComposer.composeAsync(options)
    } else {
      Alert.alert('Sähköposti palvelu ei ole saatavilla, palautteen lähettäminen epäonnistui')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Palaute kehittäjille</Text>
      <TextInput 
        style={styles.input}
        placeholder="Syötä sähköpostiosoite"
        keyboardType="email-address"
        onChangeText={text => setSenderEmail(text)}
        value={senderEmail}
      />
      <TextInput 
        style={styles.input}
        placeholder="Syötä aihe"
        onChangeText={text => setSubject(text)}
        value={subject}
      />
      <TextInput 
        style={[styles.input, styles.textArea]}
        placeholder="Syötä palaute teksti"
        onChangeText={text => setMessage(text)}
        value={message}
        multiline={true}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendFeedback}>
        <Text style={styles.buttonText}>Lähetä palaute</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
})

export default FeedbackScreen