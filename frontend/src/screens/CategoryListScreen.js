import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import { useToast } from '../contexts/ToastContext';
import * as api from '../api/categories';
import { theme } from '../theme';

const COLORS = ['#4F6BED', '#16A34A', '#A855F7', '#F59E0B', '#EF4444', '#0EA5E9'];

export default function CategoryListScreen({ navigation }) {
  const { show } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
      setItems(await api.listCategories());
    } catch (e) { show(e.message, 'error'); }
    finally { setLoading(false); setRefreshing(false); }
  }, [show]);

  useFocusEffect(useCallback(() => { load(false); }, [load]));

  const onDelete = (cat) => {
    if (cat.device_count > 0) {
      Alert.alert('无法删除', `分类下存在 ${cat.device_count} 台设备，请先转移或删除设备。`);
      return;
    }
    Alert.alert('删除分类？', `分类「${cat.name}」将被删除。`, [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: async () => {
        try { await api.deleteCategory(cat.id); show('已删除', 'success'); load(true); }
        catch (e) { show(e.message, 'error'); }
      }},
    ]);
  };

  if (loading) return <View style={styles.center}><ActivityIndicator color={theme.primary} /></View>;

  const total = items.reduce((s, c) => s + (c.device_count || 0), 0);

  return (
    <View style={styles.host}>
      <FlatList
        data={items}
        keyExtractor={(c) => String(c.id)}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={theme.primary} />}
        ListHeaderComponent={
          <View style={styles.stats}>
            <Text style={styles.statsLabel}>资产总览</Text>
            <View style={{ flexDirection: 'row', gap: 14, marginTop: 4 }}>
              <Text style={styles.statBig}>{total}<Text style={styles.statUnit}> 台设备</Text></Text>
              <Text style={styles.statBig}>{items.length}<Text style={styles.statUnit}> 个分类</Text></Text>
            </View>
          </View>
        }
        contentContainerStyle={items.length === 0 ? { flexGrow: 1 } : { padding: 16, gap: 10, paddingBottom: 80 }}
        ListEmptyComponent={<EmptyState title="暂无分类" hint="添加分类以归类设备" />}
        renderItem={({ item, index }) => {
          const color = COLORS[index % COLORS.length];
          return (
            <TouchableOpacity activeOpacity={0.8}
              onPress={() => navigation.navigate('DeviceList', { categoryId: item.id, categoryName: item.name })}
              style={styles.row}>
              <View style={[styles.icon, { backgroundColor: color + '22' }]}>
                <Text style={{ color, fontSize: 18 }}>📁</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                {item.description ? <Text style={styles.desc}>{item.description}</Text> : null}
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.count}>{item.device_count || 0}</Text>
                <Text style={styles.countUnit}>台设备</Text>
              </View>
              <TouchableOpacity onPress={() => onDelete(item)} hitSlop={8} style={{ padding: 6, marginLeft: 4 }}>
                <Text style={{ color: theme.text3 }}>删</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />

      <TouchableOpacity style={styles.fab}
        onPress={() => navigation.navigate('DeviceForm', { mode: 'create' })}>
        <Text style={styles.fabTxt}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, backgroundColor: theme.bg },
  center: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  stats: { backgroundColor: theme.primary, borderRadius: theme.radius, padding: 16, marginBottom: 16 },
  statsLabel: { color: '#fff', opacity: 0.85, fontSize: 11, letterSpacing: 0.5 },
  statBig: { color: '#fff', fontSize: 26, fontWeight: '700' },
  statUnit: { fontSize: 12, opacity: 0.85, fontWeight: '400' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, backgroundColor: theme.card, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.border },
  icon: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  name: { fontSize: 15, fontWeight: '600', color: theme.text },
  desc: { fontSize: 12, color: theme.text3, marginTop: 2 },
  count: { fontSize: 16, fontWeight: '700', color: theme.text },
  countUnit: { fontSize: 10.5, color: theme.text3 },
  fab: { position: 'absolute', right: 18, bottom: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center', elevation: 6 },
  fabTxt: { color: theme.onPrimary, fontSize: 28, fontWeight: '300' },
});
