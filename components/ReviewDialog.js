import { Dialog, Portal, Text } from "react-native-paper";
import { useState } from "react";
const ReviewDialog = () => {
  const [visible, setVisible] = useState(true); // Make it visible by default

  return(
    <Portal>
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>Idiot</Dialog.Title>
        <Dialog.Content>
          <Text>Thanks for nothing</Text>
        </Dialog.Content>
      </Dialog>
    </Portal>
  )
}

export default ReviewDialog
