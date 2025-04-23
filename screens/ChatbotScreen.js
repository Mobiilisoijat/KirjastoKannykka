import react, { useEffect, useRef, useState } from "react";
import { ScrollView, View, Linking, Image } from "react-native";
import { Button, Text, PaperProvider, TextInput, ActivityIndicator, Avatar, ToggleButton, Divider, Dialog, Portal } from "react-native-paper";
import { LLM_API_URL, LLM_PASSWORD, LLM_USER, USERS, FIREBASE_DB, FAVORITES } from "../firebase/Config";
import { getDocs, query, collection } from "firebase/firestore";
import { getAuth } from 'firebase/auth'

function ChatbotScreen() {
  // so many states but realy no time for cleaning
  const [text, setText] = useState("")
  const [webLink, setWebLink] = useState("")
  const [responseText, setResponseText] = useState("Hei, olen KirjaBotti ja tiedän kaikenlaista kirjoista! Kirjoita kysymykset mielellään englanniksi, kun kysyt minulta jotain!😄 Vain hakea internetistä tietoa, generoida kuvia ja tehdä sinulle henkilökohtaisen visa pelin!")
  const [buttonOff, setButtonOff] = useState(false)
  const [webSearch, setWebSearch] = useState(false)
  const [img, setImage] = useState("")
  const [imgCreationEnabled, setImgCreationEnabled] = useState(false)
  const [quizes, setQuizes] = useState([])
  const [dialogVisible, setDialogVisible] = useState(false)
  const [bookNames, setBookNames] = useState([])
  const [menuVisible, setMenuVisible] = useState(false)
  const [quizesLoading, setQuizesLoading] = useState(false)
  const [topicText, setTopicText] = useState("")
  const quiz = useRef("")
  const answer = useRef("")
  const userQuizScore = useRef(0)
  const quizesAnswered = useRef(0)
  const maxScore = useRef(0)
  const likedBooksListLength = useRef(0)

  useEffect(() => {
    // we don't want to use web search when generating image
    imgCreationEnabled && setWebSearch(false)
  })

  useEffect(() => {
    firebaseGetData()
  }, [])

  const auth = getAuth()
  const user = auth.currentUser
  let docsRef

  // check if user is logged in
  if (user && user.uid){
    docsRef = query(collection(FIREBASE_DB, USERS, user.uid, FAVORITES))
  }

  const randomFunction = (likedBooksListLength) => {
    // list with random numbers
    let numberArray = []
    // list for the random numbers picked
    let finalArray = []
    for (let i = 0; i < likedBooksListLength; i++) {
      numberArray.push(i)
    }
    // we pick a random number from the list and we remove the number from the list after it is picked
    // we pick 3 random books from our booklist to generate quizes from
    for (let i = 0; i < 3; i++) {
      const n = Math.floor(Math.random() * numberArray.length)
      const randomNumber = numberArray[n]
      const index = numberArray.indexOf(randomNumber)
      numberArray.splice(index, 1)
      console.log(randomNumber)
      finalArray.push(randomNumber)
    }

    numberArray.forEach(i => console.log("im still standing", i))
    return finalArray
  }

  const firebaseGetData = async () => {
    try {
      if (user.uid) {
        const querySnap = await getDocs(docsRef)
        console.log("length:", querySnap.size)
        likedBooksListLength.current = querySnap.size
        let tempArray = []
        querySnap.forEach((doc) => {
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
    const personalityGeneral = "I am a chatbot named 'KirjaBotti'. I enjoy helping people and I have a happy attitude. However if user makes mean comments towards me, my attitude will change — I will remind the user to act positively. I often end my sentence with an emoji."
    const personalityQuiz = "I am a quiz-loving chatbot named 'KirjaBotti'. I always generate one true/false question from the given prompt. I must end my response with **exactly one** answer inside a list: either [true] or [false]. If I don't understand the prompt, I must respond with [null]. I must never use [True/False] or any other variation."

    switch(state) {
      case 'quizGeneral':
        memory = personalityQuiz
        break
      case 'quizBooks':
        memory = personalityQuiz
        const res1 = await webSearcher(text)
        webLinks = res1.webLinks
        webResultText = res1.webResultText
        break
      case 'internet':
        memory = personalityGeneral
        const result = await webSearcher(text)
        webLinks = result.webLinks
        webResultText = result.webResultText
        break
      case 'general':
        memory = personalityGeneral + " I have a broad knowledge about all kinds of books and can tell information about them. If I dont't know about a book I will tell that I don't have information about it."
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

      // different state handling
      switch (state) {
        //both of this run trought the same code
        case "quizBooks":
        case "quizGeneral":
          // getting the value inside [] from string
          let question = json.response.split(/(?=\[)/)[0]
          let tempanswer = json.response.split(/(?=\[)/)[1]
          const wordImean = tempanswer.match(/true|false|null/g) // strips stuff like ** from **[false]**
          if (wordImean[0]=== "true" || wordImean[0] == "false") {
            maxScore.current += 1
          }
          console.log("question", question)
          console.log("answer", wordImean)
          quiz.current = question
          answer.current = wordImean
          break
        case 'internet':
          setResponseText(json.response)
          setQuizes([])
          setWebLink(webLinks)
          setButtonOff(false)
          break
        default:
          setResponseText(json.response)
          setQuizes([])
          break
      }
      // extra handling
      if (state.startsWith("quiz")) {
        setResponseText("Here are few questions for you!🔥")
      } else {
        setResponseText(json.response)
        setQuizes([])
        setButtonOff(false)
      }
    } catch (error) {
      console.log('fetch error', error)
      return
    }
    setImage("")
    setText("")
    return true
  }

  const quizMaker = async (quizType, topic) => {
    // we reset all values related to score
    userQuizScore.current = 0
    quizesAnswered.current = 0
    maxScore.current = 0
    const newQuizes = []
    let bookPickArray

    if (quizType === "quizBooks" && likedBooksListLength.current > 3) {
      const bookPicks = randomFunction(likedBooksListLength.current)
      // we create a new array from the random 3 books on our list
      bookPickArray = bookPicks.map((index) => topic[index])
      topic = bookPickArray
    } else if (quizType === "quizGeneral") {
      let tempTopicArray = []
      let questionsList = [" what is not the origin of this?", " what is not the use of this?"]
      tempTopicArray.push(topic)
      for (let i = 0; i < 2; i++) {
        const n = Math.floor(Math.random() * 2);
        if (n === 0) {
          // a positive question, we remove the word "not"
          console.log(questionsList[i])
          tempTopicArray.push(topic + questionsList[i].replace(" not", ""))
        } else {
          // a negative question
          console.log(questionsList[i])
          tempTopicArray.push(topic + questionsList[i])
        }
      }
      topic = tempTopicArray
      topic.forEach(i => console.log("e e e", i))
    }

    for (let i in topic) {
      const result = await fetchFunction(topic[i], quizType)
      if (result === true) {
        newQuizes.push({ id: i, quiz: quiz.current, answer: answer.current, disabled: false, correct: null })
      }
    }
    setQuizesLoading(false)
    setQuizes(newQuizes)
    setButtonOff(false)
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

  const quizTypeHandler = (quizState, topic) => {
    setButtonOff(true);
    setMenuVisible(false)
    quizMaker(quizState, topic)
    setQuizesLoading(true)
    setTopicText("")
    setText("")
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
    setQuizes([])
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
    // updates the quizes. does a re-render while doing that
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

          <Dialog visible={menuVisible} onDismiss={() => setMenuVisible(false)}>
            <Dialog.Title>Valitse visailu tyyppi!</Dialog.Title>
            <Dialog.Content>
              <Text variant="bodyMedium">Joko yleiskysymys tai suosikkilistastasi visa.</Text>
              <Text variant="bodyMedium">Visa on englanniksi!</Text>
              <TextInput
                label={"Syötä aihe (mielellään englanniksi)"}
                defaultValue={topicText}
                onChangeText={text => setTopicText(text)}
              >
              </TextInput>
            </Dialog.Content>
            <Dialog.Actions>
              <Button mode="contained" onPress={ () => {
                quizTypeHandler('quizGeneral', topicText)
              }}
              >
                Yleiskysymykset
              </Button>
              <Button mode="contained" onPress={ async() => {
                quizTypeHandler('quizBooks', bookNames)
              }}>
                Suosikkilista
              </Button>
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
            {
              (webLink.length != undefined && webLink.length > 0)
              &&
              webLink.map((link, index) => (
                <Text key={index} style={{color: "blue", paddingTop: 4, paddingBottom: 4}} onPress={() => Linking.openURL(link)}>{link.substring(0, 20)}...</Text>
              ))
            }
            <Divider/>
            {
              quizesLoading
              ?
              <ActivityIndicator animating={true} />
              :
              quizes.map((object, index) => {
                // we dont want questions where the answer is null
                if (object.answer[0] === "null"){
                  return
                }
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
              onPress={() => {
                setImgCreationEnabled(false)
                setWebSearch(true);
                console.log("OK");
                setMenuVisible(true)
              }}
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
