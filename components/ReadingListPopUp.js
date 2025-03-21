import React, { useState } from "react";
import { View, Text } from "react-native";
import Checkbox from "expo-checkbox";

function ReadingListPopUp () {
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

  useEffect(() => {
    console.log('Calls to database. We need to know if item is or is not in readinglist.');
  }, []);

  const [isSelected, setSelection] = useState(checkBoxData);

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
