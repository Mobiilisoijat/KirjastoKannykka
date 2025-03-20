import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import BooklistItem from '../components/BooklistItem'
import { v4 as uuidv4 } from "uuid"
import { doc, addDoc, collection, BOOKLIST, USERS, USERID, firestore, deleteDoc, onSnapshot, query, setDoc } from '../firebase/Config'

const BookList = () => {
  const [currentList, setCurrentList] = useState([]) //use
  const [filterState, setFilterState] = useState('all')
  const [planList, setPlanList] = useState ([])
  const [readingList, setReadingList] = useState ([])
  const [completedList, setCompletedList] = useState ([])
  const testList = ([
    { id: 100, author: "J.K. Rowling", title: "Harry Potter", score: "7" },
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
  ])

  useEffect(() => {
    //save test
    const saveTEST = async () => {
        await save(); // Wait for save() to complete
      };
    saveTEST()
    
    //get users booklist data from firebase
    const queryRef = query(collection(firestore, USERS, USERID, BOOKLIST))
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
        const bookRef = doc(firestore, USERS, USERID, BOOKLIST, String(book.id));
        await setDoc(bookRef, { title: book.title, author: book.author, score: book.score });
    }
    } catch (error) {
        console.error("ERROR SAVING BOOK, error")
        console.error(error.stack)
    }
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
            data = {currentList}
            keyExtractor={item => item.id}
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