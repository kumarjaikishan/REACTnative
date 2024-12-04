import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const Splash = () => {

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <LottieView
                source={require('../assets/splash.json')}
                style={{ width: '100%', height: '100%' }}
                autoPlay
                loop={false}
            />
        </View>
    )
}

export default Splash