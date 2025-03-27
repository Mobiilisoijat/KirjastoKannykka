import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import BooklistItem from '../components/BooklistItem'
import { FIREBASE_DB, BOOKLIST, USERS, USERID } from '../firebase/Config'
import { v4 as uuidv4 } from "uuid"
import { doc, addDoc, collection, deleteDoc, onSnapshot, query, setDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { Button } from 'react-native-paper'

const BookList = ({toggleState, textInput}) => {
  const [currentList, setCurrentList] = useState([]) //Data from firebase
  const [filteredList, setFilteredList] = useState ([])
  const auth = getAuth()
  const user = auth.currentUser

  const testList = ([
    { id: 150, author: "J.K. Rowling", title: "Harry Potter", score: "7", state: "completed" },
    { id: 52, author: "George Orwell", title: "1984", score: "9", state: "reading" },
    { id: 53, author: "F. Scott Fitzgerald", title: "The Great Gatsby", score: "8", state: "planning" },
    { id: 54, author: "Harper Lee", title: "To Kill a Mockingbird", score: "9", state: "completed" },
    { id: 55, author: "J.R.R. Tolkien", title: "The Lord of the Rings", score: "10", state: "reading" },
    { id: 56, author: "Jane Austen", title: "Pride and Prejudice", score: "8", state: "planning" },
    { id: 57, author: "Markus Zusak", title: "The Book Thief", score: "9", state: "completed" },
    { id: 58, author: "Aldous Huxley", title: "Brave New World", score: "8", state: "reading" },
    { id: 59, author: "Paulo Coelho", title: "The Alchemist", score: "7", state: "planning" },
    { id: 60, author: "Gabriel García Márquez", title: "One Hundred Years of Solitude", score: "9", state: "completed" },
    { id: 61, author: "Leo Tolstoy", title: "War and Peace", score: "9", state: "reading" },
    { id: 62, author: "Herman Melville", title: "Moby-Dick", score: "8", state: "planning" },
    { id: 63, author: "Mary Shelley", title: "Frankenstein", score: "7", state: "completed" },
    { id: 64, author: "Charlotte Brontë", title: "Jane Eyre", score: "8", state: "reading" },
    { id: 65, author: "Emily Brontë", title: "Wuthering Heights", score: "8", state: "planning" },
    { id: 66, author: "Victor Hugo", title: "Les Misérables", score: "9", state: "completed" },
    { id: 67, author: "Fyodor Dostoevsky", title: "Crime and Punishment", score: "9", state: "reading" },
    { id: 68, author: "Miguel de Cervantes", title: "Don Quixote", score: "10", state: "planning" },
    { id: 69, author: "Homer", title: "The Odyssey", score: "9", state: "completed" },
    { id: 70, author: "Dante Alighieri", title: "The Divine Comedy", score: "8", state: "reading" }
    ]);



  useEffect(() => {
    filterBooklist()
  }, [toggleState, currentList, textInput])

  useEffect(() => {
    //save test
    const saveTEST = async () => {
        await save(); // Wait for save() to complete
      };
    saveTEST()

    //get users booklist data from firebase
    const queryRef = query(collection(FIREBASE_DB, USERS, user.uid, BOOKLIST))
    const unsubscribeSnapshot = onSnapshot(queryRef, (querySnapshot) => {
        const booklist = []
        querySnapshot.forEach((doc) => {
            booklist.push({...doc.data(), id: doc.id})
        })
        setCurrentList(booklist)
    })
    return () => {
        unsubscribeSnapshot()
    }
  }, [])

  const save = async () => {
    try {
    for (const book of testList) {
        const bookRef = doc(FIREBASE_DB, USERS, user.uid, BOOKLIST, String(book.id))
        await setDoc(bookRef, { title: book.title, author: book.author[0].name, score: book.score, state: book.state })
    }
    } catch (error) {
        console.error("ERROR SAVING BOOK, error")
        console.error(error.stack)
    }
  }

  const filterBooklist = () => {
    let filtered = currentList

    if (toggleState != "all") {
        filtered = currentList.filter((item) => item.state === toggleState)
    }
    if (textInput && textInput.trim() !== "") {
        filtered = filtered.filter(book =>
          book.author.toLowerCase().includes(textInput.toLowerCase()) ||
          book.title.toLowerCase().includes(textInput.toLowerCase())
        );
    }
    setFilteredList(filtered)
  }

  useEffect(() => {
    //useEffect for testing
    /*setCurrentList([
        ...currentList,
        { id: 1, author: "J.K. Rowling", title: "Harry Potter", score: "7" },
        { id: 2, author: "George Orwell", title: "1984", score: "9" },
        { id: 3, author: "F. Scott Fitzgerald", title: "The Great Gatsby", score: "8" },
        { id: 4, author: "Harper Lee", title: "To Kill a Mockingbird", score: "9" },
        { id: 5, author: "J.R.R. Tolkien", title: "The Lord of the Rings", score: "10" },
        { id: 6, author: "Jane Austen", title: "Pride and Prejudice", score: "8" },
        { id: 7, author: "Markus Zusak", title: "The Book Thief", score: "9" },
        { id: 8, author: "Aldous Huxley", title: "Brave New World", score: "8" },
        { id: 9, author: "Paulo Coelho", title: "The Alchemist", score: "7" },
        { id: 10, author: "Gabriel García Márquez", title: "One Hundred Years of Solitude", score: "9" },
        { id: 11, author: "Leo Tolstoy", title: "War and Peace", score: "9" },
        { id: 12, author: "Herman Melville", title: "Moby-Dick", score: "8" },
        { id: 13, author: "Mary Shelley", title: "Frankenstein", score: "7" },
        { id: 14, author: "Charlotte Brontë", title: "Jane Eyre", score: "8" },
        { id: 15, author: "Emily Brontë", title: "Wuthering Heights", score: "8" },
        { id: 16, author: "Victor Hugo", title: "Les Misérables", score: "9" },
        { id: 17, author: "Fyodor Dostoevsky", title: "Crime and Punishment", score: "9" },
        { id: 18, author: "Miguel de Cervantes", title: "Don Quixote", score: "10" },
        { id: 19, author: "Homer", title: "The Odyssey", score: "9" },
        { id: 20, author: "Dante Alighieri", title: "The Divine Comedy", score: "8" }
      ])*/
  }, [])

  return (
    <FlatList
        data = {filteredList}
        keyExtractor={item => item.id.toString()}
        renderItem = {({item}) => (
        <BooklistItem
            item = {item}
        />
        )}
    />

  )
}

export default BookList

const styles = StyleSheet.create({})
