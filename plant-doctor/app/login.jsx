import  { useState } from 'react'
import { useRouter } from 'expo-router';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { View, TextInput, Button, Text, StyleSheet, Alert } from 'react-native';


const LoginScreen = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, username, password);
            router.push('/');
        } catch (error) {
            Alert.alert('Login Failed', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <View style={{ margin: 10 }} />
            <Button title="Login" onPress={handleLogin} color="#4caf50" />
                        <View style={{ margin: 10 }} />
            <Button title="Sign in with Google" onPress={() => console.log('navigate to google')} color="#4caf50" />
            <View style={{ margin: 10 }} />
            <Text style={styles.registerText} onPress={() => router.push('/register')}>
                'Don't have an account? Register here!'
            </Text>
        </View>

    );

}    

const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f1f8e9',
            padding: 20,
        },
        title: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            color: '#1b5e20',
        },
        input: {
            width: '100%',
            padding: 10,
            marginBottom: 15,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            backgroundColor: '#fff',
        },
        registerText: {
            marginTop: 15,
            color: '#4caf50',
        },
    });   

    export default LoginScreen;