import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { theme } from '../theme';

const ToastCtx = createContext(null);
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const show = useCallback((text, kind = 'info') => {
    setToast({ text, kind });
    Animated.timing(opacity, { toValue: 1, duration: 180, easing: Easing.out(Easing.ease), useNativeDriver: true }).start();
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setToast(null));
    }, 2000);
  }, [opacity]);

  return (
    <ToastCtx.Provider value={{ show }}>
      {children}
      {toast && (
        <Animated.View pointerEvents="none" style={[styles.host, { opacity }]}>
          <View style={[styles.body, styles[toast.kind] || styles.info]}>
            <Text style={styles.text}>{toast.text}</Text>
          </View>
        </Animated.View>
      )}
    </ToastCtx.Provider>
  );
}

const styles = StyleSheet.create({
  host: { position: 'absolute', top: 80, left: 0, right: 0, alignItems: 'center', zIndex: 1000 },
  body: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: theme.radius, maxWidth: '80%' },
  info:    { backgroundColor: theme.text },
  success: { backgroundColor: theme.success },
  error:   { backgroundColor: theme.error },
  text:    { color: '#fff', fontSize: 14, fontWeight: '500' },
});
