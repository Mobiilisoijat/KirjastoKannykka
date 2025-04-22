import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { Text, Button, Card, Title } from 'react-native-paper';
import { FIREBASE_DB, USERS, BOOKLIST } from '../firebase/Config';
import { getAuth } from 'firebase/auth';
import { collection, query, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';

const ReadingSessionScreen = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  
  const auth = getAuth();
  const user = auth.currentUser;
  
  const timerRef = useRef(null);

  // Get books from Firebase
  useEffect(() => {
    if (!user) return;
    
    const queryRef = query(collection(FIREBASE_DB, USERS, user.uid, BOOKLIST));
    
    const unsubscribe = onSnapshot(queryRef, (querySnapshot) => {
      const booksList = [];
      querySnapshot.forEach((doc) => {
        booksList.push({ ...doc.data(), id: doc.id });
      });
      setBooks(booksList);
    });
    
    return () => unsubscribe();
  }, []);

  // Timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  // Start or pause the timer
  const toggleTimer = () => {
    if (!selectedBook) return;
    setIsRunning(!isRunning);
  };

  // Select a book to read
  const selectBook = (book) => {
    setSelectedBook(book);
    setIsRunning(false);
    setElapsedTime(0);
  };

  // End reading session and save to Firebase
  const endReadingSession = async () => {
    if (!selectedBook || elapsedTime === 0) return;
    
    setIsRunning(false);
    
    try {
      const bookRef = doc(FIREBASE_DB, USERS, user.uid, BOOKLIST, selectedBook.id);
      const bookSnap = await getDoc(bookRef);
      const bookData = bookSnap.data();
      
      const previousReadingTime = bookData.readingTime || 0;
      const newReadingTime = previousReadingTime + elapsedTime;
      
      // Update the book reading time
      await updateDoc(bookRef, {
        readingTime: newReadingTime,
        lastReadingSession: new Date().toISOString()
      });
      
      // Reset timer and selection
      setElapsedTime(0);
      setSelectedBook(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Lukuhetki</Title>
      
      {!selectedBook ? (
        <View>
          <Text style={styles.instructions}>Valitse luettava kirja:</Text>
          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.bookCard} onPress={() => selectBook(item)}>
                <Card.Content>
                  <Title>{item.title}</Title>
                  <Text>{item.author[0]?.name || "Unknown"}</Text>
                  {item.readingTime && (
                    <Text>Aiempi lukuaika: {formatTime(item.readingTime)}</Text>
                  )}
                </Card.Content>
              </Card>
            )}
          />
        </View>
      ) : (
        <View style={styles.sessionContainer}>
          <Card style={styles.bookCard}>
            <Card.Content>
              <Title>{selectedBook.title}</Title>
              <Text>{selectedBook.author[0]?.name || "Unknown"}</Text>
              <Text style={styles.timer}>{formatTime(elapsedTime)}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  mode="contained"
                  onPress={toggleTimer}
                  style={styles.button}
                >
                  {isRunning ? 'Pysäytä' : 'Aloita'}
                </Button>
                <Button
                  mode="contained"
                  onPress={endReadingSession}
                  style={styles.button}
                  disabled={elapsedTime === 0}
                >
                  Tallenna Lukuhetki
                </Button>
              </View>
            </Card.Content>
          </Card>
          <Button
            mode="outlined"
            onPress={() => {
              setSelectedBook(null);
              setElapsedTime(0);
              setIsRunning(false);
            }}
            style={styles.backButton}
          >
            Takaisin Kirjavalintaan
          </Button>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  instructions: {
    marginBottom: 16,
  },
  bookCard: {
    marginBottom: 8,
  },
  sessionContainer: {
    flex: 1,
  },
  timer: {
    fontSize: 48,
    textAlign: 'center',
    marginVertical: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 16,
  },
  button: {
    minWidth: 120,
  },
  divider: {
    marginVertical: 16,
  },
  backButton: {
    marginTop: 16,
  },
})

export default ReadingSessionScreen;