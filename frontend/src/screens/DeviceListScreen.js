import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Pill from '../components/Pill';
import { useToast } from '../contexts/ToastContext';
import * as api from '../api/categories';
import { theme } from '../theme';

const STATUS_TONE = { '在用': 'success', '闲置': 'neutral', '维修': 'warn', '库存': 'primary' };

export default function DeviceListScreen({ navigation, route }) {
  const { categoryId, categoryName } = route.params;
  const { show } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setItems(await api.listCategoryDevices(categoryId));
    } catch (e) { show(e.message, 'error'); }
    finally { setLoading(false); setRefreshing(false); }
  }, [categoryId, show]);

  useFocusEffect(useCallback(() => { load(false); }, [load]));

  if (loading) return <View style={styles.center}><ActivityIndicator color={theme.primary} /></View>;

  return (
    <View style={styles.host}>
      <FlatList
        data={items}
        keyExtractor={(d) => String(d.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.primary} />}
        contentContainerStyle={items.length === 0 ? { flexGrow: 1 } : { padding: 16, gap: 10, paddingBottom: 80 }}
        ListHeaderComponent={items.length > 0 ? <Text style={styles.sum}>共 {items.length} 台 · {categoryName}</Text> : null}
        ListEmptyComponent={<EmptyState title="该分类下暂无设备" hint="点击下方按钮添加第一台设备"
          action={<Button title="添加设备" onPress={() => navigation.navigate('DeviceForm', { mode: 'create', categoryId })} />} />}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8}
            onPress={() => navigation.navigate('DeviceForm', { mode: 'edit', id: item.id })}
            style={styles.row}>
            <View style={styles.iconBox}><Text style={{ fontSize: 20 }}>🖥️</Text></View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={styles.name}>{item.name}</Text>
                <Pill tone={STATUS_TONE[item.status] || 'neutral'}>{item.status}</Pill>
              </View>
              <Text style={styles.model}>{item.model || '-'}</Text>
              <Text style={styles.meta}>使用人 · {item.assignee || '-'}</Text>
            </View>
            <Text style={{ color: theme.text3, fontSize: 18 }}>›</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity style={styles.fab}
        onPress={() => navigation.navigate('DeviceForm', { mode: 'create', categoryId })}>
        <Text style={styles.fabTxt}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, backgroundColor: theme.bg },
  center: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  sum: { fontSize: 12, color: theme.text3, paddingBottom: 6 },
  row: { flexDirection: 'row', gap: 12, padding: 14, backgroundColor: theme.card, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.border, alignItems: 'center' },
  iconBox: { width: 44, height: 44, borderRadius: theme.radiusSm, backgroundColor: theme.cardAlt, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '600', color: theme.text },
  model: { fontSize: 12.5, color: theme.text2, marginTop: 2 },
  meta: { fontSize: 11, color: theme.text3, marginTop: 4 },
  fab: { position: 'absolute', right: 18, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  fabTxt: { color: theme.onPrimary, fontSize: 28, fontWeight: '300' },
});
