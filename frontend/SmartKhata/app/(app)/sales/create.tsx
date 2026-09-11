import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCustomers } from '../../../src/hooks/useCustomers';
import { useProducts } from '../../../src/hooks/useProducts';
import { useSales } from '../../../src/hooks/useSales';
import { CustomerResponse } from '../../../src/types/customer';
import { ProductResponse } from '../../../src/types/product';
import { PaymentType, SaleItemRequest } from '../../../src/types/sale';
import { formatINR } from '../../../src/utils/currency';
import { Button } from '../../../src/components/common/Button';

interface CartItem extends SaleItemRequest {
  productName: string;
  unitPrice: number;
  lineTotal: number;
}

export default function CreateSaleScreen() {
  const router = useRouter();
  const { data: customers } = useCustomers();
  const { data: products } = useProducts();
  const { createSale, isCreating } = useSales();

  const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null);
  const [paymentType, setPaymentType] = useState<PaymentType>('CASH');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Modals
  const [customerModalVisible, setCustomerModalVisible] = useState(false);
  const [productModalVisible, setProductModalVisible] = useState(false);

  const totalAmount = cartItems.reduce((acc, item) => acc + item.lineTotal, 0);

  const addProductToCart = (product: ProductResponse) => {
    const existingIndex = cartItems.findIndex((item) => item.productId === product.id);

    if (existingIndex > -1) {
      const updated = [...cartItems];
      const newQty = updated[existingIndex].quantity + 1;
      updated[existingIndex].quantity = newQty;
      updated[existingIndex].lineTotal = newQty * product.price;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: product.id,
          productName: product.name,
          unitPrice: product.price,
          quantity: 1,
          lineTotal: product.price,
        },
      ]);
    }
    setProductModalVisible(false);
  };

  const updateQuantity = (productId: number, delta: number) => {
    const updated = cartItems
      .map((item) => {
        if (item.productId === productId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            lineTotal: newQty * item.unitPrice,
          };
        }
        return item;
      })
      .filter((item): item is CartItem => item !== null);

    setCartItems(updated);
  };

  const handleSubmitSale = async () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Sale', 'Please add at least one product to the sale.');
      return;
    }

    if (paymentType === 'CREDIT' && !selectedCustomer) {
      Alert.alert('Customer Required', 'Credit sales require selecting a customer.');
      return;
    }

    try {
      await createSale({
        customerId: selectedCustomer ? selectedCustomer.id : null,
        paymentType,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      Alert.alert('Sale Recorded', 'Sale completed successfully.', [
        { text: 'OK', onPress: () => router.replace('/(app)/sales') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit sale');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Create New Sale</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Customer Selector Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Select Customer (Optional for Cash)</Text>
          <TouchableOpacity
            style={styles.selectorBtn}
            onPress={() => setCustomerModalVisible(true)}
          >
            <Ionicons name="person-outline" size={20} color="#2563eb" />
            <Text style={styles.selectorText}>
              {selectedCustomer ? selectedCustomer.name : 'Walk-in / Cash Customer'}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#94a3b8" />
          </TouchableOpacity>
        </View>

        {/* Products Cart Section */}
        <View style={styles.card}>
          <View style={styles.cartHeader}>
            <Text style={styles.cardTitle}>Bill Items ({cartItems.length})</Text>
            <TouchableOpacity
              style={styles.addItemBtn}
              onPress={() => setProductModalVisible(true)}
            >
              <Ionicons name="add-circle" size={18} color="#2563eb" />
              <Text style={styles.addItemBtnText}>+ Add Item</Text>
            </TouchableOpacity>
          </View>

          {cartItems.length === 0 ? (
            <Text style={styles.emptyText}>No product items added to bill yet.</Text>
          ) : (
            cartItems.map((item) => (
              <View key={item.productId} style={styles.cartRow}>
                <View style={styles.cartInfo}>
                  <Text style={styles.cartItemName}>{item.productName}</Text>
                  <Text style={styles.cartItemPrice}>
                    {formatINR(item.unitPrice)} x {item.quantity}
                  </Text>
                </View>

                <View style={styles.qtyControls}>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.productId, -1)}
                  >
                    <Ionicons name="remove" size={16} color="#0f172a" />
                  </TouchableOpacity>
                  <Text style={styles.qtyVal}>{item.quantity}</Text>
                  <TouchableOpacity
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.productId, 1)}
                  >
                    <Ionicons name="add" size={16} color="#0f172a" />
                  </TouchableOpacity>
                </View>

                <Text style={styles.lineTotal}>{formatINR(item.lineTotal)}</Text>
              </View>
            ))
          )}
        </View>

        {/* Payment Mode Picker */}
        <View style={styles.card}>
          <Text style={styles.label}>Payment Type</Text>
          <View style={styles.paymentGrid}>
            {(['CASH', 'CREDIT', 'UPI', 'CARD'] as PaymentType[]).map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.paymentOption,
                  paymentType === type ? styles.paymentSelected : null,
                ]}
                onPress={() => setPaymentType(type)}
              >
                <Text
                  style={[
                    styles.paymentOptionText,
                    paymentType === type ? styles.paymentSelectedText : null,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Sale Amount:</Text>
            <Text style={styles.totalVal}>{formatINR(totalAmount)}</Text>
          </View>

          <Button
            title="Complete & Record Sale"
            onPress={handleSubmitSale}
            loading={isCreating}
            disabled={isCreating || cartItems.length === 0}
            iconName="checkmark-circle-outline"
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>

      {/* Select Customer Modal */}
      <Modal visible={customerModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Customer</Text>

            <TouchableOpacity
              style={styles.customerOption}
              onPress={() => {
                setSelectedCustomer(null);
                setCustomerModalVisible(false);
              }}
            >
              <Text style={styles.customerOptionText}>Walk-in / Cash Customer</Text>
            </TouchableOpacity>

            <FlatList
              data={customers || []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.customerOption}
                  onPress={() => {
                    setSelectedCustomer(item);
                    setCustomerModalVisible(false);
                  }}
                >
                  <Text style={styles.customerOptionName}>{item.name}</Text>
                  <Text style={styles.customerOptionPhone}>{item.phone}</Text>
                </TouchableOpacity>
              )}
            />

            <Button
              title="Close"
              variant="secondary"
              onPress={() => setCustomerModalVisible(false)}
            />
          </View>
        </View>
      </Modal>

      {/* Add Product Modal */}
      <Modal visible={productModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalHeader}>Select Inventory Product</Text>

            <FlatList
              data={products || []}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productOption}
                  onPress={() => addProductToCart(item)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.productOptionName}>{item.name}</Text>
                    <Text style={styles.productOptionStock}>
                      Stock: {item.stock} units available
                    </Text>
                  </View>
                  <Text style={styles.productOptionPrice}>
                    {formatINR(item.price)}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <Button
              title="Close"
              variant="secondary"
              onPress={() => setProductModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  backBtn: { marginRight: 12 },
  title: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  content: { padding: 16, gap: 12 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  selectorBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', padding: 12, borderRadius: 10 },
  selectorText: { flex: 1, marginLeft: 8, fontSize: 15, fontWeight: '600', color: '#0f172a' },
  cartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  addItemBtn: { flexDirection: 'row', alignItems: 'center' },
  addItemBtnText: { fontSize: 14, fontWeight: '700', color: '#2563eb', marginLeft: 4 },
  emptyText: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic', marginVertical: 12 },
  cartRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  cartInfo: { flex: 1 },
  cartItemName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  cartItemPrice: { fontSize: 12, color: '#64748b', marginTop: 2 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderRadius: 8, paddingHorizontal: 4, marginRight: 12 },
  qtyBtn: { padding: 6 },
  qtyVal: { fontSize: 14, fontWeight: '700', marginHorizontal: 8 },
  lineTotal: { fontSize: 15, fontWeight: '800', color: '#059669', minWidth: 60, textAlign: 'right' },
  paymentGrid: { flexDirection: 'row', gap: 8 },
  paymentOption: { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: '#f1f5f9', alignItems: 'center', borderWidth: 1, borderColor: '#cbd5e1' },
  paymentSelected: { backgroundColor: '#2563eb', borderColor: '#2563eb' },
  paymentOptionText: { fontSize: 13, fontWeight: '700', color: '#334155' },
  paymentSelectedText: { color: '#ffffff' },
  summaryCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#bfdbfe', marginTop: 8 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  totalLabel: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
  totalVal: { fontSize: 24, fontWeight: '800', color: '#2563eb' },
  submitBtn: {},
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#ffffff', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, maxHeight: '80%' },
  modalHeader: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginBottom: 16 },
  customerOption: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  customerOptionText: { fontSize: 15, fontWeight: '600', color: '#2563eb' },
  customerOptionName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  customerOptionPhone: { fontSize: 12, color: '#64748b' },
  productOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  productOptionName: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
  productOptionStock: { fontSize: 12, color: '#64748b' },
  productOptionPrice: { fontSize: 16, fontWeight: '800', color: '#059669' },
});
