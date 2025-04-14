import { View, Text, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera, CameraView } from 'expo-camera'
import { Button } from 'react-native-paper'

const ISBNReaderScreen = ({navigation}) => {

    const [hasPermission, setHasPermission] = useState(null)
    const [scanned, setScanned] = useState(false)
    const [text, setText] = useState('')

    const askForCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync()
        setHasPermission(status === 'granted')
    }

    useEffect(() => {
        askForCameraPermission()
    }, [])


    const handleisbnCodeScanned = ({ data }) => {
        setScanned(true)
        setText(data)
        console.log("ISBN Data: " + data)
        
        navigation.navigate('Tabs', {screen: 'BookSearchPage', params: {search: data}})
    }

    if (hasPermission === null) {
        return (
            <View>
                <Text>Pyydetään lupaa käyttää kameraa</Text>
            </View>
        )
    }
    if (hasPermission === false) {
        return (
            <View>
                <Text>Ei lupaa käyttää kameraa</Text>
                <Button onPress={() => askForCameraPermission()}>Pyydä lupaa käyttää kameraa</Button>
            </View>
        )
    }

    return (
        <View style={{alignItems: "center"}}>
            <View>
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleisbnCodeScanned}
                    style={{ height: 400, width: 400 }}
                />
            </View>
            <View style={styles.container}>
            <Text>{text}</Text>
            
            {scanned && <Button onPress={() => setScanned(false)}>Skannaa uudelleen</Button>}
            
            <Text>Lue ISBN koodi kirjasi takaa</Text>
            <Image
            style={styles.image}
            source={require('../assets/ISBN_placeholder.png')}
            />
            </View>
            
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 10,
        alignItems: 'center',
    },
    image: {
        resizeMode: 'contain',
        maxWidth: 150,
        maxHeight: 100,
    }

})

export default ISBNReaderScreen