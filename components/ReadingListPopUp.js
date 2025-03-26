import React, { useState, useEffect, useRef } from "react";
import { View, Text } from "react-native";
import Checkbox from "expo-checkbox";
import { FIREBASE_DB, BOOKLIST, USERS } from '../firebase/Config'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, updateDoc, addDoc, collection, deleteDoc, onSnapshot, query, setDoc } from 'firebase/firestore'

function ReadingListPopUp ({bookId, book}) {
  //Getting current user from firebase
  const auth = getAuth()
  const user = auth.currentUser
  // we need to get status data from database
  const checkBoxData = [
    {
      text: "Luettu",
      status: false
    },
    {
      text: "Haluan lukea",
      status: false
    },
    {
      text: "Lukemassa",
      status: false
    },
  ]

  const [isSelected, setSelection] = useState(checkBoxData);

  const isSelectedMounted = useRef(false)

  useEffect(() => {
    console.log('Calls to database. We need to know if item is or is not in readinglist.');
    const checkBookState = async () => {
      console.log(user.uid)
      //(Temp?)Checking if user is logged in
      if(user != null) {
        //Checking if book exists in user's firebase
        const bookRef = doc(FIREBASE_DB, USERS, user.uid, BOOKLIST, bookId)
        const bookSnap = await getDoc(bookRef)

        if(bookSnap.exists()) {
          const bookStatus = bookSnap.data().state
          console.log(bookSnap.data)
          if(bookStatus === "completed"){
            changeState(0)
          } else if (bookStatus === "planning"){
            changeState(1)
          } else if (bookStatus === "reading"){
            changeState(2)
          }
        }
      }
    }
    checkBookState()
  }, []);

  useEffect(() => {
    if(!isSelectedMounted.current) {
      isSelectedMounted.current = true
      return
    }

    const addToBooklist = async () => {
      console.log("addToBooklist ran")
      if(user != null) {
        console.log("addToBooklist: user is not null")
        //Checking if book exists in user's firebase
        const bookRef = doc(FIREBASE_DB, USERS, user.uid, BOOKLIST, bookId)
        const bookSnap = await getDoc(bookRef)

        let newBookStatus = "default"

        isSelected.map((checkbox, index) => {
          console.log(checkbox.status)
          if (checkbox.status) {
            if (index === 0) newBookStatus = "completed";
            else if (index === 1) newBookStatus = "planning";
            else if (index === 2) newBookStatus = "reading";
          }
        })

        console.log(bookSnap.exists())
        console.log(`after switch ${newBookStatus}`)
        if(bookSnap.exists() && newBookStatus != "default") {
          await updateDoc(bookRef, {
            state: newBookStatus
          })
        } else if (newBookStatus == "default") {
          console.log("all boxes unticked, deleting book from database")
          await deleteDoc(bookRef)
        } else {
          console.log("Book doesnt exist, adding to database")
          await setDoc(bookRef, { title: book.bookTitle, author: book.authors, coverPath: book.images, score: 0, state: newBookStatus })
        }
      }
    }
    addToBooklist()
  }, [isSelected]);

  function changeState(index) {
    //console.log(index)
    const newSelection = isSelected.map((checkboxObj, i) => {
      // makes sure marker that is already true can be set to false (unchecked)
      if (i === index && checkboxObj.status){
        return {...checkboxObj, status: false}
      }
      // sets selected marker to true (checked) if it status was false (unchecked)
      else if (i === index && !checkboxObj.status) {
        return {...checkboxObj, status: true}
      }
      // everything else will be false (unchecked)
      else return {...checkboxObj, status: false}
    })
    setSelection(newSelection)
  }

  return(
    <View>
      {isSelected.map((checkboxObj, index) => {
        return (
        <View key={index} style={{padding: 4, display: "flex", flexDirection: "row", alignItems: "center"}}>
          <Text style={{width: 100}}>{checkboxObj.text}</Text>
          <Checkbox
            style={{width: 32, height: 32}}
            disabled={false}
            value={checkboxObj.status}
            onValueChange={() => changeState(index)}
          />
        </View>
        )
      })}
    </View>
  )
}

export default ReadingListPopUp
