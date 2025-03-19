import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BookInfo from './screens/BookInfo';

//kirjat
// kirjava.4159324e6346542f4141414141413d3d   Minna Kurjenluoma : lost in between : landscapes
// fikka.5779724   Kurjet lentävät etelään

export default function App() {
  return (
    <View style={styles.container}>
      <BookInfo bookId={"jyx.123456789_43926"}/>
      <Text>Open up App.js to start working on your app!</Text>
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
