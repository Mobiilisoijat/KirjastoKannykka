import react, { useState } from "react";
import { View } from "react-native";
import { Button, Text, PaperProvider, TextInput } from "react-native-paper";
import { LLM_API_URL, LLM_MODEL } from "../firebase/Config";

function ChatbotScreen() {
  const [text, setText] = useState("Hello")
  const [responseText, setResponseText] = useState("First answer takes time. The chatbot doesn't remember what you asked previously")

  const fetchFunction = async (text) => {
    console.log('pressed')
    const url = `${LLM_API_URL}/api/generate`
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "model": `${LLM_MODEL}`,
          "prompt": `${text}`,
          "options": {
            "temperature": 0.2 // more logical answer meaning it's less creative. (Change this if user want's to create a story ?)
          },
          "stream": false
        })
      })
      if (!res.ok) {
        console.log("an error accured")
        return
      }
      const json = await res.json()
      console.log(`prompt ${text} \n`, json.response)
      setResponseText(json.response)
    } catch (error) {
      console.log('fetch error', error)
    }
  }

  return(
    <PaperProvider>
      <View>
        <Button
          mode="contained"
          onPress={() => fetchFunction(text)}
          >
          Get
        </Button>
        <TextInput
          label={'Write'}
          value={text}
          onChangeText={text => setText(text)}
          >
        </TextInput>
        <Text>Response: {responseText}</Text>
      </View>
    </PaperProvider>
  )
}

export default ChatbotScreen
