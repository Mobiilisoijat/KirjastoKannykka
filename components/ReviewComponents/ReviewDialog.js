import { Button, Dialog, IconButton, Portal, Text } from "react-native-paper";
import { View } from "react-native";

const ReviewDialog = ({ isAlertVisible, setAlertVisible, setUpdateData }) => {
  return(
    <Portal>
      <Dialog visible={isAlertVisible} onDismiss={() => setAlertVisible(false)}>
        <View style={{display: "flex", flexDirection: "row", justifyContent: 'space-between'}}>
          <Dialog.Title>Huomautus</Dialog.Title>
          <IconButton
            icon={'close-thick'}
            onPress={() => setAlertVisible(false)}
          />
        </View>
        <Dialog.Content>
          <Text>Sinulla on jo arvostelu tästä kirjasta.</Text>
          <Text>Haluatko korvata vanhan arvostelun tällä uudella arvostelulla?</Text>
          <Button
            mode="contained"
            style={{margin: 4}}
            onPress={() => {
              setUpdateData(true)
              setAlertVisible(false)
            }}
          >
            Kyllä
          </Button>
          <Button
            mode="contained"
            style={{margin: 4}}
            onPress={() => setAlertVisible(false)}
          >
            En
          </Button>
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}

export default ReviewDialog
