import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { USERS, FIREBASE_DB, FAVOURITES } from '../firebase/Config';
import {  doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth'

export default function LikeButton( {bookId} ) {
  const [favourite, setFavourite] = useState(false) // we need to get this value from database

  const auth = getAuth()
  const user = auth.currentUser
//FIREBASE_DB, "Users", "nokBKttDsDkfc8THvcsP", 'Favorites', `${bookId}`)
  const docRef = doc(FIREBASE_DB, USERS, user.uid, FAVOURITES, `${bookId}`)

  const firebaseDataGet = async () => {
    console.log(user.id)
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
  }

  const firebaseDataAdd = async () => {
    await setDoc(doc(docRef), {
      author: "Testi Tester",
      liked: true,
      title: `Book about ${bookId}`
    })
    console.log('add')
  }

  const firebaseDataDelete = async () => {
    await deleteDoc(doc(docRef))
    console.log('delete')
  }

  useEffect(() => {
    firebaseDataGet()
  }, []);

  const favouriteHandler = () => {
    setFavourite((favourite) => !favourite)
    if (favourite === true) {
      firebaseDataDelete()
    } else {
      firebaseDataAdd()
    }
  }

  return (
    <View>
      <Button
        onPress={favouriteHandler}
        icon={favourite ? "heart" : "heart-outline"}
        contentStyle={{height: 50}}
        labelStyle={{ fontSize: 30 }}
        style={{height: 50}}
      />

    </View>
  );
}
