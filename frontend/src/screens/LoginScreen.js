import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../components/Button';
import Field from '../components/Field';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { theme } from '../theme';

export default function LoginScreen() {
  const { login, expiryMessage, setExpiryMessage } = useAuth();
  const { show } = useToast();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Clear the JWT-expired banner after 6 s if user ignores it.
  useEffect(() => {
    if (expiryMessage) {
      const t = setTimeout(() => setExpiryMessage(null), 6000);
      return () => clearTimeout(t);
    }
  }, [expiryMessage, setExpiryMessage]);

  const submit = async () => {
    const e = {};
    if (!username.trim()) e.username = '请输入用户名';
    if (!password) e.password = '请输入密码';
    else if (password.length < 6) e.password = '密码至少 6 位';
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const data = await login(username, password);
      show(`欢迎回来，${data.user.username}`, 'success');
    } catch (err) {
      show(err.message || '登录失败', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.host}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <View style={styles.logo}><Text style={styles.logoTxt}>蜂</Text></View>
            <View>
              <Text style={styles.brand}>工蜂办公</Text>
              <Text style={styles.subBrand}>GongFeng · HR Console</Text>
            </View>
          </View>

          <Text style={styles.hero}>欢迎回来</Text>
          <Text style={styles.heroSub}>登录管理员账号，继续管理团队成员与办公设备资产。</Text>

          {expiryMessage ? (
            <View style={styles.banner}>
              <Text style={styles.bannerTxt}>⚠️  {expiryMessage}</Text>
            </View>
          ) : null}

          <View style={{ gap: 14, marginTop: 24 }}>
            <Field label="用户名" value={username} onChangeText={setUsername}
                   placeholder="admin" error={errors.username} />
            <Field label="密码"   value={password} onChangeText={setPassword}
                   placeholder="至少 6 位" secureTextEntry error={errors.password} />
            <Button title={loading ? '登录中…' : '登录'} loading={loading}
                    size="lg" onPress={submit} style={{ marginTop: 4 }} />
          </View>

          <View style={{ flex: 1 }} />

          <View style={styles.footer}>
            <Text style={styles.footTxt}>测试账号 · admin / admin123</Text>
            <Text style={styles.footTxt}>v1.0.0 · © 2026 工蜂办公</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  host: { flex: 1, backgroundColor: theme.bg },
  scroll: { flexGrow: 1, padding: 24, paddingTop: 40 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: { width: 44, height: 44, borderRadius: 12, backgroundColor: theme.primary, alignItems: 'center', justifyContent: 'center' },
  logoTxt: { color: theme.onPrimary, fontWeight: '800', fontSize: 20 },
  brand: { fontSize: 16, fontWeight: '700', color: theme.text, letterSpacing: 0.4 },
  subBrand: { fontSize: 11, color: theme.text3, marginTop: 1 },
  hero: { fontSize: 30, fontWeight: '700', color: theme.text, marginTop: 36, letterSpacing: -0.5 },
  heroSub: { marginTop: 8, fontSize: 14, color: theme.text2, lineHeight: 21 },
  banner: { marginTop: 18, padding: 12, borderRadius: theme.radiusSm, backgroundColor: theme.warnSoft },
  bannerTxt: { color: theme.warn, fontSize: 12.5, fontWeight: '500' },
  footer: { alignItems: 'center', gap: 4, paddingVertical: 16 },
  footTxt: { fontSize: 11.5, color: theme.text3 },
});
