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
import { useAuth } from '../../src/hooks/useAuth';
import { registerSchema, RegisterFormData } from '../../src/utils/validation';
import { Input } from '../../src/components/common/Input';
import { Button } from '../../src/components/common/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const { registerUser, isLoading } = useAuth();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      shopName: '',
      shopPhone: '',
      shopAddress: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setApiError(null);
    try {
      const message = await registerUser(data);
      Alert.alert(
        'Registration Successful',
        message || 'Your account and shop have been created. Please log in.',
        [
          {
            text: 'Proceed to Login',
            onPress: () => router.replace('/(auth)/login'),
          },
        ]
      );
    } catch (err: any) {
      setApiError(err.message || 'Registration failed. Please check details.');
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
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>
          <Text style={styles.title}>Register Shop</Text>
          <Text style={styles.subtitle}>
            Create your SmartKhata shop owner account
          </Text>
        </View>

        {apiError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#b91c1c" />
            <Text style={styles.errorBannerText}>{apiError}</Text>
          </View>
        ) : null}

        {/* Section 1: Owner Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="person-outline" size={20} color="#2563eb" />
            <Text style={styles.sectionTitle}>1. Owner Information</Text>
          </View>

          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Full Name"
                placeholder="e.g. Ramesh Kumar"
                iconName="person-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.name?.message}
                editable={!isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                placeholder="e.g. ramesh@example.com"
                keyboardType="email-address"
                autoComplete="email"
                iconName="mail-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
                editable={!isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Owner Phone Number (10 digits)"
                placeholder="e.g. 9876543210"
                keyboardType="phone-pad"
                maxLength={10}
                iconName="call-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.phone?.message}
                editable={!isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Password"
                placeholder="Minimum 6 characters"
                isPassword
                iconName="lock-closed-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                editable={!isLoading}
              />
            )}
          />
        </View>

        {/* Section 2: Shop Information */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="storefront-outline" size={20} color="#2563eb" />
            <Text style={styles.sectionTitle}>2. Shop Details</Text>
          </View>

          <Controller
            control={control}
            name="shopName"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Shop Name"
                placeholder="e.g. Ramesh Kirana Store"
                iconName="business-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.shopName?.message}
                editable={!isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="shopPhone"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Shop Phone Number (10 digits)"
                placeholder="e.g. 9876543210"
                keyboardType="phone-pad"
                maxLength={10}
                iconName="call-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.shopPhone?.message}
                editable={!isLoading}
              />
            )}
          />

          <Controller
            control={control}
            name="shopAddress"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Shop Address"
                placeholder="e.g. Main Market, Station Road"
                iconName="location-outline"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.shopAddress?.message}
                editable={!isLoading}
              />
            )}
          />
        </View>

        <Button
          title="Create Shop Account"
          onPress={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
          iconName="checkmark-circle-outline"
          style={styles.submitBtn}
        />

        <View style={styles.footerLinkContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            disabled={isLoading}
          >
            <Text style={styles.linkText}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fca5a5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorBannerText: {
    fontSize: 13,
    color: '#b91c1c',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 8,
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 16,
  },
  footerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  footerText: {
    fontSize: 14,
    color: '#64748b',
  },
  linkText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2563eb',
  },
});
