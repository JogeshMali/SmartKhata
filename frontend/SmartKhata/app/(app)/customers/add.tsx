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
import { useCustomers } from '../../../src/hooks/useCustomers';
import { Input } from '../../../src/components/common/Input';
import { Button } from '../../../src/components/common/Button';

const addCustomerSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: 'Enter a valid 10-digit Indian phone number' }),
  address: z.string().min(3, { message: 'Address must be at least 3 characters' }),
  creditLimit: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Enter a valid credit limit amount',
    }),
});

type AddCustomerFormData = z.infer<typeof addCustomerSchema>;

export default function AddCustomerScreen() {
  const router = useRouter();
  const { createCustomer, isCreating } = useCustomers();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddCustomerFormData>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      creditLimit: '50000',
    },
  });

  const onSubmit = async (data: AddCustomerFormData) => {
    setErrorMsg(null);
    try {
      await createCustomer({
        name: data.name,
        phone: data.phone,
        address: data.address,
        creditLimit: Number(data.creditLimit),
      });
      Alert.alert('Customer Added', `${data.name} has been added to your khata.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to add customer');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.title}>Add New Customer</Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color="#b91c1c" />
            <Text style={styles.errorBannerText}>{errorMsg}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Customer Full Name"
                placeholder="e.g. Rahul Sharma"
                iconName="person-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
                editable={!isCreating}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Phone Number (10 digits)"
                placeholder="e.g. 9876543210"
                keyboardType="phone-pad"
                maxLength={10}
                iconName="call-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.phone?.message}
                editable={!isCreating}
              />
            )}
          />

          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Address / Area"
                placeholder="e.g. Sector 12, Main Road"
                iconName="location-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.address?.message}
                editable={!isCreating}
              />
            )}
          />

          <Controller
            control={control}
            name="creditLimit"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Credit Limit (₹)"
                placeholder="e.g. 50000"
                keyboardType="numeric"
                iconName="wallet-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.creditLimit?.message}
                editable={!isCreating}
              />
            )}
          />

          <Button
            title="Save Customer"
            onPress={handleSubmit(onSubmit)}
            loading={isCreating}
            disabled={isCreating}
            iconName="checkmark-circle-outline"
            style={styles.submitBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: { flex: 1, backgroundColor: '#f8fafc' },
  scrollContent: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorBannerText: { fontSize: 13, color: '#b91c1c', marginLeft: 8, flex: 1 },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  submitBtn: { marginTop: 12 },
});
