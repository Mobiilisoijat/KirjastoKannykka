import React, { useEffect, useState } from "react";
import { Button, PaperProvider, Portal, Text } from "react-native-paper";
import { BarChart } from "react-native-gifted-charts";
import { USERS, FIREBASE_DB, FAVORITES, BOOKLIST } from '../firebase/Config';
import { getAuth } from 'firebase/auth'
import { doc, getDoc, query, collection, getDocs, orderBy } from "firebase/firestore";

function StatisticsScreen () {
  const auth = getAuth()
  const user = auth.currentUser
  let likes = 0
  let booksReadList = []
  const [stats, setStats] = useState([])

  useEffect(() => {
    firebaseGetLikes()
  },[])

  const firebaseGetLikes = async () => {
    console.log('ok')
    try {
      if (user.uid) {
        const q = query(collection(FIREBASE_DB, USERS, user.uid, FAVORITES))
        const querySnapshot = await getDocs(q);
        likes = querySnapshot.size
        console.log(likes)
      } else {
        console.log("No uid")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const yearChecker = () => {
    //console.log('///////////////')
    let yearList = []
    booksReadList.forEach((item) => {
      const year = item.value.split("-")[0]
      //console.log('year',year)
      const test = yearList.find((record) => record.label === year)
      // if not in list (meaning it's undefined) we add it to the list
      if (test === undefined){
        yearList.push({value: 1, label: year})
      } else {
        // if already in the list we increase the value by one
        const tempindex = yearList.findIndex((record) => record.label === year)
        yearList[tempindex].value++
      }
    })
    // sorting so that the highest year appears first in the list (ex. 2025 > 2024)
    yearList.sort((a, b) => a.label - b.label)
    setStats(yearList)
  }

  const firebaseGetBookList = async () => {
    console.log('ok')
    try {
      if (user.uid) {
        booksReadList = []
        const q = query(collection(FIREBASE_DB, USERS, user.uid, BOOKLIST))
        const querySnapshot = await getDocs(q);
        const count = querySnapshot.size
        querySnapshot.forEach((doc) => {
          // shows only the books we have read ('completed') per year
          if (doc.data().state == 'completed') {
            booksReadList.push({value: doc.data().time.slice(0,4)})
          }
        });
        yearChecker()
      } else {
        console.log("No uid")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const testiData = [
    {value: 200, label: 'Testi1'},
    {value: 300, label: 'Testi2'},
    {value: 240, label: 'Testi3'},
    {value: 200, label: 'Testi4'},
  ]

  return(
    <PaperProvider>
      <Portal>
        <Text>Tekstiäääääääää</Text>
        <BarChart
                barWidth={24}
                noOfSections={2}
                barBorderRadius={2}
                disablePress={true}
                frontColor="lightgray"
                data={stats}
                yAxisThickness={0}
                xAxisThickness={0}
            />
            <Button
              onPress={() => firebaseGetLikes()}
            >
              Likes
            </Button>
            <Button
              onPress={() => firebaseGetBookList()}
            >
              BookList
            </Button>
      </Portal>
    </PaperProvider>
  )
}

export default StatisticsScreen
