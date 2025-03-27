import React, { useEffect, useState } from "react";
import { PaperProvider, Text, Avatar, TextInput, Button, Divider } from "react-native-paper";
import { BOOKREVIEWS, REVIEW, FIREBASE_DB  } from '../firebase/Config';
import { getAuth } from 'firebase/auth'
import { doc, getDoc, query, setDoc, collection, getDocs, orderBy, where, updateDoc } from "firebase/firestore";
import { View } from "react-native";
import ReviewDialog from "./ReviewDialog";

function BookReview( { userName, bookId, setAlertVisible, updateData, setUpdateData } ) {
  const [text, setText] = useState("")
  const [comments, setComments] = useState([])

  const auth = getAuth()
  const user = auth.currentUser
  let docRef

  useEffect(() => {
    console.log("updateData changed:", updateData);
    if (!updateData) {
      getComments()
      console.log("A")
    } else {
      postCo()
    }
  }, [updateData]);

  // check if user is logged in
  if (user && user.uid){
    // move this ??
    docRef = doc(FIREBASE_DB, BOOKREVIEWS, bookId, REVIEW, userName)
  }

  const getComments = async () => {
    if (user && user.uid) {
      try {
        const q = query(collection(FIREBASE_DB, BOOKREVIEWS, bookId, "review"))
        const querySnapshot = await getDocs(q);
        const tempComments = []
        querySnapshot.forEach((doc) => {
          tempComments.push({...doc.data()})
        })
        setComments(tempComments)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const postComments = async () => {
    if (text.length > 0 && user) {
      try {
        const docSnap = await getDoc(docRef);
        if (!docSnap.data()) {
          await setDoc(docRef, {
            userName: userName,
            rating: 5,
            comment: text,
          })
          console.log("review posted")
          setText("")
          await getComments()
        } else {
          // checks if user has already posted a comment on current book and asks if he wants to overwrite it or cancel
          console.log("You already have a review about this book")
          // this setAlertVisible triggers setUpdateData(true) inside Reviewdialog.js
          // inside useEffect we post the comment after we have gotten updateData = true
          // we need to do stupid ̶S̶H̶I̶T stuff like this, since there is a delay in updating the data
          setAlertVisible(true)
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("Review too short!")
    }
  }

  const postCo = async () => {
    if (updateData) {
      console.log("posting")
      await updateDoc(docRef, {
        comment: text
      })
      console.log("posted")
      setUpdateData(false)
      setText("")
    }
  }

  return(
    // !!!!!!!!!!!!! lisää aika milloin arvostelu kirjoitettiin
    <PaperProvider >
      {comments &&
        (
          comments.map((doc) => (
            <View style={{paddingTop: 8, paddingBottom: 8}} key={doc.userName}>
              <View style={{display: "flex", flexDirection: "row"}}>
                <Avatar.Icon size={24} icon="folder"/>
                <Text>{doc.userName}</Text>
                <Text> {doc.rating}</Text>
              </View>
              <Text>{doc.comment}</Text>
              <Divider bold={true}/>
            </View>
          ))
        )
      }
      <View style={{display: "flex", flexDirection: "row"}}>
        <Avatar.Icon size={24} icon="folder"/>
        <Text>{userName}</Text>
        <Text>{"<Points>"}</Text>
      </View>
      <TextInput
        label={'Write a review'}
        multiline={true}
        value={text}
        onChangeText={text => setText(text)}
        style={{width: "100%"}}
      />
      <Button
        mode="contained"
        style={{ marginTop: 10 }}
        onPress={postComments}
      >
        Julkaise
      </Button>
    </PaperProvider>
  )
}

export default BookReview
