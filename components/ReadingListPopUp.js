import React, { useState } from "react";
import { View, Text } from "react-native";
import Checkbox from "expo-checkbox";

function ReadingListPopUp () {
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

  function changeState(index) {
    console.log(index)
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
        <View key={index}>
          <Text>{checkboxObj.text}</Text>
          <Checkbox
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
