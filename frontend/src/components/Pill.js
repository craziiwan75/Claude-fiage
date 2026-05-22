import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function Pill({ children, tone = 'neutral' }) {
  const map = {
    success: { bg: theme.successSoft, fg: theme.success },
    warn:    { bg: theme.warnSoft,    fg: theme.warn },
    error:   { bg: theme.errorSoft,   fg: theme.error },
    primary: { bg: theme.primarySoft, fg: theme.primary },
    neutral: { bg: theme.cardAlt,     fg: theme.text2 },
  }[tone];
  return (
    <View style={[styles.pill, { backgroundColor: map.bg }]}>
      <Text style={[styles.txt, { color: map.fg }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 999, alignSelf: 'flex-start' },
  txt:  { fontSize: 11, fontWeight: '600' },
});
