import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { userdata } from './store/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setlogin } from './store/login';
import { TextInput } from 'react-native-paper'; 
import { createNotifications } from 'react-native-notificated';
import Toast from './Toast'

export default function Login() {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false); // State to track loading status

    const { useNotifications } = createNotifications();
    const { notify } = useNotifications();

    const dispatch = useDispatch();

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Please enter both email and password');
        } else {
            setError('');
            setLoading(true); // Show loading indicator when API call starts

            try {
                const res = await fetch(`https://backend-exp-man.vercel.app/api/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email, password
                    })
                });

                const data = await res.json();
                console.log(data);
                setLoading(false);
                dispatch(setlogin(true));
                if (res.ok) {
                    await AsyncStorage.setItem('jwtToken', data.token);
                    dispatch(setlogin(true));
                    dispatch(userdata());
                    // notify('success', {
                    //     params: {
                    //         title: 'Login Successfull',
                    //         description: `Welcome back, ${data.name}`,
                    //     },
                    // });
                    Toast('success',"Login Successfull",`Welcome back, ${data.name}` )
                    navigation.navigate('Layout');
                } else {
                    setError(data.message || 'Login failed. Please try again.');
                }
            } catch (error) {
                setLoading(false);
                console.warn(error);
            }
        }
    };

    return (
        <ImageBackground
            source={require('@/assets/images/login/bg.jpg')}
            style={styles.container}
            resizeMode="cover"
        >
            <View style={styles.overlay}>
                <Text style={styles.header}>Login</Text>

                {/* Use TextInput from react-native-paper for email */}
                <TextInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    // mode="outlined"
                    placeholder="Enter your Email"
                    style={styles.input}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    // mode="outlined"
                    placeholder="Enter Password"
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    right={
                        <TextInput.Icon
                            icon={showPassword ? 'eye-off' : 'eye'} // Icon changes based on password visibility
                            onPress={() => setShowPassword(!showPassword)} // Toggle password visibility
                        />
                    }
                />
                {error ? <Text style={styles.error}>{error}</Text> : null}

                <View style={{ alignSelf: 'flex-end', marginBottom: 30 }}>
                    <TouchableOpacity>
                        <Text style={{ color: 'white', fontSize: 18, marginLeft: 5 }}>Forget Password?</Text>
                    </TouchableOpacity>
                </View>

                {/* Display loading indicator while the API call is in progress */}
                {loading ? (
                    <ActivityIndicator size="large" color="#fff" />
                ) : (
                    <Button title="Login" onPress={handleLogin} />
                )}

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        Don't have an Account?
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={{ color: '#0984e3', fontSize: 18, marginLeft: 5 }}>Signup</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    overlay: {
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        marginBottom: 20, // Adjust margin between fields
        backgroundColor: 'white',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});
