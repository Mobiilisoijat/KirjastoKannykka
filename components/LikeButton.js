import { useState, useEffect } from 'react';
import { Button } from 'react-native-paper';

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
    <Button
      onPress={favouriteHandler}
      icon={favourite ? "heart" : "heart-outline"}
      contentStyle={{height: 50}}
      labelStyle={{ fontSize: 30 }}
      style={{height: 50}}
    />
  );
}
