import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../theme';

export default function Field({
  label, value, onChangeText, error, hint,
  placeholder, keyboardType, secureTextEntry,
  autoCapitalize = 'none', maxLength,
}) {
  const [focused, setFocused] = useState(false);
  const [hide, setHide] = useState(!!secureTextEntry);
  const borderColor = error ? theme.error : focused ? theme.primary : theme.border;
  return (
    <View style={{ gap: 6 }}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={[styles.box, { borderColor, shadowOpacity: focused ? 1 : 0 }]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.text3}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          keyboardType={keyboardType}
          secureTextEntry={hide}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          style={styles.input}
        />
        {secureTextEntry ? (
          <TouchableOpacity onPress={() => setHide(h => !h)} style={{ padding: 6 }}>
            <Text style={{ color: theme.text3, fontSize: 12 }}>{hide ? '显示' : '隐藏'}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error
        ? <Text style={styles.err}>{error}</Text>
        : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 13, color: theme.text2, fontWeight: '500' },
  box: {
    backgroundColor: theme.card,
    borderRadius: theme.radiusSm,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 3,
  },
  input: { flex: 1, height: 44, color: theme.text, fontSize: 15 },
  err: { fontSize: 12, color: theme.error },
  hint: { fontSize: 12, color: theme.text3 },
});
