import React, { useState } from "react";
import { View, Button, Text, Image, TouchableOpacity, Alert } from "react-native";
import ReadingListPopUp from "../components/ReadingListPopUp";

function BookInfo ({bookId}) {
  const [bookInfo, setBookInfo] = useState(null)
  const [isPopUpVisible, setPopUpVisible] = useState(false)

  const handlePopUp = () => {
    setPopUpVisible(!isPopUpVisible)
  }

  const getBookInfo = async (bookId) => {
    try {
      // searching book by its id from finna
      const response = await fetch(`https://api.finna.fi/v1/record?id=${bookId}`)
      const json = await response.json()
      // easy to get
      const bookTitle = json.records[0].title || "Not available"
      const rating = json.records[0].rating || 0
      const year = json.records[0].year
      let languages = json.records[0].languages || "Not available"
      languages = languages.join(", ")
      const images = json.records[0].images[0] // we use only the first picture
      // need to dig
      const buildings = json.records[0].buildings
      const authors = json.records[0].nonPresenterAuthors
      const formats = json.records[0].formats

      // Buildings
      const librariesCleaner = buildings.filter((element) => {
        return element.value.startsWith("0") || element.value.startsWith("1") || element.value.startsWith("2")
      })

      const libraryOrganisation = []
      const libraryRegion = []
      const library = []

      librariesCleaner.forEach((element) => {
        if (element.value.startsWith("0")){
          libraryOrganisation.push(element)
        } else if (element.value.startsWith("1")){
          libraryRegion.push(element)
        } else if (element.value.startsWith("2")){
          library.push(element)
      }})

      const values = {bookTitle, year, rating, languages, images, authors, libraryOrganisation, libraryRegion, library, formats }
      setBookInfo(values)
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <View>
      <Button title='GET' onPress={()=>getBookInfo(bookId)}/>
        {bookInfo && (
          <View style={{alignItems: "center"}}>
            <Text>{bookInfo.bookTitle}</Text>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
              {
                bookInfo.images && (
                <Image
                  style={{
                    height: 299,
                    width: 200,
                    resizeMode: "contain"
                  }}
                  source={{
                    uri: `https://api.finna.fi${bookInfo.images}`
                  }}
                />
                )
              }
              <View style={{alignItems: "center"}}>
                <Text>{bookInfo.year}</Text>
                {/* we only need the last member of formats, since it gives all the useful information. ex. kirja, E-kirja, Celia-äänikirja */}
                <Text>{bookInfo.formats[(bookInfo.formats.length - 1)].translated}</Text>
                {
                  bookInfo.rating.count !== 0
                  ?
                  (
                    <Text>
                      {bookInfo.rating.average} / 100, {" "}
                      {bookInfo.rating.count >  1 ? `${bookInfo.rating.count} ääntä` : "1 ääni"}
                    </Text>
                  )
                  :
                  <Text>Ei vielä arvosteluja</Text>
                }
              </View>
            </View>
            {
              /*
              Do we need this?
              <Text>{bookInfo.languages}</Text>
              */
            }
            <TouchableOpacity
              onPress={handlePopUp}
            >
              <Text>Lisää lukulistalle</Text>
            </TouchableOpacity>
            {isPopUpVisible && <ReadingListPopUp/>}
            {bookInfo.authors.map((person) => (
              <Text key={person.name}>{person.name} - {person.role || "Tuntematon rooli"}</Text>
            ))}
            {/* info about libraries - nothing is shown if array is empty */}
            {(bookInfo.libraryOrganisation && bookInfo.libraryOrganisation.length > 0) && (
              <View style={{display: "flex", flexDirection: "row"}}>
                <Text>Organisaatio</Text>
                <View style={{display: "flex", flexDirection: "column"}}>
                  {bookInfo.libraryOrganisation.map((building) => {
                    //console.log(building);
                    return <Text style={{marginHorizontal: 12}} key={building.value}>{building.translated}</Text>;
                  })}
                </View>
              </View>
            )}
            {(bookInfo.libraryRegion && bookInfo.libraryRegion.length > 0) && (
              <View style={{display: "flex", flexDirection: "row"}}>
                <Text>Alue</Text>
                <View style={{display: "flex", flexDirection: "column"}}>
                  {bookInfo.libraryRegion.map((buildings) => {
                    return <Text style={{marginHorizontal: 12}} key={buildings.value}>{buildings.translated}</Text>
                  })}
                </View>
              </View>
            )}
            {(bookInfo.library && bookInfo.library.length > 0) && (
              <View style={{display: "flex", flexDirection: "row"}}>
                <Text>Kirjasto</Text>
                <View style={{display: "flex", flexDirection: "column"}}>
                  {bookInfo.library.map((buildings) => {
                    //console.log(buildings)
                    return <Text style={{marginHorizontal: 12}} key={buildings.value}>{buildings.translated}</Text>
                  }
                  )}
                </View>
              </View>
            )}
          </View>
        )}
    </View>
  )
}

export default BookInfo
