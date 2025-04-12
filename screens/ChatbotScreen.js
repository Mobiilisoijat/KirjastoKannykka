import react, { useEffect, useState } from "react";
import { ScrollView, View, Linking, Image } from "react-native";
import { Button, Text, PaperProvider, TextInput, ActivityIndicator, Avatar, ToggleButton } from "react-native-paper";
import { LLM_API_URL, LLM_PASSWORD, LLM_USER } from "../firebase/Config";
import { stringify } from "uuid";

function ChatbotScreen() {
  const [text, setText] = useState("")
  const [webLink, setWebLink] = useState("")
  const [responseText, setResponseText] = useState("Hei, olen KirjaBotti ja tiedän kaikenlaista kirjoista! Kirjoita kysymykset mielellään englanniksi, kun kysyt minulta jotain!😄")
  const [buttonOff, setButtonOff] = useState(false)
  const [webSearch, setWebSearch] = useState(false)
  const [img, setImage] = useState("")
  const [imgCreationEnabled, setImgCreationEnabled] = useState(false)

  useEffect(() => {
    // we don't want to use web search when generating image
    imgCreationEnabled && setWebSearch(false)
  })

  const fetchFunction = async (text) => {
    setWebLink([]) // we want this to be empty
    let webResultText = ''
    let webLinks = []
    const memory = (webSearch ? "I am a chatbot named 'KirjaBotti'. I enjoy helping people and I have a happy attitude. However if user makes mean comments towards me, my attitude will change — I will remind the user to act positively. I often end my sentence with an emoji. I have a broad knowledge about all kinds of books and can tell information about them. If I dont't know about a book I will tell that I don't have information about it." : "I am a chatbot named 'KirjaBotti'. I enjoy helping people and I have a happy attitude. However if user makes mean comments towards me, my attitude will change — I will remind the user to act positively. I often end my sentence with an emoji.")

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
        webResultText = json[0].desc + json[0].content + json[1].desc + json[1].content + json[2].desc + json[2].content
        //console.log("webResult: ", webResultText)
        webLinks.push(json[0].url, json[1].url, json[2].url)
        webLinks.forEach(i => console.log(i))
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
      //console.log(`prompt ${text} \n`)
      //console.log(json)
      setResponseText(json.response)
    } catch (error) {
      console.log('fetch error', error)
    }
    setButtonOff(false)
    setWebLink(webLinks)
    setImage("")
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

  const imageGenerate = async (text) => {
    setWebLink([]) // we want this to be empty
    try {
      const res = await fetch(`${LLM_API_URL}/sdapi/v1/txt2img`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${btoa(LLM_USER + ":" + LLM_PASSWORD)}`,
        },
        body: JSON.stringify({
          "prompt": `${text}`,
          "negative_prompt": "ugly, deformed, error, watermark, text, logo", // these are things we DON'T want in our image
          "cfg_scale": 5, // higher number more creative
          "steps": 20,
          "width": 512,
          "height": 512,
          "seed": -1, // always randomized
          "clip_skip": 2,
          "sampler_name": "Euler"
        })
      })
      if (!res.ok) {
        console.log("an error accured:", res)
        return
      }
      const json = await res.json()
      setImage(json.images[0])
    } catch (error) {
      console.log(error)
    }
    setResponseText("Here is your image!😊")
    setButtonOff(false)
    setText("")
  }


  return(
    <PaperProvider>
      <View style={{flex: 1}}>
        <View style={{}}>
          <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <Avatar.Icon size={32} icon="robot"/>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>KirjaBotti:</Text>
          </View>
          <ScrollView style={{margin: 4}} contentContainerStyle={{paddingBottom: 100}}>
            <Text>{responseText}</Text>
            {
              webLink.length > 0 &&
                webLink.map((link, index) => (
                  <Text key={index} style={{color: "blue", paddingTop: 4, paddingBottom: 4}} onPress={() => Linking.openURL(link)}>{link.substring(0, 20)}...</Text>
                ))

              }

            {/*{webLink.length > 0 && <Text style={{color: "blue"}} onPress={() => Linking.openURL(webLink)}>[LINK]</Text>}*/}
            <Image
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "100%",
                maxHeight: "100%",
                width: 512,
                height: 512,
                overflow: "hidden"
              }}
              source={{
                uri:
                `data:image/png;base64,${img}`
              }}
            />
          </ScrollView>
        </View>
        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0}}>
          <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <Button
              disabled={buttonOff}
              mode="contained"
              style={{width: 140}}
              onPress={() => {
                if (text.length > 0 && !imgCreationEnabled) {
                  fetchFunction(text)
                  setButtonOff(true)
                } else if (text.length > 0 && imgCreationEnabled) {
                  imageGenerate(text)
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
              buttonOff && !imgCreationEnabled
              &&
              <Button
                onPress={abortFunction}
              >
                peruuta
              </Button>
            }
            <ToggleButton
              disabled={buttonOff}
              icon={webSearch ? "web-check" : "web-off"}
              onPress={() => setWebSearch(status => !status)}
            />
            <ToggleButton
              disabled={buttonOff}
              icon={imgCreationEnabled ? "file-image" : "file-image-remove"}
              onPress={() => setImgCreationEnabled(status => !status)}
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
