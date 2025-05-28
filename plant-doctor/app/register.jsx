import { useState } from "react";
import { useRouter } from "expo-router";
import { StyleSheet, View, TextInput, Button, Alert, Text } from "react-native";
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
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
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
            />
            <Button title="Create Account" onPress={handleRegister} color="#4caf50" />

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
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
});

export default RegisterScreen;