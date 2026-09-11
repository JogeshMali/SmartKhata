import React, { useState } from 'react';
import {
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSaleDetail, useSales } from '../../../src/hooks/useSales';
import { formatINR } from '../../../src/utils/currency';
import { formatDateTime } from '../../../src/utils/date';
import { Loading } from '../../../src/components/common/Loading';
import { ErrorState } from '../../../src/components/common/ErrorState';
import { Input } from '../../../src/components/common/Input';
import { Button } from '../../../src/components/common/Button';

export default function SaleDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const saleId = Number(id);

  const { data: sale, isLoading, isError, refetch } = useSaleDetail(saleId);
  const { cancelSale, isCancelling } = useSales();

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [reasonInput, setReasonInput] = useState('');
  const [reasonError, setReasonError] = useState<string | null>(null);

  const handleCancelSale = async () => {
    if (!reasonInput.trim()) {
      setReasonError('Please provide a reason for cancelling this sale.');
      return;
    }
    setReasonError(null);
    try {
      await cancelSale({ saleId, reason: reasonInput.trim() });
      setCancelModalVisible(false);
      Alert.alert('Sale Cancelled', 'The sale has been marked as cancelled.', [
        { text: 'OK', onPress: () => router.replace('/(app)/sales') },
      ]);
    } catch (err: any) {
      setReasonError(err.message || 'Failed to cancel sale.');
    }
  };

  if (isLoading) {
    return <Loading message="Loading sale receipt details..." />;
  }

  if (isError || !sale) {
    return <ErrorState message="Failed to load sale details." onRetry={refetch} />;
  }

  const isCancelled = sale.status === 'CANCELLED';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.title}>Sale Receipt #{sale.id}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.receiptCard, isCancelled ? styles.cancelledCard : null]}>
          <View style={styles.receiptHeader}>
            <Ionicons name="receipt-outline" size={32} color="#2563eb" />
            <Text style={styles.receiptTitle}>SmartKhata Sale Receipt</Text>
            <Text style={styles.receiptDate}>{formatDateTime(sale.saleDate)}</Text>
          </View>

          {isCancelled && (
            <View style={styles.cancelledBanner}>
              <Ionicons name="alert-circle" size={18} color="#b91c1c" />
              <Text style={styles.cancelledBannerText}>
                THIS SALE HAS BEEN CANCELLED
              </Text>
            </View>
          )}

          <View style={styles.metaBox}>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Customer:</Text>
              <Text style={styles.metaVal}>
                {sale.customerName || 'Walk-in Customer'}
              </Text>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>Payment Mode:</Text>
              <Text style={styles.metaVal}>{sale.paymentType}</Text>
            </View>
          </View>

          <Text style={styles.itemsHeader}>Itemized Products</Text>
          <View style={styles.itemsTable}>
            {(sale.items || []).map((item, index) => (
              <View key={index} style={styles.tableRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{item.productName}</Text>
                  <Text style={styles.itemQty}>
                    {item.quantity} x {formatINR(item.unitPrice)}
                  </Text>
                </View>
                <Text style={styles.itemTotal}>{formatINR(item.lineTotal)}</Text>
              </View>
            ))}
          </View>

          <View style={styles.grandTotalBox}>
            <Text style={styles.grandTotalLabel}>Grand Total:</Text>
            <Text style={styles.grandTotalVal}>{formatINR(sale.totalAmount)}</Text>
          </View>

          {!isCancelled && (
            <Button
              title="Cancel Sale"
              variant="danger"
              onPress={() => {
                setReasonInput('');
                setReasonError(null);
                setCancelModalVisible(true);
              }}
              iconName="close-circle-outline"
              style={styles.cancelBtn}
            />
          )}
        </View>
      </ScrollView>

      {/* Cancel Sale Modal */}
      <Modal visible={cancelModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Cancel Sale #{sale.id}</Text>
            <Text style={styles.modalSub}>
              Please enter the cancellation reason for audit records.
            </Text>

            {reasonError ? (
              <Text style={styles.modalError}>{reasonError}</Text>
            ) : null}

            <Input
              label="Reason for Cancellation"
              placeholder="e.g. Item returned by customer / wrong entry"
              value={reasonInput}
              onChangeText={setReasonInput}
            />

            <View style={styles.modalActions}>
              <Button
                title="Go Back"
                variant="secondary"
                onPress={() => setCancelModalVisible(false)}
                disabled={isCancelling}
                style={{ flex: 1 }}
              />
              <Button
                title="Confirm Cancellation"
                variant="danger"
                onPress={handleCancelSale}
                loading={isCancelling}
                disabled={isCancelling}
                style={{ flex: 1 }}
              />
            </View>
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
  content: { padding: 16 },
  receiptCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  cancelledCard: { borderColor: '#fca5a5', backgroundColor: '#fff5f5' },
  receiptHeader: { alignItems: 'center', marginBottom: 16 },
  receiptTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a', marginTop: 6 },
  receiptDate: { fontSize: 12, color: '#64748b', marginTop: 2 },
  cancelledBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fef2f2', padding: 10, borderRadius: 8, marginBottom: 16 },
  cancelledBannerText: { fontSize: 12, fontWeight: '800', color: '#b91c1c', marginLeft: 6 },
  metaBox: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 10, marginBottom: 16 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 },
  metaLabel: { fontSize: 13, color: '#64748b' },
  metaVal: { fontSize: 13, fontWeight: '700', color: '#0f172a' },
  itemsHeader: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  itemsTable: { marginBottom: 16 },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  itemName: { fontSize: 14, fontWeight: '700', color: '#0f172a' },
  itemQty: { fontSize: 12, color: '#64748b' },
  itemTotal: { fontSize: 15, fontWeight: '800', color: '#0f172a' },
  grandTotalBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#eff6ff', padding: 16, borderRadius: 12, marginBottom: 16 },
  grandTotalLabel: { fontSize: 16, fontWeight: '700', color: '#1e40af' },
  grandTotalVal: { fontSize: 24, fontWeight: '800', color: '#1d4ed8' },
  cancelBtn: { marginTop: 8 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.6)', justifyContent: 'center', padding: 20 },
  modalCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  modalSub: { fontSize: 13, color: '#64748b', marginTop: 4, marginBottom: 16 },
  modalError: { fontSize: 12, color: '#ef4444', backgroundColor: '#fef2f2', padding: 8, borderRadius: 6, marginBottom: 12 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
});
