import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import BookInfo from './screens/BookInfo';

// fikka.5779724   Kurjet lentävät etelään , no image and no ratings, unknown roles
// anders.1948617 , image and ratings
// helmet.2254970 , english book. multiple locations

export default function App() {
  return (
    <View style={styles.container}>
      <BookInfo bookId={"anders.1948617"}/>
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
