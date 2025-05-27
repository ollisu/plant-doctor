import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';


const DiagnosesScreen = () => {
    const [diagnoses, setDiagnoses] = useState([{diagnosis: 'Fungal Infection', location: {lat: 37.7749, lng: -122.4194}}]);
    const [filter, setFilter] = useState('');

    const filtered = diagnoses.filter(d => d.diagnosis.toLowerCase().includes(filter.toLowerCase()));

    return(
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Filter by disease"
                value={filter}
                onChangeText={setFilter}
            />
            <FlatList
                data={filtered}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{item.diagnosis}</Text>
                        <Text style={styles.coords}>Lat: {item.location.lat}, Lng: {item.location.lng}</Text>
                    </View>
                )}
            />

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