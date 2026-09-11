import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  useCustomerDetail,
  useCustomerLedger,
  useCustomers,
} from '../../../src/hooks/useCustomers';
import {
  useCustomerTransactions,
  useRecordPayment,
} from '../../../src/hooks/useTransactions';
import { TransactionResponse } from '../../../src/types/transaction';
import { formatINR } from '../../../src/utils/currency';
import { formatDateTime } from '../../../src/utils/date';
import { Loading } from '../../../src/components/common/Loading';
import { ErrorState } from '../../../src/components/common/ErrorState';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { Input } from '../../../src/components/common/Input';
import { Button } from '../../../src/components/common/Button';
import { ConfirmDialog } from '../../../src/components/common/ConfirmDialog';

export default function CustomerDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const customerId = Number(id);

  const {
    data: customer,
    isLoading: isLoadingCustomer,
    isError: isErrorCustomer,
    refetch: refetchCustomer,
  } = useCustomerDetail(customerId);

  const {
    data: ledger,
    isLoading: isLoadingLedger,
    refetch: refetchLedger,
  } = useCustomerLedger(customerId);

  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
    addTransaction,
    isAddingTransaction,
  } = useCustomerTransactions(customerId);

  const recordPaymentMutation = useRecordPayment();
  const { deleteCustomer, isDeleting } = useCustomers();

  // Modals state
  const [creditModalVisible, setCreditModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

  // Form states
  const [amountInput, setAmountInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      refetchCustomer(),
      refetchLedger(),
      refetchTransactions(),
    ]);
    setRefreshing(false);
  };

  const handleAddCredit = async () => {
    const amount = Number(amountInput);
    if (isNaN(amount) || amount <= 0) {
      setFormError('Please enter a valid credit amount (> 0)');
      return;
    }
    setFormError(null);
    try {
      await addTransaction({
        type: 'CREDIT',
        amount,
        note: noteInput.trim() || 'Credit sale / Udhar',
      });
      setCreditModalVisible(false);
      setAmountInput('');
      setNoteInput('');
      Alert.alert('Credit Added', `₹${amount} credit logged for customer.`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to record credit');
    }
  };

  const handleRecordPayment = async () => {
    const amount = Number(amountInput);
    if (isNaN(amount) || amount <= 0) {
      setFormError('Please enter a valid payment amount (> 0)');
      return;
    }
    setFormError(null);
    try {
      await recordPaymentMutation.mutateAsync({
        customerId,
        amount,
        note: noteInput.trim() || 'Cash / Payment received',
      });
      setPaymentModalVisible(false);
      setAmountInput('');
      setNoteInput('');
      Alert.alert('Payment Recorded', `₹${amount} payment received from customer.`);
    } catch (err: any) {
      setFormError(err.message || 'Failed to record payment');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCustomer(customerId);
      setDeleteConfirmVisible(false);
      Alert.alert('Customer Deleted', 'Customer account has been removed.', [
        { text: 'OK', onPress: () => router.replace('/(app)/customers') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to delete customer');
    }
  };

  if (isLoadingCustomer || isLoadingLedger) {
    return <Loading message="Loading customer khata..." />;
  }

  if (isErrorCustomer || !customer) {
    return (
      <ErrorState
        message="Failed to load customer details."
        onRetry={refetchCustomer}
      />
    );
  }

  const outstanding = ledger?.outstandingAmount ?? 0;
  const totalCredit = ledger?.totalCredit ?? 0;
  const totalPayment = ledger?.totalPayment ?? 0;

  const renderTransactionItem = ({ item }: { item: TransactionResponse }) => {
    const isPayment = item.type === 'PAYMENT';

    return (
      <View style={styles.transactionCard}>
        <View style={styles.txHeader}>
          <View
            style={[
              styles.txTypeBadge,
              isPayment ? styles.paymentBadge : styles.creditBadge,
            ]}
          >
            <Ionicons
              name={isPayment ? 'arrow-down-circle' : 'arrow-up-circle'}
              size={16}
              color={isPayment ? '#047857' : '#b91c1c'}
            />
            <Text
              style={[
                styles.txTypeText,
                isPayment ? styles.paymentText : styles.creditText,
              ]}
            >
              {isPayment ? 'PAYMENT RECEIVED' : 'CREDIT GIVEN'}
            </Text>
          </View>
          <Text style={styles.txDate}>{formatDateTime(item.transactionDate)}</Text>
        </View>

        <View style={styles.txBody}>
          <Text style={styles.txNote}>{item.note || 'No note attached'}</Text>
          <Text
            style={[
              styles.txAmount,
              isPayment ? styles.paymentAmount : styles.creditAmount,
            ]}
          >
            {isPayment ? '-' : '+'} {formatINR(item.amount)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {customer.name}
        </Text>
        <TouchableOpacity
          style={styles.statementBtn}
          onPress={() =>
            router.push(`/(app)/customers/statement?id=${customerId}`)
          }
        >
          <Ionicons name="document-text-outline" size={20} color="#2563eb" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={transactions || []}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderTransactionItem}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
          />
        }
        ListHeaderComponent={
          <>
            {/* Customer Info Box */}
            <View style={styles.infoCard}>
              <View style={styles.customerHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {customer.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <Text style={styles.customerPhone}>📞 {customer.phone}</Text>
                  <Text style={styles.customerAddress}>
                    📍 {customer.address}
                  </Text>
                </View>
              </View>

              {/* Outstanding Balance Banner */}
              <View style={styles.balanceBanner}>
                <View>
                  <Text style={styles.balanceLabel}>Outstanding Balance</Text>
                  <Text
                    style={[
                      styles.balanceValue,
                      outstanding > 0 ? styles.debitColor : styles.creditColor,
                    ]}
                  >
                    {formatINR(outstanding)}
                  </Text>
                </View>
                <View style={styles.limitBox}>
                  <Text style={styles.limitLabel}>Credit Limit</Text>
                  <Text style={styles.limitValue}>
                    {formatINR(customer.creditLimit)}
                  </Text>
                </View>
              </View>

              {/* Ledger Summary Stats */}
              <View style={styles.statsRow}>
                <View style={[styles.statItem, { backgroundColor: '#fef2f2' }]}>
                  <Text style={[styles.statVal, { color: '#b91c1c' }]}>
                    {formatINR(totalCredit)}
                  </Text>
                  <Text style={styles.statLbl}>Total Credit Given</Text>
                </View>
                <View style={[styles.statItem, { backgroundColor: '#ecfdf5' }]}>
                  <Text style={[styles.statVal, { color: '#047857' }]}>
                    {formatINR(totalPayment)}
                  </Text>
                  <Text style={styles.statLbl}>Total Payment Recd</Text>
                </View>
              </View>

              {/* Main Actions Bar */}
              <View style={styles.actionsBar}>
                <Button
                  title="+ Add Credit"
                  onPress={() => {
                    setFormError(null);
                    setAmountInput('');
                    setNoteInput('');
                    setCreditModalVisible(true);
                  }}
                  variant="danger"
                  style={styles.actionBtnFlex}
                />
                <Button
                  title="+ Record Payment"
                  onPress={() => {
                    setFormError(null);
                    setAmountInput('');
                    setNoteInput('');
                    setPaymentModalVisible(true);
                  }}
                  variant="primary"
                  style={styles.actionBtnFlex}
                />
              </View>

              <View style={styles.secondaryActions}>
                <TouchableOpacity
                  style={styles.secBtn}
                  onPress={() =>
                    router.push(`/(app)/customers/statement?id=${customerId}`)
                  }
                >
                  <Ionicons name="document-text" size={16} color="#2563eb" />
                  <Text style={styles.secBtnText}>Statement</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secBtn}
                  onPress={() => setDeleteConfirmVisible(true)}
                >
                  <Ionicons name="trash-outline" size={16} color="#ef4444" />
                  <Text style={[styles.secBtnText, { color: '#ef4444' }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.sectionHeader}>Khata Ledger Transactions</Text>
          </>
        }
        ListEmptyComponent={
          <EmptyState
            iconName="receipt-outline"
            title="No Transactions Recorded"
            description="Add credit or record payment to start building this customer's khata history."
          />
        }
      />

      {/* Add Credit Modal */}
      <Modal
        visible={creditModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCreditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Give Credit (Gave Udhar)</Text>
            <Text style={styles.modalSub}>
              Customer: {customer.name}
            </Text>

            {formError ? (
              <Text style={styles.modalError}>{formError}</Text>
            ) : null}

            <Input
              label="Credit Amount (₹)"
              placeholder="e.g. 500"
              keyboardType="numeric"
              value={amountInput}
              onChangeText={setAmountInput}
            />

            <Input
              label="Note / Description"
              placeholder="e.g. Grocery items, Rice & Oil"
              value={noteInput}
              onChangeText={setNoteInput}
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => setCreditModalVisible(false)}
                disabled={isAddingTransaction}
                style={{ flex: 1 }}
              />
              <Button
                title="Add Credit"
                variant="danger"
                onPress={handleAddCredit}
                loading={isAddingTransaction}
                disabled={isAddingTransaction}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Record Payment Modal */}
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Record Payment (Got Cash)</Text>
            <Text style={styles.modalSub}>
              Customer: {customer.name}
            </Text>

            {formError ? (
              <Text style={styles.modalError}>{formError}</Text>
            ) : null}

            <Input
              label="Payment Amount (₹)"
              placeholder="e.g. 300"
              keyboardType="numeric"
              value={amountInput}
              onChangeText={setAmountInput}
            />

            <Input
              label="Note / Payment Mode"
              placeholder="e.g. Cash payment / UPI"
              value={noteInput}
              onChangeText={setNoteInput}
            />

            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                variant="secondary"
                onPress={() => setPaymentModalVisible(false)}
                disabled={recordPaymentMutation.isPending}
                style={{ flex: 1 }}
              />
              <Button
                title="Save Payment"
                variant="primary"
                onPress={handleRecordPayment}
                loading={recordPaymentMutation.isPending}
                disabled={recordPaymentMutation.isPending}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        visible={deleteConfirmVisible}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customer.name}? This will remove all associated khata transactions.`}
        confirmText="Delete Customer"
        loading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: { padding: 4 },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginHorizontal: 12,
  },
  statementBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { padding: 16, paddingBottom: 32 },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 20,
  },
  customerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 22, fontWeight: '800', color: '#1d4ed8' },
  customerDetails: { flex: 1 },
  customerName: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
  customerPhone: { fontSize: 13, color: '#64748b', marginTop: 2 },
  customerAddress: { fontSize: 13, color: '#64748b', marginTop: 2 },
  balanceBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  balanceLabel: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  balanceValue: { fontSize: 22, fontWeight: '800', marginTop: 2 },
  debitColor: { color: '#ef4444' },
  creditColor: { color: '#10b981' },
  limitBox: { alignItems: 'flex-end' },
  limitLabel: { fontSize: 12, color: '#64748b' },
  limitValue: { fontSize: 14, fontWeight: '700', color: '#334155', marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statItem: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  statVal: { fontSize: 15, fontWeight: '800' },
  statLbl: { fontSize: 11, color: '#64748b', marginTop: 2 },
  actionsBar: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  actionBtnFlex: { flex: 1 },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    paddingTop: 12,
  },
  secBtn: { flexDirection: 'row', alignItems: 'center', padding: 6 },
  secBtnText: { fontSize: 13, fontWeight: '700', color: '#2563eb', marginLeft: 6 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  transactionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  txTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  creditBadge: { backgroundColor: '#fef2f2' },
  paymentBadge: { backgroundColor: '#ecfdf5' },
  txTypeText: { fontSize: 11, fontWeight: '800', marginLeft: 4 },
  creditText: { color: '#b91c1c' },
  paymentText: { color: '#047857' },
  txDate: { fontSize: 11, color: '#94a3b8' },
  txBody: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  txNote: { fontSize: 14, color: '#334155', flex: 1, marginRight: 8 },
  txAmount: { fontSize: 16, fontWeight: '800' },
  creditAmount: { color: '#ef4444' },
  paymentAmount: { color: '#10b981' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    elevation: 5,
  },
  modalTitle: { fontSize: 20, fontWeight: '800', color: '#0f172a' },
  modalSub: { fontSize: 13, color: '#64748b', marginTop: 2, marginBottom: 16 },
  modalError: {
    fontSize: 13,
    color: '#ef4444',
    backgroundColor: '#fef2f2',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 12 },
});
