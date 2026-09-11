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
import { useSales } from '../../../src/hooks/useSales';
import { SaleResponse } from '../../../src/types/sale';
import { formatINR } from '../../../src/utils/currency';
import { formatDateTime } from '../../../src/utils/date';
import { Loading } from '../../../src/components/common/Loading';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { ErrorState } from '../../../src/components/common/ErrorState';

export default function SalesScreen() {
  const router = useRouter();
  const { data: sales, isLoading, isError, error, refetch } = useSales();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderSaleItem = ({ item }: { item: SaleResponse }) => {
    const isCancelled = item.status === 'CANCELLED';

    return (
      <TouchableOpacity
        style={[styles.card, isCancelled ? styles.cancelledCard : null]}
        onPress={() => router.push(`/(app)/sales/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.customerName}>
            {item.customerName || 'Counter Sale / Walk-in'}
          </Text>
          <View
            style={[
              styles.paymentBadge,
              item.paymentType === 'CASH'
                ? styles.cashBadge
                : item.paymentType === 'CREDIT'
                ? styles.creditBadge
                : styles.upiBadge,
            ]}
          >
            <Text style={styles.paymentText}>{item.paymentType}</Text>
          </View>
        </View>

        <Text style={styles.dateText}>{formatDateTime(item.saleDate)}</Text>

        <View style={styles.cardFooter}>
          <Text style={styles.itemsCount}>
            {item.items?.length || 0} product items
          </Text>

          {isCancelled ? (
            <Text style={styles.cancelledText}>CANCELLED</Text>
          ) : (
            <Text style={styles.amountText}>{formatINR(item.totalAmount)}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && !refreshing) {
    return <Loading message="Loading sales records..." />;
  }

  if (isError) {
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Sales Register</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push('/(app)/sales/create')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={20} color="#ffffff" />
          <Text style={styles.createBtnText}>New Sale</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sales || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderSaleItem}
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
            iconName="cart-outline"
            title="No Sales Recorded Yet"
            description="Record cash, credit, or UPI sales for your shop items."
            actionTitle="+ Create New Sale"
            onAction={() => router.push('/(app)/sales/create')}
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createBtnText: { fontSize: 14, fontWeight: '700', color: '#ffffff', marginLeft: 4 },
  listContent: { padding: 16, gap: 10 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelledCard: { opacity: 0.6, backgroundColor: '#f1f5f9' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  customerName: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  paymentBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  cashBadge: { backgroundColor: '#dcfce7' },
  creditBadge: { backgroundColor: '#fee2e2' },
  upiBadge: { backgroundColor: '#dbeafe' },
  paymentText: { fontSize: 11, fontWeight: '800', color: '#1e293b' },
  dateText: { fontSize: 12, color: '#64748b', marginTop: 4 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  itemsCount: { fontSize: 13, color: '#475569' },
  amountText: { fontSize: 18, fontWeight: '800', color: '#15803d' },
  cancelledText: { fontSize: 14, fontWeight: '800', color: '#ef4444' },
});
