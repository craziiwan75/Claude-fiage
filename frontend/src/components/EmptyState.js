import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

export default function EmptyState({ title, hint, action }) {
  return (
    <View style={styles.host}>
      <View style={styles.icon}><Text style={{ fontSize: 28 }}>📂</Text></View>
      <Text style={styles.title}>{title}</Text>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      {action ? <View style={{ marginTop: 12 }}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  host: { padding: 40, alignItems: 'center', gap: 8 },
  icon: { width: 64, height: 64, borderRadius: 32, backgroundColor: theme.cardAlt, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: theme.text, marginTop: 4 },
  hint:  { fontSize: 13, color: theme.text3, textAlign: 'center' },
});
