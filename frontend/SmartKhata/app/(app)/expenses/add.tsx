import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { z } from 'zod';
import { useExpenses } from '../../../src/hooks/useExpenses';
import { ExpenseCategory } from '../../../src/types/expense';
import { formatToISODate } from '../../../src/utils/date';
import { Input } from '../../../src/components/common/Input';
import { Button } from '../../../src/components/common/Button';

const EXPENSE_CATEGORIES: ExpenseCategory[] = [
  'RENT',
  'ELECTRICITY',
  'WATER',
  'INTERNET',
  'SALARY',
  'PURCHASE',
  'TRANSPORT',
  'MAINTENANCE',
  'MARKETING',
  'TAX',
  'STATIONERY',
  'OTHER',
];

const addExpenseSchema = z.object({
  amount: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Enter a valid expense amount (> 0)',
    }),
  expenseDate: z
    .string()
    .min(10, { message: 'Enter a valid date in YYYY-MM-DD format' }),
  description: z.string().optional(),
});

type AddExpenseFormData = z.infer<typeof addExpenseSchema>;

export default function AddExpenseScreen() {
  const router = useRouter();
  const { createExpense, isCreating } = useExpenses();
  const [selectedCategory, setSelectedCategory] = useState<ExpenseCategory>('RENT');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddExpenseFormData>({
    resolver: zodResolver(addExpenseSchema),
    defaultValues: {
      amount: '',
      expenseDate: formatToISODate(new Date()),
      description: '',
    },
  });

  const onSubmit = async (data: AddExpenseFormData) => {
    setErrorMsg(null);
    try {
      await createExpense({
        category: selectedCategory,
        amount: Number(data.amount),
        expenseDate: data.expenseDate,
        description: data.description || `${selectedCategory} expense`,
      });
      Alert.alert('Expense Logged', `${selectedCategory} expense added.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to log expense');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.title}>Log Shop Expense</Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color="#b91c1c" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {/* Category Picker Grid */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Select Expense Category</Text>
          <View style={styles.categoryGrid}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.catChip,
                  selectedCategory === cat ? styles.selectedCatChip : null,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.catChipText,
                    selectedCategory === cat ? styles.selectedCatText : null,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Form Fields Card */}
        <View style={styles.card}>
          <Controller
            control={control}
            name="amount"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Expense Amount (₹)"
                placeholder="e.g. 5000"
                keyboardType="numeric"
                iconName="cash-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.amount?.message}
                editable={!isCreating}
              />
            )}
          />

          <Controller
            control={control}
            name="expenseDate"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Expense Date (YYYY-MM-DD)"
                placeholder="YYYY-MM-DD"
                iconName="calendar-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.expenseDate?.message}
                editable={!isCreating}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Description / Note"
                placeholder="e.g. Monthly shop rent payment"
                iconName="document-text-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.description?.message}
                editable={!isCreating}
              />
            )}
          />

          <Button
            title="Save Expense"
            onPress={handleSubmit(onSubmit)}
            loading={isCreating}
            disabled={isCreating}
            variant="danger"
            iconName="checkmark-circle-outline"
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fca5a5', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { fontSize: 13, color: '#b91c1c', marginLeft: 8, flex: 1 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: '#334155', marginBottom: 12 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  catChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#cbd5e1' },
  selectedCatChip: { backgroundColor: '#ef4444', borderColor: '#ef4444' },
  catChipText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  selectedCatText: { color: '#ffffff' },
  submitBtn: { marginTop: 12 },
});
