import { View } from 'react-native';
import { Button, Menu, Divider, PaperProvider } from 'react-native-paper';
import React, { useState } from 'react'



//Menu currently not used

const Menu = () => {
    const [visible, setVisible] = useState(false)

    const openMenu = () => setVisible(true)
    const closeMenu = () => setVisible(false)

return(
    <PaperProvider>
        <View style={{padding:50}}>
            <Menu
                visible={visible}
                onDismiss={closeMenu}
                anchor={<Button onPress={openMenu}>Show Menu</Button>}>
                <Menu.Item onPress={() => {}} title="Item 1" />
                <Menu.Item onPress={() => {}} title="Item 2" />
            </Menu>
        </View>
    </PaperProvider>
    )
}
export default Menu