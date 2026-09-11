import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LoadingProps {
  message?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  message = 'Restoring session...',
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="wallet" size={36} color="#2563eb" />
        </View>
        <Text style={styles.brand}>SmartKhata</Text>
        <Text style={styles.tagline}>Your Smart Digital Khata</Text>
        <ActivityIndicator
          size="large"
          color="#2563eb"
          style={styles.spinner}
        />
        <Text style={styles.message}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
    marginBottom: 32,
    fontWeight: '500',
  },
  spinner: {
    marginBottom: 12,
  },
  message: {
    fontSize: 13,
    color: '#cbd5e1',
    fontWeight: '500',
  },
});
