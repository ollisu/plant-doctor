import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { db } from '../firebaseConfig';

const DiagnosesScreen = () => {
    const [diagnoses, setDiagnoses] = useState([]);
    const [filter, setFilter] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiagnoses = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'diagnoses'));
                const data = querySnapshot.docs.map(doc => doc.data());
                setDiagnoses(data);
            } catch (error) {
                console.error('Error fetching diagnoses:', error);
            }finally {
                setLoading(false);
            }
        };

        fetchDiagnoses();
    }, []);


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
                    <View style={styles.item}>
                        <Text>{`Diagnosis: ${item.diagnosis}`}</Text>
                        <Text>{`Result confidence: ${(item.confidence * 100).toFixed(2) + '%'}`}</Text>
                        <Text>{`Note: ${item.note}`}</Text>
                        <Text style={{ color: '#4caf50' }}>{item.createdAt?.toDate().toLocaleString()}</Text>
                    </View>
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