import { useState, useEffect } from 'react';
import { Button } from 'react-native-paper';
import { USERS, FIREBASE_DB, FAVORITES } from '../firebase/Config';
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth'

export default function LikeButton( { bookId, bookInfo } ) {
  const [favourite, setFavourite] = useState(false)

  const auth = getAuth()
  const user = auth.currentUser
  let docRef

  // check if user is logged in
  if (user && user.uid){
    docRef = doc(FIREBASE_DB, USERS, user.uid, FAVORITES, bookId)
  }

  const firebaseDataGet = async () => {
    if (user.uid) {
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const isLiked = docSnap.data().liked
        if (isLiked === true) {
          setFavourite(isLiked)
        }
        //console.log("Document data:", docSnap.data());
      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No uid")
    }
  }

  const firebaseDataAdd = async () => {
    try {
      await setDoc(docRef, {
        author: bookInfo.authors,
        coverPath: bookInfo.images || null,
        liked: true,
        title: bookInfo.bookTitle,
      })
      console.log('add favourite')
    } catch (error) {
      console.log(error)
    }
  }

  const firebaseDataDelete = async () => {
    try {
      await deleteDoc(docRef)
      console.log('delete favourite')
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    firebaseDataGet()
  }, []);

  const favouriteHandler = () => {
    // check if user is authorized
    if (user) {
      setFavourite((favourite) => !favourite)
      if (favourite === true) {
        firebaseDataDelete()
      } else {
        firebaseDataAdd()
      }
    } else {
      // use this in the future to have some effect for non registered users. ex. popup "Make an account to add to favorites!"
      // ex, use react native paper - Dialog component
      console.log("Make an account!")
    }
  }

  return (
    <Button
      onPress={favouriteHandler}
      icon={favourite ? "heart" : "heart-outline"}
      contentStyle={{height: 50}}
      labelStyle={{ fontSize: 30 }}
      style={{height: 50}}
    />
  );
}
