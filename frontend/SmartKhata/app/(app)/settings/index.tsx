import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../../src/hooks/useAuth';
import { Button } from '../../../src/components/common/Button';

export default function SettingsScreen() {
  const { userEmail, logoutUser } = useAuth();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Account Information</Text>
        <Text style={styles.label}>Logged in as:</Text>
        <Text style={styles.value}>{userEmail || 'Shop Owner'}</Text>
      </View>

      <Button
        title="Logout Account"
        onPress={logoutUser}
        variant="danger"
        iconName="log-out-outline"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: '#0f172a', marginBottom: 12 },
  label: { fontSize: 13, color: '#64748b' },
  value: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginTop: 2 },
});
