import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View, Pressable, TouchableOpacity, Alert } from 'react-native';
import { db } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

const DiagnosesScreen = () => {
    const [diagnoses, setDiagnoses] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchDiagnoses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'diagnoses'));
                const data = querySnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
                setDiagnoses(data);
            } catch (error) {
                console.error('Error fetching diagnoses:', error);
            }finally {
                setLoading(false);
            }
        };

        fetchDiagnoses();
    }, []);

    const handleDelete = (id, diagnosisLabel) => {
        Alert.alert(
        'Confirm Delete',
        `Are you sure you want to delete "${diagnosisLabel}"?`,
        [
            { text: 'Cancel', style: 'cancel' },
            {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
                try {
                await deleteDoc(doc(db, 'diagnoses', id));
                setDiagnoses(prev => prev.filter(item => item.id !== id));
                } catch (error) {
                console.error('Error deleting diagnosis:', error);
                Alert.alert('Delete failed', 'Could not delete diagnosis.');
                }
            }
            }
        ]
        );
    };


    const filtered = diagnoses.filter(d => d.diagnosis.toLowerCase().includes(filter.toLowerCase()));

    return(
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Filter by disease"
                value={filter}
                onChangeText={setFilter}
            />
            {loading ? (
                <ActivityIndicator size="large" color="#4caf50" />
            ) : (
            <FlatList
                data={filtered}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.item}
                        onPress={() =>
                            router.push({
                            pathname: '/map',
                            params: {
                                diagnosisLocation: JSON.stringify(item.location),
                            },
                            })
                        }
                        >
                        <Text>{`Diagnosis: ${item.diagnosis}`}</Text>
                        <Text>{`Result confidence: ${(item.confidence * 100).toFixed(2)}%`}</Text>
                        <Text>{`Note: ${item.note}`}</Text>
                        <Text style={{ color: '#4caf50' }}>
                            {item.createdAt?.toDate().toLocaleString()}
                        </Text>
                        <TouchableOpacity
                            onPress={() => handleDelete(item.id, item.diagnosis)}
                            style={styles.trashIcon}
                            >
                                <MaterialIcons name="delete" size={24} color="red" />
                        </TouchableOpacity>
                    </Pressable>
                )}
            />)}

        </View>
    );


}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f1f8e9' },
  input: { backgroundColor: 'white', padding: 10, marginBottom: 10, borderRadius: 8 },
  item: { backgroundColor: '#e0f2f1', padding: 10, marginBottom: 10, borderRadius: 8 },
  coords: { color: '#4caf50' },
});

export default DiagnosesScreen;