import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import QRCode from 'react-native-qrcode-svg'
import { getAuth } from 'firebase/auth';

export default function QRCodeScreen() {
    const auth = getAuth()
    const userid = auth.currentUser.uid

  return (
    <View style={styles.container}>
      <Text style={{margin: 15, fontSize: 18}}>Näytä QR-koodia kirjaston pääsyportin lukijaan</Text>
      <QRCode
      value={userid}    // Get current user's id: will be used for verifying the read QR-code
      logo={require("../assets/book.png")}  //Book sprite
      logoSize={50}
      size={200}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});