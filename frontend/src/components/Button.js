import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { theme } from '../theme';

export default function Button({ title, onPress, kind = 'primary', size = 'md', loading, disabled, style, textStyle }) {
  const palette = {
    primary:   { bg: theme.primary, fg: theme.onPrimary, border: 'transparent' },
    secondary: { bg: theme.card,    fg: theme.text,      border: theme.border },
    ghost:     { bg: 'transparent', fg: theme.primary,   border: 'transparent' },
    danger:    { bg: theme.error,   fg: '#fff',          border: 'transparent' },
  }[kind];
  const sz = size === 'lg' ? 52 : size === 'sm' ? 36 : 44;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.btn,
        {
          height: sz,
          backgroundColor: palette.bg,
          borderColor: palette.border,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}>
      {loading
        ? <ActivityIndicator color={palette.fg} />
        : <Text style={[styles.label, { color: palette.fg }, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { borderRadius: theme.radius, paddingHorizontal: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  label: { fontSize: 15, fontWeight: '600' },
});
