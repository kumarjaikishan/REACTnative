import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setlogin } from '../store/login';
import { userlogout } from '../store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Logout = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await AsyncStorage.removeItem('jwtToken'); 
                dispatch(userlogout());
                dispatch(setlogin(false));
                navigation.navigate('Login');
            } catch (error) {
                console.error('Error clearing AsyncStorage:', error);
            }
        };

        performLogout();
    }, []);

    return (
        <View>
            <Text>Logging out...</Text>
        </View>
    );
};

export default Logout;
