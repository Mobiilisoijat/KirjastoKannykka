import react, { useState } from "react";
import { View } from "react-native";
import { Button, Text, PaperProvider, TextInput } from "react-native-paper";
import { LLM_API_URL } from "../firebase/Config";

function ChatbotScreen() {
  const [text, setText] = useState("Hello")
  const [responseText, setResponseText] = useState("First answer takes time. The chatbot doesn't remember what you asked previously")

  const fetchFunction = async (text) => {
    console.log('pressed')
    console.log(LLM_API_URL)
    const url = `${LLM_API_URL}/api/generate`
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          // for Kobold
          "prompt": `${text}`,
          "max_tokens": 50,
          "temperature": 0.6,
          "min_P": 0.1, // not necessarely needed
          "top_K": 10, // not necessarely needed
          // for Ollama
          //"options": {
          //  "model": `${LLM_MODEL_NAME}`,
          //  "num_gpu": 21,
          //}
        })
      })
      if (!res.ok) {
        console.log("an error accured")
        return
      }
      const json = await res.json()
      console.log(`prompt ${text} \n`, json)
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
