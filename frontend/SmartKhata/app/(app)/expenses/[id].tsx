import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useExpenseDetail, useExpenses } from '../../../src/hooks/useExpenses';
import { formatINR } from '../../../src/utils/currency';
import { formatDate } from '../../../src/utils/date';
import { Loading } from '../../../src/components/common/Loading';
import { ErrorState } from '../../../src/components/common/ErrorState';
import { Button } from '../../../src/components/common/Button';
import { ConfirmDialog } from '../../../src/components/common/ConfirmDialog';

export default function ExpenseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const expenseId = Number(id);

  const { data: expense, isLoading, isError, refetch } = useExpenseDetail(expenseId);
  const { deleteExpense, isDeleting } = useExpenses();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteExpense(expenseId);
      setDeleteConfirmVisible(false);
      Alert.alert('Expense Deleted', 'Expense record removed.', [
        { text: 'OK', onPress: () => router.replace('/(app)/expenses') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to delete expense');
    }
  };

  if (isLoading) {
    return <Loading message="Loading expense details..." />;
  }

  if (isError || !expense) {
    return <ErrorState message="Failed to load expense details." onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Expense #{expense.id}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{expense.category}</Text>
          </View>

          <Text style={styles.amount}>{formatINR(expense.amount)}</Text>
          <Text style={styles.date}>{formatDate(expense.expenseDate)}</Text>

          <View style={styles.descBox}>
            <Text style={styles.descLabel}>Note / Description:</Text>
            <Text style={styles.descVal}>
              {expense.description || 'No description provided.'}
            </Text>
          </View>

          <Button
            title="Delete Expense Record"
            variant="danger"
            onPress={() => setDeleteConfirmVisible(true)}
            iconName="trash-outline"
            style={styles.deleteBtn}
          />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete Expense"
        message="Are you sure you want to delete this expense record?"
        confirmText="Delete Record"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { marginRight: 12 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  content: { padding: 20 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  badge: { backgroundColor: '#fef2f2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 12 },
  badgeText: { fontSize: 13, fontWeight: '800', color: '#b91c1c' },
  amount: { fontSize: 32, fontWeight: '800', color: '#b91c1c', marginBottom: 4 },
  date: { fontSize: 13, color: '#64748b', marginBottom: 20 },
  descBox: { backgroundColor: '#f8fafc', padding: 16, borderRadius: 12, width: '100%', marginBottom: 24, borderWidth: 1, borderColor: '#e2e8f0' },
  descLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  descVal: { fontSize: 15, fontWeight: '600', color: '#0f172a', marginTop: 4 },
  deleteBtn: { width: '100%' },
});
