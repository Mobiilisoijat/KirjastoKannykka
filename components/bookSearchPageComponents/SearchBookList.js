import { View, Text, FlatList } from 'react-native'
import React from 'react'
import SearchBookListItem from './SearchBookListItem'

const SearchBookList = ({data}) => {

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

  return (
    <View>
        <Text>Tässä listaa:</Text>
      <FlatList
      data = {data}
      keyExtractor={item => {item.id.toString(); console.log(data)}}
      renderItem={({item}) => (
      <SearchBookListItem item = {item}/>
    )}
      />

      
    </View>
  )
}

export default SearchBookList