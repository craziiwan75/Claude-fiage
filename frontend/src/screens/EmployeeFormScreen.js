import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity } from 'react-native';

import Button from '../components/Button';
import Field from '../components/Field';
import { useToast } from '../contexts/ToastContext';
import { validateEmployee } from '../utils/validators';
import * as api from '../api/employees';
import { theme } from '../theme';

const DEPTS = ['研发中心', '市场部', '人力资源部', '财务部', '运营部', '设计部'];

export default function EmployeeFormScreen({ navigation, route }) {
  const { mode = 'create', id } = route.params || {};
  const isEdit = mode === 'edit';
  const { show } = useToast();

  const [form, setForm] = useState({ name: '', age: '', email: '', dept: '研发中心', title: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isEdit ? '编辑员工' : '新增员工' });
    if (isEdit && id) {
      (async () => {
        try {
          const e = await api.getEmployee(id);
          setForm({ name: e.name, age: String(e.age), email: e.email, dept: e.dept || '研发中心', title: e.title || '' });
        } catch (err) { show(err.message, 'error'); }
      })();
    }
  }, [isEdit, id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    const e = validateEmployee(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    try {
      const payload = { ...form, age: parseInt(form.age, 10) };
      if (isEdit) {
        await api.updateEmployee(id, payload);
        show('已保存修改', 'success');
      } else {
        await api.createEmployee(payload);
        show('员工已创建', 'success');
      }
      navigation.goBack();
    } catch (err) {
      show(err.message || '保存失败', 'error');
    } finally { setSaving(false); }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Field label="姓名 *" value={form.name} onChangeText={(v) => set('name', v)}
                 placeholder="请输入员工姓名" hint="1 ~ 20 个字符" error={errors.name} maxLength={20} />
          <Field label="年龄 *" value={form.age} onChangeText={(v) => set('age', v)}
                 placeholder="18 ~ 60" keyboardType="number-pad" error={errors.age} />
          <Field label="邮箱 *" value={form.email} onChangeText={(v) => set('email', v)}
                 placeholder="name@gongfeng.cn" keyboardType="email-address" error={errors.email} />

          <View style={{ gap: 6 }}>
            <Text style={styles.label}>部门</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {DEPTS.map(d => (
                <TouchableOpacity key={d} onPress={() => set('dept', d)} style={[
                  styles.chip,
                  form.dept === d && { backgroundColor: theme.primarySoft, borderColor: 'transparent' },
                ]}>
                  <Text style={[styles.chipTxt, form.dept === d && { color: theme.primary, fontWeight: '600' }]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Field label="职位 *" value={form.title} onChangeText={(v) => set('title', v)}
                 placeholder="如 后端工程师" error={errors.title} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 6 }}>
          <Button title="取消" kind="secondary" style={{ flex: 1 }} onPress={() => navigation.goBack()} />
          <Button title={saving ? '保存中…' : isEdit ? '保存修改' : '创建员工'}
                  loading={saving} style={{ flex: 2 }} onPress={submit} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 16, borderWidth: 1, borderColor: theme.border, gap: 14 },
  label: { fontSize: 13, color: theme.text2, fontWeight: '500' },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radiusSm, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card },
  chipTxt: { fontSize: 13, color: theme.text2 },
});
