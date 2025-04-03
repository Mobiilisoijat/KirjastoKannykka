import React, { useEffect, useState } from "react";
import { PaperProvider, Text, Avatar, TextInput, Button, Divider } from "react-native-paper";
import { BOOKREVIEWS, REVIEW, FIREBASE_DB  } from '../../firebase/Config';
import { getAuth } from 'firebase/auth'
import { doc, getDoc, query, setDoc, collection, getDocs, orderBy, updateDoc } from "firebase/firestore";
import { View } from "react-native";

function BookReview( { userName, bookId, setAlertVisible, updateData, setUpdateData } ) {
  const [text, setText] = useState("")
  const [comments, setComments] = useState([])
  const [recommend, setRecommend] = useState(true)

  const auth = getAuth()
  const user = auth.currentUser
  let docRef

  useEffect(() => {
    if (!updateData) {
      getComments()
    } else {
      updateComments()
    }
  }, [updateData]);

  // check if user is logged in
  if (user && user.uid){
    docRef = doc(FIREBASE_DB, BOOKREVIEWS, bookId, REVIEW, userName)
  }

  const getComments = async () => {
    try {
      const q = query(collection(FIREBASE_DB, BOOKREVIEWS, bookId, REVIEW), orderBy("time", "desc"))
      const querySnapshot = await getDocs(q)
      const tempComments = []
      querySnapshot.forEach((doc) => {
        tempComments.push({...doc.data()})
      })
      setComments(tempComments)
    } catch (error) {
      console.log(error)
    }
  }

  const updateComments = async () => {
    if (updateData) {
      console.log("posting")
      await updateDoc(docRef, {
        comment: text,
        time: days(),
        recommend: recommend
      })
      console.log("posted")
      setUpdateData(false)
      setText("")
    }
  }

  const days = () => {
    const postTime = new Date()
    const isoString = postTime.toISOString()
    const formattedTime1 = isoString.split(".")[0]
    const formattedTime2 = formattedTime1.replace("T", " ")
    // format is yyyy-mm-dd HH:mm:ss
    return formattedTime2
  }

  const checkComments = async () => {
    if (text.length > 0 && user) {
      try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.data()) {
          // Posts Comments
          await setDoc(docRef, {
            userName: userName,
            comment: text,
            recommend: recommend,
            time: days() // NOTE! This is string type
          })
          console.log("review posted")
          setText("")
          await getComments()
        } else {
          // checks if user has already posted a comment on current book and asks if he wants to overwrite it or cancel
          console.log("You already have a review about this book")
          // this setAlertVisible triggers setUpdateData(true) inside Reviewdialog.js
          // inside useEffect we post the comment after we have gotten updateData = true
          // we need to do it like this, since there is a delay in updating the data
          setAlertVisible(true)
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      // maybe do an alert system here
      console.log("Review too short!")
    }
  }

  return(
    <PaperProvider >
      {comments &&
        (
          comments.map((doc) => (
            <View style={{paddingTop: 8, paddingBottom: 8}} key={doc.userName}>
              <View style={{display: "flex", flexDirection: "row"}}>
                <Avatar.Icon size={24} icon="folder"/>
                <Text>{doc.userName}</Text>
              </View>
              <View style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: 'space-between'}}>
                <Text style={{fontSize: 12}}>{doc.time}</Text>
                <Avatar.Icon size={24} icon={doc.recommend ? "thumb-up" : "thumb-down"}/>
              </View>
              <Text>{doc.comment}</Text>
              <Divider/>
            </View>
          ))
        )
      }
      <Text style={{paddingTop: 8, paddingBottom: 8, fontSize: 16}}>Kirjoita arvostelu</Text>
      {
        !user
        ?
        <Text>Kirjaudu sisään jättääksesi arvostelu!</Text>
        :
        <View>
          <View style={{display: "flex", flexDirection: "row"}}>
            <Avatar.Icon size={24} icon="folder"/>
            <Text>{userName}</Text>
          </View>
          <Button
            value={recommend}
            onPress={() => setRecommend(status => !status)}
            icon={recommend ? 'thumb-up' : 'thumb-down'}
            style={{width: '60%'}}
          >
            {recommend ? "Suosittelen" : "En suosittele"}
          </Button>
          <TextInput
            label={'Kirjoita arvostelu'}
            multiline={true}
            value={text}
            onChangeText={text => setText(text)}
            style={{width: "100%"}}
          />
          <Button
            mode="contained"
            style={{ marginTop: 10 }}
            onPress={checkComments}
          >
            Julkaise
          </Button>
        </View>
      }
    </PaperProvider>
  )
}

export default BookReview
