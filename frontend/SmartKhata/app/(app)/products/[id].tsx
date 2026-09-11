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
import { useProductDetail, useProducts } from '../../../src/hooks/useProducts';
import { formatINR } from '../../../src/utils/currency';
import { Loading } from '../../../src/components/common/Loading';
import { ErrorState } from '../../../src/components/common/ErrorState';
import { Button } from '../../../src/components/common/Button';
import { ConfirmDialog } from '../../../src/components/common/ConfirmDialog';

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = Number(id);

  const { data: product, isLoading, isError, refetch } = useProductDetail(productId);
  const { deleteProduct, isDeleting } = useProducts();
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteProduct(productId);
      setDeleteConfirmVisible(false);
      Alert.alert('Product Deleted', 'Product removed from inventory.', [
        { text: 'OK', onPress: () => router.replace('/(app)/products') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to delete product');
    }
  };

  if (isLoading) {
    return <Loading message="Loading product details..." />;
  }

  if (isError || !product) {
    return <ErrorState message="Failed to load product details." onRetry={refetch} />;
  }

  const isLowStock = product.stock <= (product.minimumStock ?? 10);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Product Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="cube" size={40} color="#2563eb" />
          </View>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.priceTag}>{formatINR(product.price)} per unit</Text>

          <View style={styles.infoGrid}>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Current Stock</Text>
              <Text style={[styles.gridVal, isLowStock ? { color: '#dc2626' } : null]}>
                {product.stock} units
              </Text>
            </View>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>Stock Status</Text>
              <Text
                style={[
                  styles.statusBadge,
                  isLowStock ? styles.lowStockText : styles.inStockText,
                ]}
              >
                {isLowStock ? 'Low Stock Warning' : 'In Stock'}
              </Text>
            </View>
          </View>

          <Button
            title="Delete Product"
            variant="danger"
            onPress={() => setDeleteConfirmVisible(true)}
            iconName="trash-outline"
            style={styles.deleteBtn}
          />
        </View>
      </ScrollView>

      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete Product"
        message={`Are you sure you want to delete ${product.name}?`}
        confirmText="Delete Product"
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
  iconCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#eff6ff', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  productName: { fontSize: 22, fontWeight: '800', color: '#0f172a', textAlign: 'center' },
  priceTag: { fontSize: 18, fontWeight: '700', color: '#059669', marginTop: 4, marginBottom: 20 },
  infoGrid: { flexDirection: 'row', gap: 12, width: '100%', marginBottom: 24 },
  gridBox: { flex: 1, backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  gridLabel: { fontSize: 12, color: '#64748b' },
  gridVal: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginTop: 4 },
  statusBadge: { fontSize: 13, fontWeight: '700', marginTop: 4 },
  lowStockText: { color: '#dc2626' },
  inStockText: { color: '#059669' },
  deleteBtn: { width: '100%' },
});
