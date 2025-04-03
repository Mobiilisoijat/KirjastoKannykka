import React, { useEffect, useRef, useState } from "react";
import { Button, PaperProvider, Text } from "react-native-paper";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { USERS, FIREBASE_DB, FAVORITES, BOOKLIST } from '../firebase/Config';
import { getAuth } from 'firebase/auth'
import { query, collection, getDocs} from "firebase/firestore";
import { ScrollView, View } from "react-native";

function StatisticsScreen () {
  const auth = getAuth()
  const user = auth.currentUser

  const [likes, setLikes] = useState(0)
  const [booksReadListPerYear, setBooksReadListPerYear] = useState([])
  const [booksReadListInYear, setBooksReadListInYear] = useState([])
  const [statsChart1, setStatsChart1] = useState([])
  const [statsChart2, setStatsChart2] = useState([])
  const [maxHeightChart1, setMaxHeightChart1] = useState(1)
  const [maxHeightChart2, setMaxHeightChart2] = useState(1)
  const wasListUpdated = useRef(false)
  let currentYear = 0
  //let bookStatusList = [0, 0, 0]
  const [bookStatusList, setBookStatusList] = useState([])

  useEffect(() => {
    // we setup max height for charts. Incase something screws up value 1 is set as the maxHeight
    const maxHeight1 = Math.max(...statsChart1.map((obj) => obj.value), 1)
    setMaxHeightChart1(maxHeight1)
    const maxHeight2 = Math.max(...statsChart2.map((obj) => obj.value), 1)
    setMaxHeightChart2(maxHeight2)
  },[statsChart1, statsChart2])

  useEffect(() => {
    fetchData()
    //console.log('useEffect ran, fethcingData')
  }, [])

  useEffect(() => {
    if (booksReadListPerYear.length > 0 || booksReadListInYear.length > 0) {
      chartData();
      //console.log('useEffect ran, ChartData')
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
    let lowestYear = 0
    let highestYear = 0
    booksReadListPerYear.forEach((item) => {
      const year = item.value.split("-")[0]
      const recordObject = yearList.find((record) => record.label === year)
      // if not in list (meaning it's undefined) we add it to the list
      if (recordObject === undefined){
        yearList.push({value: 1, label: year})
      } else {
        // if already in the list we increase the value by one
        const tempindex = yearList.findIndex((record) => record.label === year)
        yearList[tempindex].value++
      }
      if (year > highestYear) {
        highestYear = year
        if (lowestYear === 0){
          lowestYear = year
        }
      } else if (year < lowestYear){
        lowestYear = year
      }
    })
    //console.log('lowest', lowestYear)
    //console.log('biggest', highestYear)
    // checks if user has no books read between years and adds the year if so
    // ex. someone could read a book in 2023 and 2025 but not in 2024
    for (let i = parseInt(lowestYear)+1; i < highestYear; i++) {
      const recordObject = yearList.find((record) => record.label === i)
      if (recordObject === undefined){
        yearList.push({value: 0, label: i})
      }
    }
    // sorting so that the highest year appears first in the list (ex. 2025 > 2024)
    yearList.sort((a, b) => a.label - b.label)
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
        let statusList = [{value: 0, color: 'lightblue'},{value: 0, color: 'lightgreen'},{value: 0, color: 'orange'}]
        const q = query(collection(FIREBASE_DB, USERS, user.uid, BOOKLIST))
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          // shows only the books we have read ('completed') per year
          if (doc.data().state == 'completed') {
            statusList[0].value += 1
            tempPerYear.push({value: doc.data().time.slice(0,4)})
            if (doc.data().state == 'completed' && doc.data().time && doc.data().time.startsWith(currentYear)){
              tempInYear.push({value: doc.data().time.slice(5,7)})
            }
          } else if (doc.data().state == 'planning'){
            statusList[1].value += 1
          } else if (doc.data().state == 'reading'){
            statusList[2].value += 1
          }
        })
        setBookStatusList([...statusList])
        bookStatusList.forEach(i => console.log('b', i))
        statusList.forEach(i => console.log('b', i))
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

  const renderLegend = (text, color) => {
    return (
      <View style={{flexDirection: 'row', marginBottom: 12}}>
        <View
          style={{
            height: 18,
            width: 18,
            marginRight: 10,
            borderRadius: 4,
            backgroundColor: color || 'white',
          }}
        />
        <Text style={{color: 'black', fontSize: 16}}>{text || ''}</Text>
      </View>
    );
  };

  return(
    <PaperProvider>
      <ScrollView style={{marginBottom: 60}}>
        <Text>Tykättyjen kirjojen määrä: {likes}</Text>
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 16
          }}
          >
          Kirjalistan tiedot
        </Text>
        {
          (statsChart1.length > 0)
          ?
          <View>
            <PieChart
              showValuesAsLabels
              showText
              textColor="black"
              radius={150}
              textSize={20}
              showTextBackground
              textBackgroundRadius={26}
              data={bookStatusList}
              onPress={() => bookStatusList.forEach(i => console.log(i))}
            />
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                marginTop: 20,
              }}>
              {renderLegend('Luettu', 'lightblue')}
              {renderLegend('Aikomus lukea', 'lightgreen')}
              {renderLegend('Kesken', 'orange')}
            </View>
          </View>
          :
          <Text>Lisää kirja luetuksi lukulistalle nähdäksesi tulokset!</Text>
        }
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            marginTop: 16
          }}
          >
        Luetut kirjat per vuosi
        </Text>
        {
          (statsChart1.length > 0)
          ?
          <BarChart
            barWidth={24}
            noOfSections={maxHeightChart1 > 2 ? 3 : 1}
            barBorderRadius={2}
            disablePress={true}
            frontColor="blue"
            data={statsChart1}
            roundToDigits={0}
            yAxisThickness={1}
            xAxisThickness={1}
            maxValue={maxHeightChart1}
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
            marginTop: 16
          }}
          >
        Luetut kirjat tänä vuonna
        </Text>
        {
          (wasListUpdated.current == true)
          ?
          <BarChart
            barWidth={24}
            noOfSections={maxHeightChart2 > 2 ? 3 : 1}
            barBorderRadius={2}
            disablePress={true}
            frontColor="red"
            data={statsChart2}
            roundToDigits={0}
            yAxisThickness={1}
            xAxisThickness={1}
            maxValue={maxHeightChart2}
            isAnimated
          />
          :
          <Text>Et ole lukenut tänä vuonna kirjoja!</Text>
        }
        {
          /* SAVED FOR TESTING!
          <Button
            onPress={() => {
              const maxHeight = Math.max(...statsChart1.map((obj) => obj.value))
              setMaxHeightChart1(maxHeight)

              const maxHeight2 = Math.max(...statsChart2.map((obj) => obj.value))
              setMaxHeightChart2(maxHeight2)
              //statsChart1.forEach((item) => {
              //  console.log(item.value)
              //})
            }}
            >
            test
          </Button>
          <Button
            onPress={() => firebaseGetBookList()}
            >
            BookList
          </Button>
          */
        }

      </ScrollView>
    </PaperProvider>
  )
}

export default StatisticsScreen
