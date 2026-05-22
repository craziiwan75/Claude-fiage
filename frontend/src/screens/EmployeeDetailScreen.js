import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import Button from '../components/Button';
import Pill from '../components/Pill';
import { useToast } from '../contexts/ToastContext';
import * as api from '../api/employees';
import { theme } from '../theme';

export default function EmployeeDetailScreen({ navigation, route }) {
  const { id } = route.params;
  const { show } = useToast();
  const [emp, setEmp] = useState(null);

  useEffect(() => {
    (async () => {
      try { setEmp(await api.getEmployee(id)); }
      catch (e) { show(e.message, 'error'); navigation.goBack(); }
    })();
  }, [id]);

  if (!emp) return <View style={styles.center}><ActivityIndicator color={theme.primary} /></View>;

  const onDelete = () => Alert.alert(
    '删除员工？', `「${emp.name}」的所有数据将被永久删除。`,
    [
      { text: '取消', style: 'cancel' },
      { text: '删除', style: 'destructive', onPress: async () => {
        try {
          await api.deleteEmployee(emp.id);
          show('已删除', 'success');
          navigation.goBack();
        } catch (e) { show(e.message, 'error'); }
      }},
    ],
  );

  const row = (label, value, mono) => (
    <View style={styles.row}>
      <Text style={styles.k}>{label}</Text>
      <Text style={[styles.v, mono && { fontFamily: 'Courier' }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.host} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
      <View style={styles.hero}>
        <View style={styles.avatar}><Text style={styles.avatarTxt}>{emp.name.slice(0,1)}</Text></View>
        <Text style={styles.name}>{emp.name}</Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {emp.dept ? <Pill tone="primary">{emp.dept}</Pill> : null}
          {emp.title ? <Pill tone="neutral">{emp.title}</Pill> : null}
        </View>
      </View>

      <Text style={styles.sectionTitle}>基本信息</Text>
      <View style={styles.card}>
        {row('员工 ID', `#${emp.id}`, true)}
        {row('姓名', emp.name)}
        {row('年龄', `${emp.age} 岁`)}
        {row('邮箱', emp.email, true)}
      </View>

      <Text style={styles.sectionTitle}>任职信息</Text>
      <View style={styles.card}>
        {row('部门', emp.dept || '-')}
        {row('职位', emp.title || '-')}
        {row('创建时间', emp.created_at || '-', true)}
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
        <Button title="编辑资料" kind="secondary" style={{ flex: 1 }}
                onPress={() => navigation.navigate('EmployeeForm', { mode: 'edit', id: emp.id })} />
        <Button title="删除" kind="danger" style={{ flex: 1 }} onPress={onDelete} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, backgroundColor: theme.bg },
  center: { flex: 1, backgroundColor: theme.bg, alignItems: 'center', justifyContent: 'center' },
  hero: { padding: 20, alignItems: 'center', gap: 8, backgroundColor: theme.card, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.border },
  avatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: theme.primarySoft, alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: theme.primary, fontWeight: '700', fontSize: 26 },
  name: { fontSize: 20, fontWeight: '700', color: theme.text },
  sectionTitle: { fontSize: 11, color: theme.text3, fontWeight: '600', letterSpacing: 0.5, marginTop: 8, paddingLeft: 4, textTransform: 'uppercase' },
  card: { backgroundColor: theme.card, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  row: { flexDirection: 'row', padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.divider },
  k: { color: theme.text2, fontSize: 14 },
  v: { marginLeft: 'auto', color: theme.text, fontSize: 14, fontWeight: '500' },
});
