import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCustomers } from '../../../src/hooks/useCustomers';
import { CustomerResponse } from '../../../src/types/customer';
import { formatINR } from '../../../src/utils/currency';
import { Loading } from '../../../src/components/common/Loading';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { ErrorState } from '../../../src/components/common/ErrorState';

export default function CustomersScreen() {
  const router = useRouter();
  const { data: customers, isLoading, isError, error, refetch } = useCustomers();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredCustomers = (customers || []).filter((customer) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.includes(query)
    );
  });

  const renderCustomerItem = ({ item }: { item: CustomerResponse }) => {
    const outstanding = item.outstandingAmount ?? 0;
    const isDebit = outstanding > 0;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push(`/(app)/customers/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.name ? item.name.charAt(0).toUpperCase() : 'C'}
          </Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phone}</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amountText,
              isDebit ? styles.debitText : styles.creditText,
            ]}
          >
            {formatINR(outstanding)}
          </Text>
          <Text style={styles.limitText}>
            Limit: {formatINR(item.creditLimit)}
          </Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
      </TouchableOpacity>
    );
  };

  if (isLoading && !refreshing) {
    return <Loading message="Loading customer directory..." />;
  }

  if (isError) {
    return <ErrorState message={(error as Error)?.message} onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#64748b" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer name or phone..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(app)/customers/add')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Customers List */}
      <FlatList
        data={filteredCustomers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCustomerItem}
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
            iconName="people-outline"
            title="No Customers Found"
            description={
              searchQuery
                ? 'No matching customer records found.'
                : 'Add your first customer to start tracking udhar and payments.'
            }
            actionTitle="+ Add New Customer"
            onAction={() => router.push('/(app)/customers/add')}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
    marginLeft: 8,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1d4ed8',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  phone: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginRight: 8,
  },
  amountText: {
    fontSize: 15,
    fontWeight: '800',
  },
  debitText: {
    color: '#ef4444',
  },
  creditText: {
    color: '#10b981',
  },
  limitText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
});
