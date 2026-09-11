import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useExpenses } from '../../../src/hooks/useExpenses';
import { ExpenseResponse } from '../../../src/types/expense';
import { formatINR } from '../../../src/utils/currency';
import { formatDate } from '../../../src/utils/date';
import { Loading } from '../../../src/components/common/Loading';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { ErrorState } from '../../../src/components/common/ErrorState';

export default function ExpensesScreen() {
  const router = useRouter();
  const { data: expenses, isLoading, isError, error, refetch } = useExpenses();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderExpenseItem = ({ item }: { item: ExpenseResponse }) => {
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(app)/expenses/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.iconBox}>
          <Ionicons name="receipt-outline" size={22} color="#ef4444" />
        </View>

        <View style={styles.info}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.description} numberOfLines={1}>
            {item.description || 'No description provided'}
          </Text>
          <Text style={styles.dateText}>{formatDate(item.expenseDate)}</Text>
        </View>

        <Text style={styles.amountText}>{formatINR(item.amount)}</Text>
        <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
      </TouchableOpacity>
    );
  };

  if (isLoading && !refreshing) {
    return <Loading message="Loading shop expenses..." />;
  }

  if (isError) {
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Expense Tracker</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(app)/expenses/add')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.addBtnText}>Add Expense</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderExpenseItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
          />
        }
        ListEmptyComponent={
          <EmptyState
            iconName="wallet-outline"
            title="No Expenses Logged"
            description="Log rent, electricity, salary, or stock purchase costs."
            actionTitle="+ Add New Expense"
            onAction={() => router.push('/(app)/expenses/add')}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { marginRight: 12 },
  title: { flex: 1, fontSize: 18, fontWeight: '800', color: '#0f172a' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: { fontSize: 14, fontWeight: '700', color: '#ffffff', marginLeft: 4 },
  listContent: { padding: 16, gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  categoryBadge: {
    backgroundColor: '#f1f5f9',
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 4,
  },
  categoryText: { fontSize: 11, fontWeight: '800', color: '#475569' },
  description: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  dateText: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  amountText: { fontSize: 16, fontWeight: '800', color: '#b91c1c', marginRight: 8 },
});
