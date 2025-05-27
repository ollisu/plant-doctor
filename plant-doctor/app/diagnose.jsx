import * as imagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';


const DiagnosesScreen = () => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [note, setNote] = useState('');

    const pickImage = async (useCamera = false) => {
        let permission = useCamera
            ? await imagePicker.requestCameraPermissionsAsync()
            : await imagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert('Permission to access camera or library is required!');
            return;
        }

        let result = useCamera
            ? await imagePicker.launchCameraAsync({ base64: false })
            : await imagePicker.launchImageLibraryAsync({ base64: false });
        
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            setResult(null);
        }
    }

    return (
        <View style={styles.container}>
            <Button title="Pick from Gallery" onPress={() => pickImage(false)} color="#66bb6a" />
            <View style={{ margin: 10 }} />
            <Button title="Take a Photo" onPress={() => pickImage(true)} color="#81c784" />
            <View style={{ margin: 20 }} />

        </View>
    )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f8e9', padding: 20 },
  image: { width: 300, height: 300, resizeMode: 'contain', marginVertical: 20 },
  result: { marginTop: 20, backgroundColor: '#fff', padding: 10, borderRadius: 8, color: '#1b5e20' },
  input: { backgroundColor: 'white', padding: 10, marginTop: 10, width: '100%', borderRadius: 8 },
});

export default DiagnosesScreen;