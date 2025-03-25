import { View } from 'react-native'
import React, { useState } from 'react'
import { Modal, Portal, Text, Button, PaperProvider } from 'react-native-paper';

const ChangeUsernamePopUp = () => {
  const [visible, setVisible] = useState(true);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};


  return (
    <PaperProvider>
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <Text>Example Modal.  Click outside this area to dismiss.</Text>
        </Modal>
      </Portal>
    </PaperProvider>
  )
}

export default ChangeUsernamePopUp