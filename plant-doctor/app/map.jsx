import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, View, Alert, Text, Modal, Pressable } from 'react-native';
import MapView, {Marker, Callout} from 'react-native-maps';
import { db } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';


const MapScreen = () => {
    const [region, setRegion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [diagnoses, setDiagnoses] = useState([]);
    const [selectedDiagnosis, setSelectedDiagnosis] = useState(null);
    const { diagnosisLocation } = useLocalSearchParams();

    const DEFAULT_REGION = {
        latitude: 61.4978,       // Tampere, Finland
        longitude: 23.7610,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };

    const getLocation = async () => {
    setLoading(true); // start spinner
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Location permission denied', 'Showing default location: Tampere, Finland.');
        setRegion(DEFAULT_REGION);
      } else {
        const location = await Location.getCurrentPositionAsync({});
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Failed to get location. Showing default.');
      setRegion(DEFAULT_REGION);
    } finally {
      setLoading(false);
    }
  };

  const fetchDiagnoses = async () => {
    try {
        const querySnapshot = await getDocs(collection(db, 'diagnoses'));
        const data = querySnapshot.docs.map(doc => doc.data());
        setDiagnoses(data);
    } catch (error) {
        console.error('Error fetching diagnoses:', error);
    }}


    useEffect(() => {
        getLocation();
        fetchDiagnoses();
    }, []);

    // To view a single diagnosis location passed from another screen
    useEffect(() => {
      if (diagnosisLocation) {
        try {
          const location = JSON.parse(diagnosisLocation);
          if (location?.latitude && location?.longitude) {
            setRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            return;
          }
        } catch (error) {
          console.warn('Failed to parse diagnosisLocation:', error);
        }
      }

      // Default region fallback
      setRegion(DEFAULT_REGION);
    }, [diagnosisLocation]);

      return (
        <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size="large" color="#007AFF" style={styles.spinner} />
          ) : (
            <>
              <MapView
                style={styles.map}
                region={region}
                showsUserLocation={true}
              >
                {diagnoses.map((diag, index) => (
                  <Marker
                    key={index}
                    coordinate={{
                      latitude: diag.location?.latitude,
                      longitude: diag.location?.longitude,
                    }}
                    onPress={() => setSelectedDiagnosis(diag)}
                  />
                ))}
              </MapView>

              <View style={styles.buttonContainer}>
                <Button title="Refresh Location" onPress={getLocation} color="#007AFF" />
              </View>

              {/* Diagnosis info modal */}
              <DiagnosisModal
                visible={!!selectedDiagnosis}
                diagnosis={selectedDiagnosis}
                onClose={() => setSelectedDiagnosis(null)}
              />
            </>
          )}
        </View>
      );
};

  const DiagnosisModal = ({ visible, diagnosis, onClose }) => {
    if (!diagnosis) return null;
    

    return (
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{diagnosis.diagnosis}</Text>
            <Text style={styles.modalNote}>{diagnosis.note}</Text>
            <Text style={styles.modalConfidence}>
              Confidence: {(diagnosis.confidence * 100).toFixed(2)}%
            </Text>
            <Text style={styles.modalTimestamp}>Created: {diagnosis.createdAt?.toDate().toLocaleString()}</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };


const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalNote: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalConfidence: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalTimestamp: {
  fontSize: 12,
  color: '#888',
  marginTop: 5,
  marginBottom: 20,
},
});

export default MapScreen;