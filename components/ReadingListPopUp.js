import React, { useState } from "react";
import { View, Text } from "react-native";
import Checkbox from "expo-checkbox";

function ReadingListPopUp () {
  const [isSelected, setSelection] = useState(false);

  return(
    <View>

    <Checkbox
        disabled={false}
        value={isSelected}
        onValueChange={(newValue) => setSelection(newValue)}
      />
      <Text>Nice going</Text>
    </View>
  )
}

export default ReadingListPopUp
