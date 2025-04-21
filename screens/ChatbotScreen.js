import react, { useEffect, useRef, useState } from "react";
import { ScrollView, View, Linking, Image } from "react-native";
import { Button, Text, PaperProvider, TextInput, ActivityIndicator, Avatar, ToggleButton, Divider, Dialog, Portal } from "react-native-paper";
import { LLM_API_URL, LLM_PASSWORD, LLM_USER, USERS, FIREBASE_DB, FAVORITES } from "../firebase/Config";
import { getDocs, query, collection } from "firebase/firestore";
import { getAuth } from 'firebase/auth'

function ChatbotScreen() {
  const [text, setText] = useState("")
  const [webLink, setWebLink] = useState("")
  const [responseText, setResponseText] = useState("Hei, olen KirjaBotti ja tiedän kaikenlaista kirjoista! Kirjoita kysymykset mielellään englanniksi, kun kysyt minulta jotain!😄 Vain hakea internetistä tietoa, generoida kuvia ja tehdä sinulle henkilökohtaisen quiz pelin!")
  const [buttonOff, setButtonOff] = useState(false)
  const [webSearch, setWebSearch] = useState(false)
  const [img, setImage] = useState("")
  const [imgCreationEnabled, setImgCreationEnabled] = useState(false)
  const [quizes, setQuizes] = useState([])
  const quiz = useRef("")
  const answer = useRef("")
  const userQuizScore = useRef(0)
  const quizesAnswered = useRef(0)
  const maxScore = useRef(0)
  const [dialogVisible, setDialogVisible] = useState(false)
  const [bookNames, setBookNames] = useState(["Harry Potter", "Seitsemän Veljestä", "Risto Räppääjä"])

  useEffect(() => {
    // we don't want to use web search when generating image
    imgCreationEnabled && setWebSearch(false)
  })

  const auth = getAuth()
  const user = auth.currentUser
  let docsRef

  // check if user is logged in
  if (user && user.uid){
    docsRef = query(collection(FIREBASE_DB, USERS, user.uid, FAVORITES))
  }
  const firebaseGetData = async () => {
    try {
      if (user.uid) {
        const querySnap = await getDocs(docsRef)
        console.log("length:", querySnap.size)
        let tempArray = []
        querySnap.forEach((doc) => {
          console.log(doc.data().title)
          tempArray.push(doc.data().title)
        })
        setBookNames(tempArray)
        bookNames.forEach(i => console.log(i))
      } else {
        console.log("No data found!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchFunction = async (text, state) => {
    setWebLink([]) // we want this to be empty
    let webResultText = ''
    let webLinks = []
    let memory

    // personality of the chatbot
    switch(state) {
      case 'quizBooks':
        memory = "I am a quiz-loving chatbot named 'KirjaBotti'. I always generate one true/false question from the given prompt. I must end my response with **exactly one** answer inside a list: either [true] or [false]. If I don't understand the prompt, I must respond with [null]. I must never use [True/False] or any other variation."
        const res1 = await webSearcher(text)
        webLinks = res1.webLinks
        webResultText = res1.webResultText
        break
      case 'internet':
        memory = "I am a chatbot named 'KirjaBotti'. I enjoy helping people and I have a happy attitude. However if user makes mean comments towards me, my attitude will change — I will remind the user to act positively. I often end my sentence with an emoji."
        const result = await webSearcher(text)
        webLinks = result.webLinks
        webResultText = result.webResultText
        break
      case 'general':
        memory = "I am a chatbot named 'KirjaBotti'. I enjoy helping people and I have a happy attitude. However if user makes mean comments towards me, my attitude will change — I will remind the user to act positively. I often end my sentence with an emoji. I have a broad knowledge about all kinds of books and can tell information about them. If I dont't know about a book I will tell that I don't have information about it."
        break
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
        setButtonOff(false)
        return
      }
      const json = await res.json()
      //console.log(`prompt ${text} \n`)
      //console.log(json)
      if (state === "quizBooks") {
        // getting the value inside [] from string
        //console.log("JSON", json)
        let question = json.response.split(/(?=\[)/)[0]
        let tempanswer = json.response.split(/(?=\[)/)[1]
        const wordImean = tempanswer.match(/true|false|null/g) // strips stuff like ** from **[false]**
        if (wordImean[0]=== "true" || wordImean[0] == "false") {
          maxScore.current += 1
        }
        ////////////////////////////////
        console.log("REACHED HERE")
        console.log(question)
        console.log(wordImean)
        quiz.current = question
        answer.current = wordImean
      } else setQuizes([])
      state != "quizBooks" ? setResponseText(json.response) : setResponseText("Here are few questions for you!🔥")
    } catch (error) {
      console.log('fetch error', error)
      return
    }
    setButtonOff(false)
    state === 'internet' && setWebLink(webLinks)
    setImage("")
    setText("")
    return true
  }

  const quizMaker = async () => {
    // we reset all values related to score
    userQuizScore.current = 0
    quizesAnswered.current = 0
    maxScore.current = 0
    //const idiot = ["harry potter.", "european city.", "uuga buuga", "super monkey ball"] // test questions, uuga buuga is null
    const newQuizes = []
    for (let i in bookNames) {
      const result = await fetchFunction(bookNames[i], 'quizBooks')
      if (result === true) {
        newQuizes.push({ id: i, quiz: quiz.current, answer: answer.current, disabled: false, correct: null })
      }
    }
    setQuizes(newQuizes)
    newQuizes.forEach(i => console.log("!", i))
    setButtonOff(false)
  }

  const quizEnded = () => {
    setResponseText(`You got ${userQuizScore.current} right from ${maxScore.current} questions!`)
  }

  const webSearcher = async (text) => {
    let webLinks = []
    let webResultText
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
          setButtonOff(false)
          return
        }
        const json = await res.json()
        //console.log("json lenght", json.length)
        const jsonLength = json.length
        for (let i = 0; i < jsonLength; i++) {
          webResultText += json[i].desc + json[i].content
          webLinks.push(json[i].url)
        }
        webLinks.forEach(i => console.log(i))
        return { webLinks, webResultText }
      } catch (error) {
        console.log('internet fetch error', error)
        return
      }
    }
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
          "negative_prompt": "ugly, deformed, error, watermark, text, logo, naked, nude, nsfw", // these are things we DON'T want in our image
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

  const answerChecker = (question, correctTrue) => {
    let anwser = correctTrue ?  "true" : "false" // changes to string
    let correct

    if (question.answer[0] === anwser) {
      console.log("OIKEIN!")
      correct = true
      userQuizScore.current += 1
    } else{
      console.log("VÄÄRIN!")
      correct = false
    }
    // updates the quizes. does a rerender while doing that
    setQuizes(quizes.map((item) => {
      if (item.id === question.id) {
        return {...item, disabled: true, correct: correct}
      }
      else {
        return item
      }
    }))

    quizesAnswered.current += 1

    if (quizesAnswered.current === maxScore.current) setDialogVisible(true)

    console.log("pisteesi:", userQuizScore, "vastaukset:", quizesAnswered, "max pisteet:", maxScore)
  }

  return(
    <PaperProvider>
      <View style={{flex: 1}}>
        <Portal>
          <Dialog visible={dialogVisible} onDismiss={() => {setDialogVisible(false); quizEnded()}}>
            <Dialog.Title>Suoritit visa pelin!</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Pisteesi: {userQuizScore.current}</Text>
              <Text variant="bodyMedium">Max pisteet: {maxScore.current}</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => {setDialogVisible(false); quizEnded()}}>Jatka</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
        <View style={{}}>
          <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <Avatar.Icon size={32} icon="robot"/>
            <Text style={{fontSize: 16, fontWeight: 'bold'}}>KirjaBotti:</Text>
          </View>
          <ScrollView style={{margin: 4}} contentContainerStyle={{paddingBottom: 100}}>
            <Text>{responseText}</Text>
            <Button onPress={firebaseGetData}>www</Button>
            {
              (webLink.length != undefined && webLink.length > 0)
              &&
              webLink.map((link, index) => (
                <Text key={index} style={{color: "blue", paddingTop: 4, paddingBottom: 4}} onPress={() => Linking.openURL(link)}>{link.substring(0, 20)}...</Text>
              ))
            }
            <Divider/>
            {
              quizes.map((object, index) => {
                // we dont want questions where the answer is null
                if (object.answer[0] === "null"){
                  return
                }
                // we add 1 to the max score
                //maxScore.current += 1

                return (
                  <View key={index}>
                    <Text>{object.quiz}</Text>
                    <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'center'}}>
                      <Button
                        mode="contained"
                        disabled={object.disabled}
                        onPress={() => {
                          answerChecker(object, true)
                        }}
                      >
                        Tosi
                      </Button>
                      <Button
                        mode="contained"
                        disabled={object.disabled}
                        onPress={() => {
                          answerChecker(object, false)
                        }}
                      >
                        Epätosi
                      </Button>
                      <Text>
                        {
                          object.correct != null
                          &&
                          (object.correct ? "✅" : "❌")
                        }
                      </Text>
                    </View>
                  </View>
                )
              })
            }
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
                if (text.length > 0 && !imgCreationEnabled && !webSearch) {
                  fetchFunction(text, 'general')
                  setButtonOff(true)
                } else if (text.length > 0 && !imgCreationEnabled && webSearch) {
                  fetchFunction(text, 'internet')
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
                onPress={() => {abortFunction; setButtonOff(false)}}
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
            <ToggleButton
              disabled={buttonOff}
              icon={"microsoft-xbox-controller"} //"microsoft-xbox-controller-off
              onPress={() => { setWebSearch(true); console.log("OK"); setButtonOff(true); quizMaker() }}
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
