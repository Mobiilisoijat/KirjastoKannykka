import { StyleSheet, Text, View, FlatList, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import BooklistItem from '../components/BooklistItem'

const BookList = () => {
  const [currentList, setCurrentList] = useState([]) //use

  useEffect(() => {
    //useEffect for testing
    setCurrentList([
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
      ]);
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