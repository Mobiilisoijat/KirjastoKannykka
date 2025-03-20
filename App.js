import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BookInfo from './screens/BookInfo';

// fikka.5779724   Kurjet lentävät etelään , no image and no ratings, unknown roles
// anders.1948617 , image and ratings
// helmet.2254970 , swedish book. image and multiple locations

export default function App() {
  return (
    <View style={styles.container}>
      <BookInfo bookId={"helmet.2254970"}/>
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
