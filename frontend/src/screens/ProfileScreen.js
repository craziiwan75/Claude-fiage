import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { theme } from '../theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { show } = useToast();

  const onLogout = () => Alert.alert('确认退出登录？', '', [
    { text: '取消', style: 'cancel' },
    { text: '退出', style: 'destructive', onPress: async () => { await logout(); show('已退出登录', 'info'); } },
  ]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.bg }} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
        <Text style={styles.h1}>我的</Text>

        <View style={styles.userCard}>
          <View style={styles.avatar}><Text style={styles.avatarTxt}>{(user?.username || 'A').slice(0,1).toUpperCase()}</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.name}>{user?.username || '管理员'}</Text>
            <Text style={styles.role}>admin@gongfeng.cn · {user?.role || 'admin'}</Text>
          </View>
          <View style={styles.badge}><Text style={{ color: theme.onPrimary, fontSize: 11 }}>ADMIN</Text></View>
        </View>

        <Section title="关于">
          <Row label="版本信息" value="1.0.0" />
          <Row label="后端地址" value="见 app.json · expo.extra.apiBaseUrl" />
          <Row label="使用条款" value="" />
        </Section>

        <Button title="退出登录" kind="secondary" onPress={onLogout} style={{ marginTop: 8 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.k}>{label}</Text>
      <Text style={styles.v}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 28, fontWeight: '700', color: theme.text, letterSpacing: -0.5 },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 18, borderRadius: theme.radius, backgroundColor: theme.primary },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarTxt: { color: theme.onPrimary, fontSize: 22, fontWeight: '700' },
  name: { color: theme.onPrimary, fontSize: 18, fontWeight: '700' },
  role: { color: theme.onPrimary, opacity: 0.85, fontSize: 12, marginTop: 2 },
  badge: { backgroundColor: 'rgba(255,255,255,0.22)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  sectionTitle: { fontSize: 11, color: theme.text3, fontWeight: '600', letterSpacing: 0.5, paddingLeft: 4, marginTop: 8, marginBottom: 6, textTransform: 'uppercase' },
  card: { backgroundColor: theme.card, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.border, overflow: 'hidden' },
  row: { flexDirection: 'row', padding: 14, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.divider },
  k: { color: theme.text, fontSize: 14 },
  v: { marginLeft: 'auto', color: theme.text3, fontSize: 12.5 },
});
