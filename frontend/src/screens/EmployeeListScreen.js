import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import Button from '../components/Button';
import Pill from '../components/Pill';
import EmptyState from '../components/EmptyState';
import { useToast } from '../contexts/ToastContext';
import * as api from '../api/employees';
import { theme } from '../theme';

export default function EmployeeListScreen({ navigation }) {
  const { show } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      const data = await api.listEmployees(1, 100);
      setItems((data && data.items) || []);
    } catch (err) {
      show(err.message || '加载失败', 'error');
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  }, [show]);

  useFocusEffect(useCallback(() => { load(false); }, [load]));

  const onDelete = (emp) => {
    Alert.alert(
      '删除员工？',
      `「${emp.name}」的所有数据将被永久删除，操作不可撤销。`,
      [
        { text: '取消', style: 'cancel' },
        { text: '删除', style: 'destructive', onPress: async () => {
          try {
            await api.deleteEmployee(emp.id);
            show(`已删除 ${emp.name}`, 'success');
            load(true);
          } catch (e) { show(e.message || '删除失败', 'error'); }
        }},
      ],
    );
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator color={theme.primary} /></View>;
  }

  return (
    <View style={styles.host}>
      <FlatList
        data={items}
        keyExtractor={(e) => String(e.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.primary} />}
        contentContainerStyle={items.length === 0 ? { flexGrow: 1 } : { padding: 16, gap: 10, paddingBottom: 80 }}
        ListEmptyComponent={
          <EmptyState
            title="暂无员工"
            hint="点击下方按钮添加第一位员工"
            action={<Button title="新增员工" onPress={() => navigation.navigate('EmployeeForm', { mode: 'create' })} />}
          />
        }
        ListHeaderComponent={items.length > 0 ? (
          <Text style={styles.summary}>共 {items.length} 名员工</Text>
        ) : null}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8}
                            onPress={() => navigation.navigate('EmployeeDetail', { id: item.id })}
                            style={styles.row}>
            <View style={styles.avatar}><Text style={styles.avatarTxt}>{item.name.slice(0,1)}</Text></View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.age}>· {item.age}岁</Text>
              </View>
              <Text style={styles.email} numberOfLines={1}>{item.email}</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                {item.dept ? <Pill tone="primary">{item.dept}</Pill> : null}
                {item.title ? <Pill tone="neutral">{item.title}</Pill> : null}
              </View>
            </View>
            <TouchableOpacity onPress={() => onDelete(item)} hitSlop={8} style={{ padding: 6 }}>
              <Text style={{ color: theme.text3 }}>删除</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab}
                        onPress={() => navigation.navigate('EmployeeForm', { mode: 'create' })}>
        <Text style={styles.fabTxt}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, backgroundColor: theme.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.bg },
  summary: { fontSize: 12, color: theme.text3, paddingHorizontal: 4, paddingBottom: 6 },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, backgroundColor: theme.card,
    borderRadius: theme.radius, borderWidth: 1, borderColor: theme.border,
  },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: theme.primary, fontWeight: '700', fontSize: 16 },
  name: { fontSize: 15, fontWeight: '600', color: theme.text },
  age: { fontSize: 11, color: theme.text3 },
  email: { fontSize: 12.5, color: theme.text2, marginTop: 2 },
  fab: {
    position: 'absolute', right: 18, bottom: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: theme.primary, shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  fabTxt: { color: theme.onPrimary, fontSize: 28, lineHeight: 30, fontWeight: '300' },
});
