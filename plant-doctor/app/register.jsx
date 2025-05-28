import { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, TextInput, Button, Alert, Text, KeyboardAvoidingView, Platform } from "react-native";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Account created!');
            router.replace('/');
        } 
        catch (error) {
            Alert.alert('Registration Error', error.message);
        }
    };

    return (
        <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: '#f1f8e9' }} 
        >
            <View style={styles.container}>
                <Text style={styles.title}>🌿 Register 🌿</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    secureTextEntry={true}
                />
                <Button title="Create Account" onPress={handleRegister} color="#4caf50" />

            </View>
        </KeyboardAvoidingView>
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

export default RegisterScreen;