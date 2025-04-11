import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Camera, CameraView } from 'expo-camera'
import { Button } from 'react-native-paper'

const ISBNReaderScreen = ({navigation}) => {


    const [hasPermission, setHasPermission] = useState(null)
    const [scanned, setScanned] = useState(false)
    const [text, setText] = useState('not yet scanned')

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
        console.log("Data: " + data)
        navigation.popTo('BookSearchPage', {search: data})
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
        <View>
            <View>
                <CameraView
                    onBarcodeScanned={scanned ? undefined : handleisbnCodeScanned}
                    style={{ height: 400, width: 400 }}
                />
            </View>
            <Text>{text}</Text>

            {scanned && <Button onPress={() => setScanned(false)}>Skannaa uudelleen</Button>}
        </View>
    )
}

export default ISBNReaderScreen