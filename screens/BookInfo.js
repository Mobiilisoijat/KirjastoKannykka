import React, { useState } from "react";
import { View, Button, Text, Image } from "react-native";

function BookInfo ({bookId}) {
  const [bookInfo, setBookInfo] = useState(null)

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
      // organisations: ex. "heli-kirjastot"
      const libraryOrganisation = buildings.filter((element) => {
        return element.value.startsWith("0")
      })
      // regions: ex. "Mikkeli"
      const libraryRegion = buildings.filter((element) => {
        return element.value.startsWith("1")
      })
      // library: ex. "Oulun pääkirjasto"
      const library = buildings.filter((element) => {
        return element.value.startsWith("2")
      })

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
          <View>
            <Text>{bookInfo.bookTitle}</Text>
            <Text>{bookInfo.year}</Text>
            {/* we only need the last member of formats, since it gives all the useful information. ex. kirja, E-kirja, Celia-äänikirja */}
            <Text>{bookInfo.formats[(bookInfo.formats.length - 1)].translated}</Text>
            <Image
              style={{height: 160, width: 180}}
              source={{
                uri: `https://api.finna.fi${bookInfo.images}`
              }}
            />
            {bookInfo.rating.count !== 0 ? (<Text>{bookInfo.rating.average} pisteytys, {bookInfo.rating.count} kpl</Text>) : (<Text>Ei vielä arvosteluja</Text>)}
            {
              /*
              Do we need this?
              <Text>{bookInfo.languages}</Text>
              */
            }
            {bookInfo.authors.map((person) => (
              <Text key={person.name}>{person.name} - {person.role || "Tuntematon rooli"}</Text>
            ))}
            {/* info about libraries - nothing is shown if array is empty */}
            {(bookInfo.libraryOrganisation && bookInfo.libraryOrganisation.length > 0) && (
              <View>
                <Text>Organisaatio</Text>
                {bookInfo.libraryOrganisation.map((building) => {
                  //console.log(building);
                  return <Text key={building.value}>{building.translated}</Text>;
                })}
              </View>
            )}
            {(bookInfo.libraryRegion && bookInfo.libraryRegion.length > 0) && (
              <View>
                <Text>Alue</Text>
                {bookInfo.libraryRegion.map((buildings) => {
                  return <Text key={buildings.value}>{buildings.translated}</Text>
                })}
              </View>
            )}
            {(bookInfo.library && bookInfo.library.length > 0) && (
              <View>
                <Text>Kirjasto</Text>
                {bookInfo.library.map((buildings) => {
                  //console.log(buildings)
                  return <Text key={buildings.value}>{buildings.translated}</Text>
                }
                )}
              </View>
            )}
          </View>
        )}
    </View>
  )
}

export default BookInfo
