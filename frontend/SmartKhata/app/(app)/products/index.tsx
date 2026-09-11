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
import { useProducts } from '../../../src/hooks/useProducts';
import { ProductResponse } from '../../../src/types/product';
import { formatINR } from '../../../src/utils/currency';
import { Loading } from '../../../src/components/common/Loading';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { ErrorState } from '../../../src/components/common/ErrorState';

export default function ProductsScreen() {
  const router = useRouter();
  const { data: products, isLoading, isError, error, refetch } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const filteredProducts = (products || []).filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const renderProductItem = ({ item }: { item: ProductResponse }) => {
    const minStock = item.minimumStock ?? 10;
    const isLowStock = item.stock <= minStock;

    return (
      <TouchableOpacity
        style={[styles.card, isLowStock ? styles.lowStockCard : null]}
        onPress={() => router.push(`/(app)/products/${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.iconBox}>
          <Ionicons
            name="cube-outline"
            size={24}
            color={isLowStock ? '#dc2626' : '#2563eb'}
          />
        </View>

        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.name}</Text>
            {isLowStock ? (
              <View style={styles.lowStockBadge}>
                <Ionicons name="warning" size={12} color="#dc2626" />
                <Text style={styles.lowStockText}>Low Stock</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.price}>{formatINR(item.price)} / unit</Text>
        </View>

        <View style={styles.stockContainer}>
          <Text
            style={[
              styles.stockValue,
              isLowStock ? styles.lowStockVal : styles.normalStockVal,
            ]}
          >
            {item.stock}
          </Text>
          <Text style={styles.stockLabel}>in stock</Text>
        </View>

        <Ionicons name="chevron-forward" size={18} color="#cbd5e1" />
      </TouchableOpacity>
    );
  };

  if (isLoading && !refreshing) {
    return <Loading message="Loading inventory products..." />;
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
            placeholder="Search products in inventory..."
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
          onPress={() => router.push('/(app)/products/add')}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Product List */}
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
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
            iconName="cube-outline"
            title="No Products Found"
            description={
              searchQuery
                ? 'No matching products in your inventory.'
                : 'Add your first product to start managing inventory and sales.'
            }
            actionTitle="+ Add New Product"
            onAction={() => router.push('/(app)/products/add')}
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
  searchInput: { flex: 1, fontSize: 14, color: '#0f172a', marginLeft: 8 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  lowStockCard: { borderColor: '#fca5a5', backgroundColor: '#fff5f5' },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  lowStockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fee2e2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 2,
  },
  lowStockText: { fontSize: 10, fontWeight: '800', color: '#dc2626' },
  price: { fontSize: 14, color: '#059669', fontWeight: '700', marginTop: 2 },
  stockContainer: { alignItems: 'flex-end', marginRight: 10 },
  stockValue: { fontSize: 18, fontWeight: '800' },
  normalStockVal: { color: '#0f172a' },
  lowStockVal: { color: '#dc2626' },
  stockLabel: { fontSize: 11, color: '#64748b' },
});
