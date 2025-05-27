import { Text, View, Button, StyleSheet, Animated, useAnimatedValue } from "react-native";
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';

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
  
  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <Text style={styles.title}>🌿 Welcome to PlantDoc 🌿</Text>
      <Text style={styles.subtitle}>Identify plant diseases and track your diagnoses</Text>
      <View style={{ margin: 20 }} />
      <View style={{ margin: 10 }} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f5e9', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#1b5e20', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', color: '#4caf50' },
  
});

export default HomeScreen;
