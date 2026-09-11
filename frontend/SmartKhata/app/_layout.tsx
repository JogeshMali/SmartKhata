import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from '../src/store/store';
import { useAuth } from '../src/hooks/useAuth';
import { Loading } from '../src/components/common/Loading';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function RootNavigation() {
  const { isAuthenticated, isRestoring, restoreAuth } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    restoreAuth();
  }, [restoreAuth]);

  useEffect(() => {
    if (isRestoring) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect unauthenticated user to login screen
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect authenticated user to dashboard app screen
      router.replace('/(app)');
    }
  }, [isAuthenticated, isRestoring, segments, router]);

  if (isRestoring) {
    return <Loading message="Initializing SmartKhata..." />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          <RootNavigation />
        </QueryClientProvider>
      </Provider>
    </SafeAreaProvider>
  );
}
