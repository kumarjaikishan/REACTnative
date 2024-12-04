import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Alert, TouchableOpacity, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Signup() {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cpassword, setCpassword] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation();

    const handleLogin = () => {
        if (!email || !password) {
            setError('Please enter both email and password');
        } else {
            setError('');
            // Handle the login logic here (e.g., call an API to authenticate)
            Alert.alert('Login Success', `Logged in with:\nEmail: ${email}\nPassword: ${password}`);
        }
    };

    return (
        <ImageBackground
            source={require('@/assets/images/login/bg.jpg')}
            style={styles.container}
            resizeMode="cover" // This makes sure the image covers the background
        >
            <View style={styles.overlay}>
                <Text style={styles.header}>Signup</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Enter your Name"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Mobile"
                    value={mobile}
                    onChangeText={setMobile}
                    keyboardType="phone-pad"
                    maxLength={10}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Enter your Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <TextInput
                    style={styles.input}
                    placeholder="Enter your Confirm Password"
                    value={cpassword}
                    onChangeText={setCpassword}
                />

                {error ? <Text style={styles.error}>{error}</Text> : null}

                <Button title="Signup" onPress={handleLogin} />

                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>
                        Already have an Account?
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ color: '#0984e3', fontSize: 18, marginLeft: 5 }}>Login</Text>
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
        height: 'fit-content',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 30,
        backgroundColor: 'white',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});
