import axios from 'axios';
import { Buffer } from 'buffer';
import * as FileSystem from 'expo-file-system';
import * as imagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { ActivityIndicator, Alert, Button, Image, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '../firebaseConfig';




const DiagnosesScreen = () => {
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [note, setNote] = useState('');
    const [modalVisible, setModalVisible] = useState(false);


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

    const diagnose = async () => {

        const HUGGINGFACE_MODEL = process.env.EXPO_PUBLIC_HUGGINGFACE_MODEL
        const HUGGINGFACE_API_TOKEN = process.env.EXPO_PUBLIC_HUGGINGFACE_TOKEN
        try{
            setLoading(true);
            const result = {}

            const locPermission = await Location.requestForegroundPermissionsAsync();
            if (!locPermission.granted) throw new Error('Location permission is required for diagnosis.');
            const location = await Location.getCurrentPositionAsync({});
            
            // Image needed in binary format for the API.
            const imageBinary = await FileSystem.readAsStringAsync(image, { encoding: FileSystem.EncodingType.Base64 });
            const binaryBuffer = Buffer.from(imageBinary, 'base64');

            // Send the image for diagnosis.
            const response = await axios.post(
                'https://api-inference.huggingface.co/models/' + HUGGINGFACE_MODEL,
                binaryBuffer,
                {
                    headers: {
                        Authorization: `Bearer ${HUGGINGFACE_API_TOKEN}`,
                        'Content-Type': 'application/octet-stream',
                    },
                }       
            );

            result.diagnosis = response.data[0].label;
            result.confidence = response.data[0].score;
            result.location = {
                latitude: location.coords.latitude
                ,longitude: location.coords.longitude
            };

            if(note) {
                result.note = note;
            }else {
                result.note = 'No additional notes provided.';
            }

            setResult(result);
            setModalVisible(true);


        }catch (error) {
            Alert.alert(error.message);
            console.error('Error during diagnosis:', error);
        }finally {
            setLoading(false);
        }


    }

    const saveResult = async () => {
        if (!result) {
            Alert.alert('No result to save');
            return;
        }
        // Add a timestamp to the result UTC.
        const resultWithTimestamp = {
            ...result, createdAt: serverTimestamp(),      
        }   
        try {
            await addDoc(collection(db, 'diagnoses'), resultWithTimestamp);
            Alert.alert('Result saved successfully!');
        }
        catch (error) {
            console.error('Error saving result:', error);
            Alert.alert('Failed to save result');
        }
        finally {
            setModalVisible(false);
            setResult(null);
            setImage(null);
            setNote('');
        }
    }

    const cancelSave = () => {
        setModalVisible(false);
        setResult(null);
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, backgroundColor: '#f1f8e9' }} 
        >
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>

                    <Button title="Pick from Gallery" onPress={() => pickImage(false)} color="#66bb6a" />
                    <View style={{ margin: 10 }} />
                    <Button title="Take a Photo" onPress={() => pickImage(true)} color="#81c784" />
                    <View style={{ margin: 20 }} />
                    <TextInput
                        style={styles.input}
                        placeholder="Add a note (optional)"
                        value={note}
                        onChangeText={setNote}
                    />
                    <View style={{ margin: 20 }} />
                    {image && <Image source={{ uri: image }} style={styles.image} />}
                    <View style={{ margin: 10 }} />
                    {image && !loading && <Button title="Diagnose" onPress={diagnose} color="#4caf50" />}
                    {loading && (<View style={{ margin: 20 }}>
                        <Text style={{ color: '#4caf50' }}>{"Diagnosing...this might take a moment."}</Text>
                        <View style={{ margin: 10 }} />
                        <ActivityIndicator size="large" color="#4caf50" />
                        <View style={{ margin: 20 }} />
                    </View>)}
                </View>
            </ScrollView>
            <SaveResultModal
                visible={modalVisible}
                result={result}
                onSave={saveResult}
                onCancel={cancelSave}/>
        </KeyboardAvoidingView>
        
    )
}

const SaveResultModal = ({ visible, result, onSave, onCancel }) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {result ? (
          <>
            <Text style={styles.title}>Review Result</Text>
            <Text style={styles.resultText}>{result.diagnosis}</Text>
            <Text style={styles.resultText}>{`Result confidence: ${(result.confidence * 100).toFixed(2) + '%'}`}</Text>
            <Text style={styles.resultText}>{result.note}</Text>
            <Text style={styles.resultText}>
              {`Latitude: ${result.location.latitude}`}
            </Text>
            <Text style={styles.resultText}>
              {`Longitude: ${result.location.longitude}`}
            </Text>
            <View style={styles.buttonRow}>
              <Button title="Cancel" onPress={onCancel} color="#f44336" />
              <Button title="Save" onPress={onSave} color="#4caf50" />
            </View>
          </>
        ) : (
          <Text style={styles.resultText}>No result to display.</Text>
        )}
      </View>
    </View>
  </Modal>
);



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f8e9', padding: 20 },
  image: { width: 300, height: 300, resizeMode: 'contain', marginVertical: 20 },
  result: { marginTop: 20, backgroundColor: '#fff', padding: 10, borderRadius: 8, color: '#1b5e20' },
  input: { backgroundColor: 'white', padding: 10, marginTop: 10, width: '100%', borderRadius: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '80%', backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#1b5e20' },
  resultText: { fontSize: 16, marginBottom: 20, color: '#1b5e20' },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },

});

export default DiagnosesScreen;