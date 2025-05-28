import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Animated, Button, StyleSheet, Text, useAnimatedValue, View, } from "react-native";
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';


const HomeScreen = () => {
  const fadeAnim = useAnimatedValue(0);
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>🌿 Welcome to PlantDoc 🌿</Text>
      <Text style={styles.subtitle}>Identify plant diseases and track your diagnoses</Text>
      <View style={{ margin: 20 }} />
      <Button title="Diagnose a Plant" onPress={() => router.push('/diagnose')} color="#66bb6a" />
      <View style={{ margin: 10 }} />
      <Button title="Go to Diagnoses List" onPress={() => router.push('/diagnoses')} color="#4caf50" />
      <View style={{ margin: 30 }} />
      <Button title="Logout" onPress={handleLogout} color="#4caf50" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f5e9', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1b5e20', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#4caf50' },
  
});

export default HomeScreen;
