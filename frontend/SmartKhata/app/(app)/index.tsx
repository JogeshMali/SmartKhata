import React, { useState } from 'react';
import {
  RefreshControl,
  
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../src/hooks/useAuth';
import { useDashboard } from '../../src/hooks/useDashboard';
import { formatINR } from '../../src/utils/currency';
import { ErrorState } from '../../src/components/common/ErrorState';

export default function DashboardScreen() {
  const router = useRouter();
  const { userEmail } = useAuth();
  const { data, isLoading, isError, error, refetch } = useDashboard();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState
          message={(error as Error)?.message || 'Failed to load dashboard data.'}
          onRetry={refetch}
        />
      </SafeAreaView>
    );
  }

  const todaySales = data?.todaySales ?? 0;
  const todayExpenses = data?.todayExpenses ?? 0;
  const todayProfit = data?.todayProfit ?? 0;
  const outstandingCredit = data?.outstandingCredit ?? 0;
  const totalCustomers = data?.totalCustomers ?? 0;
  const totalProducts = data?.totalProducts ?? 0;
  const lowStockProducts = data?.lowStockProducts ?? 0;
  const totalSalesToday = data?.totalSalesToday ?? 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2563eb']}
            tintColor="#2563eb"
          />
        }
      >
        {/* Header Greeting */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greetingTitle}>SmartKhata Dashboard</Text>
            <Text style={styles.greetingSub}>{userEmail || 'Shop Owner'}</Text>
          </View>
          <TouchableOpacity
            style={styles.refreshBadge}
            onPress={() => refetch()}
            activeOpacity={0.7}
          >
            <Ionicons name="refresh" size={18} color="#2563eb" />
          </TouchableOpacity>
        </View>

        {/* Quick Action Shortcuts */}
        <Text style={styles.sectionHeading}>Quick Actions</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.actionsScroll}
          contentContainerStyle={styles.actionsContainer}
        >
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#eff6ff' }]}
            onPress={() => router.push('/(app)/customers/add')}
          >
            <Ionicons name="person-add-outline" size={22} color="#2563eb" />
            <Text style={[styles.actionText, { color: '#1d4ed8' }]}>+ Customer</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#ecfdf5' }]}
            onPress={() => router.push('/(app)/sales/create')}
          >
            <Ionicons name="cart-outline" size={22} color="#10b981" />
            <Text style={[styles.actionText, { color: '#047857' }]}>+ Sale</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#f0fdf4' }]}
            onPress={() => router.push('/(app)/customers')}
          >
            <Ionicons name="cash-outline" size={22} color="#15803d" />
            <Text style={[styles.actionText, { color: '#15803d' }]}>+ Payment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#fef2f2' }]}
            onPress={() => router.push('/(app)/expenses/add')}
          >
            <Ionicons name="card-outline" size={22} color="#ef4444" />
            <Text style={[styles.actionText, { color: '#b91c1c' }]}>+ Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: '#fffbebf' }]}
            onPress={() => router.push('/(app)/products/add')}
          >
            <Ionicons name="cube-outline" size={22} color="#d97706" />
            <Text style={[styles.actionText, { color: '#b45309' }]}>+ Product</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Main Financial Overview Cards */}
        <Text style={styles.sectionHeading}>Financial Overview</Text>
        <View style={styles.metricsGrid}>
          {/* Today's Sales */}
          <View style={[styles.metricCard, styles.salesCard]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Today's Sales</Text>
              <View style={[styles.iconBadge, { backgroundColor: '#dcfce7' }]}>
                <Ionicons name="trending-up-outline" size={20} color="#16a34a" />
              </View>
            </View>
            <Text style={[styles.metricValue, { color: '#15803d' }]}>
              {isLoading ? '...' : formatINR(todaySales)}
            </Text>
            <Text style={styles.metricSub}>{totalSalesToday} transactions today</Text>
          </View>

          {/* Today's Expenses */}
          <View style={[styles.metricCard, styles.expenseCard]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Today's Expenses</Text>
              <View style={[styles.iconBadge, { backgroundColor: '#fee2e2' }]}>
                <Ionicons name="trending-down-outline" size={20} color="#dc2626" />
              </View>
            </View>
            <Text style={[styles.metricValue, { color: '#b91c1c' }]}>
              {isLoading ? '...' : formatINR(todayExpenses)}
            </Text>
            <Text style={styles.metricSub}>Shop operating costs</Text>
          </View>

          {/* Today's Profit */}
          <View style={[styles.metricCard, styles.profitCard]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Today's Profit</Text>
              <View style={[styles.iconBadge, { backgroundColor: '#dbeafe' }]}>
                <Ionicons name="wallet-outline" size={20} color="#2563eb" />
              </View>
            </View>
            <Text style={[styles.metricValue, { color: '#1d4ed8' }]}>
              {isLoading ? '...' : formatINR(todayProfit)}
            </Text>
            <Text style={styles.metricSub}>Net profit earned</Text>
          </View>

          {/* Outstanding Credit */}
          <View style={[styles.metricCard, styles.creditCard]}>
            <View style={styles.metricHeader}>
              <Text style={styles.metricLabel}>Outstanding Credit</Text>
              <View style={[styles.iconBadge, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="alert-circle-outline" size={20} color="#d97706" />
              </View>
            </View>
            <Text style={[styles.metricValue, { color: '#b45309' }]}>
              {isLoading ? '...' : formatINR(outstandingCredit)}
            </Text>
            <Text style={styles.metricSub}>Pending customer udhar</Text>
          </View>
        </View>

        {/* Secondary Statistics */}
        <Text style={styles.sectionHeading}>Shop Statistics</Text>
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push('/(app)/customers')}
          >
            <Ionicons name="people" size={24} color="#2563eb" />
            <Text style={styles.statValue}>{isLoading ? '-' : totalCustomers}</Text>
            <Text style={styles.statLabel}>Total Customers</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statBox}
            onPress={() => router.push('/(app)/products')}
          >
            <Ionicons name="cube" size={24} color="#059669" />
            <Text style={styles.statValue}>{isLoading ? '-' : totalProducts}</Text>
            <Text style={styles.statLabel}>Total Products</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.statBox, lowStockProducts > 0 ? styles.alertStatBox : null]}
            onPress={() => router.push('/(app)/products')}
          >
            <Ionicons
              name="warning"
              size={24}
              color={lowStockProducts > 0 ? '#dc2626' : '#64748b'}
            />
            <Text
              style={[
                styles.statValue,
                lowStockProducts > 0 ? { color: '#dc2626' } : null,
              ]}
            >
              {isLoading ? '-' : lowStockProducts}
            </Text>
            <Text style={styles.statLabel}>Low Stock Items</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  greetingSub: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 2,
    fontWeight: '500',
  },
  refreshBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeading: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 10,
    marginTop: 8,
  },
  actionsScroll: {
    marginBottom: 16,
  },
  actionsContainer: {
    gap: 10,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },
  metricsGrid: {
    gap: 12,
    marginBottom: 16,
  },
  metricCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  salesCard: { borderColor: '#bbf7d0' },
  expenseCard: { borderColor: '#fca5a5' },
  profitCard: { borderColor: '#bfdbfe' },
  creditCard: { borderColor: '#fde68a' },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
  },
  iconBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricValue: {
    fontSize: 24,
    fontWeight: '800',
    marginVertical: 4,
  },
  metricSub: {
    fontSize: 12,
    color: '#64748b',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  alertStatBox: {
    borderColor: '#fca5a5',
    backgroundColor: '#fef2f2',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },
});
