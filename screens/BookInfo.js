import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import ReadingListPopUp from "../components/ReadingListPopUp";
import LikeButton from "../components/LikeButton";
import { Button, PaperProvider, Divider } from "react-native-paper";
import BookReview from "../components/ReviewComponents/BookReview";
import { getAuth } from "firebase/auth";
import ReviewDialog from "../components/ReviewComponents/ReviewDialog";

function BookInfo ({ route }) {
  const [bookInfo, setBookInfo] = useState(null)
  const [isPopUpVisible, setPopUpVisible] = useState(false)
  const [isAlertVisible, setAlertVisible] = useState(false);
  const [updateData, setUpdateData] = useState(false)
  const { bookId } = route.params

  const auth = getAuth()
  const user = auth.currentUser

  const handlePopUp = () => {
    setPopUpVisible(!isPopUpVisible)
  }

  useEffect(() => {
    getBookInfo(bookId)
  },[updateData])

  const getBookInfo = async (bookId) => {
    try {
      // searching book by its id from finna
      const response = await fetch(`https://api.finna.fi/v1/record?id=${bookId}`)
      const json = await response.json()
      // easy to get
      const bookTitle = json.records[0].title || "Ei saatavilla"
      const rating = json.records[0].rating || 0
      const year = json.records[0].year || null
      let languages = json.records[0].languages || "Ei saatavilla"
      languages = languages.join(", ")
      const images = json.records[0].images[0] || null // we use only the first picture
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
    <PaperProvider>
      <ScrollView>
        {bookInfo && (
          <View style={{alignItems: "center"}}>
            {isAlertVisible && (
              <ReviewDialog isAlertVisible={isAlertVisible} setAlertVisible={setAlertVisible} setUpdateData={setUpdateData}/>
            )
          }
            <Text>{bookInfo.bookTitle}</Text>
            <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
              {
                bookInfo.images
                ? (
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
                :
                (
                  <View
                  style={{
                    height: 299,
                    width: 200,
                    backgroundColor: "#b5b5b5",
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  >
                    <MaterialCommunityIcons name="block-helper" size={64}/>
                  </View>
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
                <LikeButton bookId={bookId} bookInfo={bookInfo}/>
              </View>
            </View>
            {
              /*
              Do we need this?
              <Text>{bookInfo.languages}</Text>
              */
            }
            <Button
              mode="contained"
              onPress={handlePopUp}
              icon={'menu'}
              contentStyle={{ flexDirection: 'row-reverse' }}
              >
              Lisää lukulistalle
            </Button>
            {isPopUpVisible && <ReadingListPopUp bookId={bookId} book={bookInfo}/>}
            {bookInfo.authors.map((person) => (
              <Text key={person.name}>{person.name} - {person.role || "Tuntematon rooli"}</Text>
            ))}
            {/* info about libraries - nothing is shown if array is empty */}
            {(bookInfo.libraryOrganisation && bookInfo.libraryOrganisation.length > 0) && (
              <View style={{display: "flex", flexDirection: "row"}}>
                <Text>Organisaatio</Text>
                <View style={{display: "flex", flexDirection: "column"}}>
                  {bookInfo.libraryOrganisation.map((building) => {
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
                    return <Text style={{marginHorizontal: 12}} key={buildings.value}>{buildings.translated}</Text>
                  }
                )}
                </View>
              </View>
            )}
            <PaperProvider>
              <Divider/>
              <Text style={{paddingTop: 8, paddingBottom: 8, fontSize: 16}}>Käyttäjä arvostelut</Text>
              <BookReview userName={user.uid} bookId={bookId} setAlertVisible={setAlertVisible} setUpdateData={setUpdateData} updateData={updateData}/>
            </PaperProvider>
          </View>
        )}
      </ScrollView>
    </PaperProvider>
  )
}

export default BookInfo
