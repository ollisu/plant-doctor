import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';

const MapScreen = () => {
    const [region, setRegion] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useEffect(() => {
        getLocation();
    }, []);

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
                />
                <View style={styles.buttonContainer}>
                    <Button title="Refresh Location" onPress={getLocation} color="#007AFF" />
                </View>
                </>
            )}
            </View>
        );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  spinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 5,
    elevation: 4,
  },
});

export default MapScreen;