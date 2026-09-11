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
import { useProducts } from '../../../src/hooks/useProducts';
import { Input } from '../../../src/components/common/Input';
import { Button } from '../../../src/components/common/Button';

const addProductSchema = z.object({
  name: z.string().min(2, { message: 'Product name must be at least 2 characters' }),
  price: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Enter a valid price amount',
    }),
  stock: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Enter a valid stock quantity',
    }),
});

type AddProductFormData = z.infer<typeof addProductSchema>;

export default function AddProductScreen() {
  const router = useRouter();
  const { createProduct, isCreating } = useProducts();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductFormData>({
    resolver: zodResolver(addProductSchema),
    defaultValues: {
      name: '',
      price: '',
      stock: '',
    },
  });

  const onSubmit = async (data: AddProductFormData) => {
    setErrorMsg(null);
    try {
      await createProduct({
        name: data.name,
        price: Number(data.price),
        stock: Number(data.stock),
      });
      Alert.alert('Product Added', `${data.name} added to inventory.`, [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to create product');
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
          <Text style={styles.title}>Add Product</Text>
        </View>

        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color="#b91c1c" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        <View style={styles.card}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Product Name"
                placeholder="e.g. Basmati Rice (1kg)"
                iconName="cube-outline"
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
            name="price"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Unit Price (₹)"
                placeholder="e.g. 120"
                keyboardType="numeric"
                iconName="pricetag-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.price?.message}
                editable={!isCreating}
              />
            )}
          />

          <Controller
            control={control}
            name="stock"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Stock Quantity"
                placeholder="e.g. 50"
                keyboardType="numeric"
                iconName="layers-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.stock?.message}
                editable={!isCreating}
              />
            )}
          />

          <Button
            title="Save Product to Inventory"
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
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e2e8f0', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  title: { fontSize: 22, fontWeight: '800', color: '#0f172a' },
  errorBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef2f2', borderWidth: 1, borderColor: '#fca5a5', padding: 12, borderRadius: 8, marginBottom: 16 },
  errorText: { fontSize: 13, color: '#b91c1c', marginLeft: 8, flex: 1 },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  submitBtn: { marginTop: 12 },
});
