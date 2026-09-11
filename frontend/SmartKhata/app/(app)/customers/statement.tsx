import React from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCustomerStatement } from '../../../src/hooks/useTransactions';
import { StatementTransactionItem } from '../../../src/types/transaction';
import { formatINR } from '../../../src/utils/currency';
import { formatDateTime } from '../../../src/utils/date';
import { Loading } from '../../../src/components/common/Loading';
import { ErrorState } from '../../../src/components/common/ErrorState';
import { EmptyState } from '../../../src/components/common/EmptyState';

export default function CustomerStatementScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const customerId = Number(id);

  const { data: statement, isLoading, isError, refetch } =
    useCustomerStatement(customerId);

  if (isLoading) {
    return <Loading message="Generating customer statement..." />;
  }

  if (isError || !statement) {
    return (
      <ErrorState
        message="Failed to load customer statement."
        onRetry={refetch}
      />
    );
  }

  const renderStatementItem = ({ item }: { item: StatementTransactionItem }) => {
    const isCredit = item.type === 'CREDIT';

    return (
      <View style={styles.itemCard}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemDate}>{formatDateTime(item.transactionDate)}</Text>
          <Text style={[styles.typeBadge, isCredit ? styles.creditText : styles.paymentText]}>
            {item.type}
          </Text>
        </View>

        <Text style={styles.itemNote}>{item.note || 'Regular Transaction'}</Text>

        <View style={styles.itemFooter}>
          <Text style={styles.balanceLabel}>Running Balance:</Text>
          <Text style={styles.balanceVal}>{formatINR(item.runningBalance)}</Text>
          <Text style={[styles.itemAmount, isCredit ? styles.creditText : styles.paymentText]}>
            {isCredit ? '+' : '-'} {formatINR(item.amount)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Customer Statement</Text>
      </View>

      <FlatList
        data={statement.transactions || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderStatementItem}
        contentContainerStyle={styles.scrollContent}
        ListHeaderComponent={
          <View style={styles.statementCard}>
            <View style={styles.shopBranding}>
              <Ionicons name="wallet-outline" size={28} color="#2563eb" />
              <Text style={styles.brandTitle}>SmartKhata Statement</Text>
            </View>

            <View style={styles.divider} />

            <Text style={styles.custName}>{statement.customerName}</Text>
            <Text style={styles.custPhone}>Phone: {statement.phone}</Text>

            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Current Outstanding Balance</Text>
              <Text style={styles.summaryVal}>
                {formatINR(statement.outstandingBalance)}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            iconName="document-text-outline"
            title="No Statement Entries"
            description="There are no transaction records for this statement period."
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
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { marginRight: 12 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  scrollContent: { padding: 16 },
  statementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  shopBranding: { flexDirection: 'row', alignItems: 'center' },
  brandTitle: { fontSize: 18, fontWeight: '800', color: '#2563eb', marginLeft: 8 },
  divider: { height: 1, backgroundColor: '#f1f5f9', marginVertical: 12 },
  custName: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  custPhone: { fontSize: 13, color: '#64748b', marginTop: 2 },
  summaryBox: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    alignItems: 'center',
  },
  summaryLabel: { fontSize: 12, color: '#1e40af', fontWeight: '600' },
  summaryVal: { fontSize: 24, fontWeight: '800', color: '#1d4ed8', marginTop: 2 },
  itemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  itemDate: { fontSize: 12, color: '#94a3b8' },
  typeBadge: { fontSize: 11, fontWeight: '800' },
  creditText: { color: '#ef4444' },
  paymentText: { color: '#10b981' },
  itemNote: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  itemFooter: { flexDirection: 'row', alignItems: 'center' },
  balanceLabel: { fontSize: 11, color: '#64748b' },
  balanceVal: { fontSize: 12, fontWeight: '700', color: '#334155', marginLeft: 4, flex: 1 },
  itemAmount: { fontSize: 16, fontWeight: '800' },
});
