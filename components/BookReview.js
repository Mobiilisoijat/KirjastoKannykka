import React, { useEffect, useState } from "react";
import { PaperProvider, Text, Avatar, TextInput, Button } from "react-native-paper";
import { BOOKREVIEWS, REVIEW, FIREBASE_DB  } from '../firebase/Config';
import { getAuth } from 'firebase/auth'
import { doc, getDoc, query, setDoc, collection, getDocs, orderBy, where  } from "firebase/firestore";
import { View } from "react-native";
import ReviewDialog from "./ReviewDialog";

function BookReview( { userName, bookId } ) {
  const [text, setText] = useState("")
  const [comments, setComments] = useState([])

  const auth = getAuth()
  const user = auth.currentUser
  let docRef

  useEffect(() => {
    getComments()
  },[])

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
        tempComments.forEach(i => {
          console.log("tempComments",i)
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
        console.log(docSnap.data())
        if (!docSnap.data()) {
          await setDoc(docRef, {
            userName: userName,
            rating: 5,
            comment: text,
          })
          console.log("review posted")
          setText("")
          getComments()
        } else {
          // make a system that checks if user already has a comment and wants to update it
          console.log("You already have a review about this book")
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      console.log("Review too short!")
    }
  }

  return(

    <PaperProvider >
      {comments &&
        (
          comments.map((doc) => (
            <View key={doc.userName}>
              <View style={{display: "flex", flexDirection: "row"}}>
                <Avatar.Icon size={24} icon="folder"/>
                <Text>{doc.userName}</Text>
                <Text>{doc.rating}</Text>
              </View>
              <Text>{doc.comment}</Text>
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
