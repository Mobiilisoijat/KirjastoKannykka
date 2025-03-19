import React, { useState } from "react";
import { View, Button, Text, Image } from "react-native";

function BookInfo ({bookId}) {
  const [bookInfo, setBookInfo] = useState(null)

  const getBookInfo = async (bookId) => {
    try {
      //test book name: Kurjet lentevat etelaan

      // first we search book by its id
      const response = await fetch(`https://api.finna.fi/v1/record?id=${bookId}`)
      const json = await response.json()
      //easy to get
      const bookTitle = json.records[0].title || "Not available"
      const rating = json.records[0].rating || 0
      let languages = json.records[0].languages
      languages = languages.join(", ")
      const images = json.records[0].images[0] // we use only the first picture
      console.log("IMAGES", images)
      //need to dig
      const buildings = json.records[0].buildings
      const authors = json.records[0].nonPresenterAuthors

      //authors.forEach(element => {
      //  console.log(element.name)
      //});
      //buildings.forEach(element => {
      //  console.log(element.value)
      //});
     // console.log(buildings)

      // organisations: like "heli-kirjastot"
      const libraryOrganisation = buildings.filter((element) => {
        return element.value.startsWith("0")
      })
      // regions: like "Mikkeli"
      const libraryRegion = buildings.filter((element) => {
        return element.value.startsWith("1")
      })
      // library: like "Oulun pääkirjasto"
      const library = buildings.filter((element) => {
        return element.value.startsWith("2")
      })

      //let test = filteredBuildings.sort()
      //console.log("TEST", test)
      //filteredBuildings.forEach(element => {
      //  console.log(element.value, element.translated)
      //});

      //for (const i in buildings){
      //  console.log(buildings[i])
      //  if (buildings[i].value.startsWith("2")){
      //  }
      //}

      //console.log("Filtered", filteredBuildings)

      //const authorAndPublisher = authors.filter((i) =>{
      //  i.role==="kirjoittaja" || i.role==="kustantaja"
      //})
      //console.log('auth and pub', authorAndPublisher)
      //console.log(buildings)
      //console.log("kirjoittaja ja kustantaja", authorAndPublisher)
      //console.log(bookTitle)
      //console.log(rating.average, rating.count)
      //languages.forEach(element => {
      //  console.log(element)
      //});
      //console.log(languages)
      //console.log(images)

      const values = {bookTitle, rating, languages, images, authors, libraryOrganisation, libraryRegion, library }
      //console.log(values)
      setBookInfo(values)
      // next we search all the books with the same name
      //const ass = "Kurjet"
      //const response2 = await fetch(`https://api.finna.fi/v1/search?filter[]=title:${bookTitle}&filter[]=~format:"0/Book/"`)
      //const json2 = await response2.json()
      //console.log(json2.records.length) // we want array length since there can be multiple places where this book is located
      //for (let i = 0; i < json2.records.length; i++) {
      //  console.log("AAA", json2.records[i].buildings)
      //}
      //console.log(json2.records)
      //console.log(json2.records[1].buildings)

    } catch (error) {
      console.log(error)
    }
  }

  return(
    <View>
      <Button title='GET' onPress={()=>getBookInfo(bookId)}/>
        {bookInfo && (
          <View>

            <Image
              style={{height: 160, width: 180}}
              source={{
                uri: `https://api.finna.fi${bookInfo.images}`
              }}
            />

            <Text>{bookInfo.bookTitle}</Text>
            {bookInfo.rating.count !== 0 ? (<Text>{bookInfo.rating.average} pisteytys, {bookInfo.rating.count} kpl</Text>) : (<Text>Ei vielä arvosteluja</Text>)}
            <Text>{bookInfo.languages}</Text>
            {bookInfo.authors.map((person) => (
              <Text key={person.name}>{person.name} - {person.role || "?"}</Text>
            ))}
            {/* info about libraries */}
            {bookInfo.libraryOrganisation.map((buildings) => {
              console.log(buildings)
              return <Text key={buildings.value}>O {buildings.translated}</Text>
            }
            )}
            {bookInfo.libraryRegion.map((buildings) => {
              console.log(buildings)
              return <Text key={buildings.value}>R {buildings.translated}</Text>
            }
            )}
            {bookInfo.library.map((buildings) => {
              console.log(buildings)
              console.log(`https://api.finna.fi${bookInfo.images}`)
              if (buildings === null) {console.log("No value")}
              return <Text key={buildings.value}>K {buildings.translated}</Text>
            }
            )}
          </View>
        )}
    </View>
  )
}

export default BookInfo
