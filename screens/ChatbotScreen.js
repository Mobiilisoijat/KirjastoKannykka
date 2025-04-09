import react, { useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text, PaperProvider, TextInput } from "react-native-paper";
import { LLM_API_URL, LLM_PASSWORD, LLM_USER } from "../firebase/Config";

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
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(LLM_USER + ":" + LLM_PASSWORD)}`,
        },
        body: JSON.stringify({
          // for Kobold
          "prompt": `${text}`,
          "max_tokens": 50,
          "temperature": 0.6,
          "top_K": 10, // not necessarely needed - chooses the most likely word to use from pool of 10 words related to the topic
          //"min_P": 0.1, // not necessarely needed
          // for Ollama
          //"options": {
          //  "model": `${LLM_MODEL_NAME}`,
          //  "num_gpu": 21,
          //}
        })
      })
      if (!res.ok) {
        console.log("an error accured:", res)
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
      <View style={{flex: 1}}>
        <View style={{}}>
          <Text>KirjaBotti:</Text>
          <ScrollView contentContainerStyle={{paddingBottom: 210}}>
            <Text>{responseText}</Text>
          </ScrollView>
        </View>
        <View style={{position: 'absolute', bottom: 50, left: 0, right: 0}}>
          <Button
            mode="contained"
            style={{width: 140}}
            onPress={() => fetchFunction(text)}
            >
            Send
          </Button>
          <TextInput
            label={'Write'}
            multiline={true}
            value={text}
            onChangeText={text => setText(text)}
            >
          </TextInput>
        </View>
      </View>
    </PaperProvider>
  )
}

export default ChatbotScreen
