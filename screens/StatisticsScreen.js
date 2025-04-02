import React, { useEffect, useRef, useState } from "react";
import { Button, PaperProvider, Text } from "react-native-paper";
import { BarChart } from "react-native-gifted-charts";
import { USERS, FIREBASE_DB, FAVORITES, BOOKLIST } from '../firebase/Config';
import { getAuth } from 'firebase/auth'
import { query, collection, getDocs} from "firebase/firestore";
import { ScrollView } from "react-native";

function StatisticsScreen () {
  const auth = getAuth()
  const user = auth.currentUser

  const [likes, setLikes] = useState(0)
  const [booksReadListPerYear, setBooksReadListPerYear] = useState([])
  const [booksReadListInYear, setBooksReadListInYear] = useState([])
  const [statsChart1, setStatsChart1] = useState([])
  const [statsChart2, setStatsChart2] = useState([])
  const wasListUpdated = useRef(false)
  let currentYear = 0

  useEffect(() => {
    fetchData()
    console.log('useEffect ran, fethcingData')
  }, [])

  useEffect(() => {
    if (booksReadListPerYear.length > 0 || booksReadListInYear.length > 0) {
      chartData();
      console.log('useEffect ran, ChartData')
    }
  }, [booksReadListPerYear, booksReadListInYear]);

  const fetchData = async () => {
    await firebaseGetLikes()
    await firebaseGetBookList()
  }

  const firebaseGetLikes = async () => {
    try {
      if (user.uid) {
        const q = query(collection(FIREBASE_DB, USERS, user.uid, FAVORITES))
        const querySnapshot = await getDocs(q);
        const templikes = querySnapshot.size
        setLikes(templikes)
      } else {
        console.log("No uid")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const chartData = () => {
    // book readings trought all the years
    let yearList = []
    booksReadListPerYear.forEach((item) => {
      const year = item.value.split("-")[0]
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
    // NOTE! We are missing a system where missing years would be added
    // ex. someone could read a book in 2023 and 2025 but not in 2024. this wouldnt show up on the list
    setStatsChart1(yearList)

    // book readings in current year
    const valmisData = [
      {value: 0, label: '01'},
      {value: 0, label: '02'},
      {value: 0, label: '03'},
      {value: 0, label: '04'},
      {value: 0, label: '05'},
      {value: 0, label: '06'},
      {value: 0, label: '07'},
      {value: 0, label: '08'},
      {value: 0, label: '09'},
      {value: 0, label: '10'},
      {value: 0, label: '11'},
      {value: 0, label: '12'},
    ]

    booksReadListInYear.forEach(i => {
      const tempindex = valmisData.findIndex((record) => record.label === i.value)
      valmisData[tempindex].value++
    })
    setStatsChart2(valmisData)
  }

  const firebaseGetBookList = async () => {
    // we want the current date so we know what year it is
    const currentDate = new Date()
    const isoString = currentDate.toISOString()
    currentYear = isoString.split("-")[0]
    try {
      if (user.uid) {
        // resetting the lists
        const tempPerYear = []
        const tempInYear = []
        const q = query(collection(FIREBASE_DB, USERS, user.uid, BOOKLIST))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // shows only the books we have read ('completed') per year
          if (doc.data().state == 'completed') {
            tempPerYear.push({value: doc.data().time.slice(0,4)})
          } if (doc.data().time && doc.data().time.startsWith(currentYear)){
            tempInYear.push({value: doc.data().time.slice(5,7)})
          }
        })
        // if tempYear is not empty we set wasListUpdated to true. This in turn makes sure that the chart is shown
        if (tempInYear.length > 0){
          wasListUpdated.current = true
        }
        setBooksReadListPerYear(tempPerYear)
        setBooksReadListInYear(tempInYear)
      } else {
        console.log("No uid")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <PaperProvider>
      <ScrollView style={{marginBottom: 42}}>
        <Text>Tykättyjen kirjojen määrä: {likes}</Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
          >
        Luetut kirjat per vuosi
        </Text>
        {
          (statsChart1.length > 0)
          ?
          <BarChart
            barWidth={24}
            //noOfSections={2}
            barBorderRadius={2}
            disablePress={true}
            frontColor="blue"
            data={statsChart1}
            roundToDigits={0}
            yAxisThickness={0}
            xAxisThickness={0}
            isAnimated
          />
          :
          <Text>Lisää kirja luetuksi lukulistalle nähdäksesi tulokset!</Text>
        }
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
          }}
          >
        Luetut kirjat tänä vuonna
        </Text>
        {
          ((statsChart2.length > 0) && wasListUpdated.current == true)
          ?
          <BarChart
            barWidth={24}
            roundToDigits={0}
            barBorderRadius={2}
            disablePress={true}
            frontColor="red"
            data={statsChart2}
            yAxisThickness={0}
            xAxisThickness={0}
            isAnimated
            yAxisSuffix=""
          />
          :
          <Text>Et ole lukenut tänä vuonna kirjoja!</Text>
        }
        <Button
          onPress={() => firebaseGetBookList()}
          >
          BookList
        </Button>
      </ScrollView>
    </PaperProvider>
  )
}

export default StatisticsScreen
