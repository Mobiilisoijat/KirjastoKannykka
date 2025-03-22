import { Pressable } from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useState, useEffect } from 'react';

export default function LikeButton() {
  const [favourite, setFavourite] = useState(false) // we need to get this value from database

  useEffect(() => {
    console.log('Calls to database. We need to know if item is in favourites.');
  }, []);

  const favouriteHandler = () => {
    // set value also into to the database
    setFavourite((favourite) => !favourite)
  }

  return (
    <Pressable onPress={favouriteHandler}>
      <AntDesign name={favourite ? "heart" : "hearto"} size={32} color="black" />
    </Pressable>
  );
}
