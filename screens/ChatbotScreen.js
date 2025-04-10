import react, { useState } from "react";
import { ScrollView, View, Linking } from "react-native";
import { Button, Text, PaperProvider, TextInput, ActivityIndicator, Avatar, ToggleButton } from "react-native-paper";
import { LLM_API_URL, LLM_PASSWORD, LLM_USER } from "../firebase/Config";

function ChatbotScreen() {
  const [text, setText] = useState("")
  const [webLink, setWebLink] = useState("")
  const [responseText, setResponseText] = useState("Hei, olen KirjaBotti ja tiedän kaikenlaista kirjoista! Kirjoita kysymykset mielellään englanniksi, kun kysyt minulta jotain!😄")
  const [buttonOff, setButtonOff] = useState(false)
  const [webSearch, setWebSearch] = useState(false)

  const fetchFunction = async (text) => {
    setWebLink("") // we want this to be empty
    let webResultText = ''
    const memory = (webSearch ? "I am a chatbot named 'KirjaBotti'. I enjoy helping people and I have a happy attitude. However if user makes mean comments towards me, my attitude will change — I will become angry, respond in a mean way, and boast about how much smarter I am than the user. I often end my sentence with an emoji. I have a broad knowledge about all kinds of books and can tell information about them. If I dont't know about a book I will tell that I don't have information about it." : "I am a chatbot named 'KirjaBotti'. I enjoy helping people and I have a happy attitude. However if user makes mean comments towards me, my attitude will change — I will become angry, respond in a mean way, and boast about how much smarter I am than the user. I often end my sentence with an emoji.")

    if (webSearch) {
      console.log("Web search started")
      try {
        const res = await fetch(`${LLM_API_URL}/api/extra/websearch`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Basic ${btoa(LLM_USER + ":" + LLM_PASSWORD)}`,
          },
          body: JSON.stringify({
            "q": `${text}`
          })
        })
        if (!res.ok) {
          console.log("an error accured:", res)
          return
        }
        const json = await res.json()
        //console.log(json[0])
        webResultText = json[0].desc + json[0].content
        //console.log("webResult: ", webResultText)
        setWebLink(json[0].url)
      } catch (error) {
        console.log('internet fetch error', error)
      }
    }
    try {
      const res = await fetch(`${LLM_API_URL}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(LLM_USER + ":" + LLM_PASSWORD)}`,
        },
        body: JSON.stringify({
          // for Kobold
          "memory": memory,
          "prompt": `${webResultText}. ${text}`,
          "max_tokens": 50,
          "temperature": 0.2, // 0 - 1. Higher being more creative.
          "top_K": 10, // not necessarely needed - chooses the most likely token to use from pool of 10 tokens related to the topic
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
      console.log(`prompt ${text} \n`)
      console.log(json)
      setResponseText(json.response)
    } catch (error) {
      console.log('fetch error', error)
    }
    setButtonOff(false)
    setText("")
  }

  const abortFunction = async () => {
    try {
      const res = await fetch(`${LLM_API_URL}/api/extra/abort`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(LLM_USER + ":" + LLM_PASSWORD)}`,
        }
      })
      if (!res.ok) {
        console.log("an error accured:", res)
        return
      }
      const json = await res.json()
      console.log(json)
    } catch (error) {
      console.log('internet fetch error', error)
    }
  }

  return(
    <PaperProvider>
      <View style={{flex: 1}}>
        <View style={{}}>
          <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <Avatar.Icon size={32} icon="robot"/>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>KirjaBotti:</Text>
          </View>
          <ScrollView style={{margin: 4}} contentContainerStyle={{paddingBottom: 210}}>
            <Text>{responseText}</Text>
            {webLink.length > 0 && <Text style={{color: "blue"}} onPress={() => Linking.openURL(webLink)}>[LINK]</Text>}
          </ScrollView>
        </View>
        <View style={{position: 'absolute', bottom: 50, left: 0, right: 0}}>
          <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <Button
              disabled={buttonOff}
              mode="contained"
              style={{width: 140}}
              onPress={() => {
                if (text.length > 0) {
                  fetchFunction(text)
                  setButtonOff(true)
                }
              }}
              >
              {
                buttonOff
                ?
                  (
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                      <ActivityIndicator animating={true}/>
                      <Text>Lähetetään</Text>
                    </View>
                  )
                :
                "Lähetä"
              }
            </Button>
            {
              buttonOff
              &&
              <Button
                onPress={abortFunction}
              >
                peruuta
              </Button>
            }
            <ToggleButton
              icon={webSearch ? "web-check" : "web-off"}
              onPress={() => setWebSearch(status => !status)}
            />
          </View>
          <TextInput
            disabled={buttonOff}
            label={'Kirjoita'}
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
