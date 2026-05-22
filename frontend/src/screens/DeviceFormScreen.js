import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';

import Field from '../components/Field';
import Button from '../components/Button';
import { useToast } from '../contexts/ToastContext';
import { validateDevice } from '../utils/validators';
import * as devApi from '../api/devices';
import * as catApi from '../api/categories';
import { theme } from '../theme';

const STATUSES = ['在用', '闲置', '维修', '库存'];

export default function DeviceFormScreen({ navigation, route }) {
  const { mode = 'create', id, categoryId } = route.params || {};
  const isEdit = mode === 'edit';
  const { show } = useToast();

  const [form, setForm] = useState({ name: '', model: '', category_id: categoryId || null, assignee: '', status: '在用' });
  const [errors, setErrors] = useState({});
  const [cats, setCats] = useState([]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({ title: isEdit ? '编辑设备' : '新增设备' });
    (async () => {
      try { setCats(await catApi.listCategories()); }
      catch (e) { show(e.message, 'error'); }
      if (isEdit && id) {
        try {
          const d = await devApi.getDevice(id);
          setForm({
            name: d.name, model: d.model || '', category_id: d.category_id,
            assignee: d.assignee || '', status: d.status,
          });
        } catch (e) { show(e.message, 'error'); }
      }
    })();
  }, [isEdit, id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async () => {
    const e = validateDevice(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSaving(true);
    try {
      if (isEdit) { await devApi.updateDevice(id, form); show('设备已更新', 'success'); }
      else { await devApi.createDevice(form); show('设备已添加', 'success'); }
      navigation.goBack();
    } catch (err) { show(err.message || '保存失败', 'error'); }
    finally { setSaving(false); }
  };

  const cur = cats.find(c => c.id === form.category_id);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Field label="设备名称 *" value={form.name} onChangeText={(v) => set('name', v)}
                 placeholder="如 MacBook Pro 14"
                 error={errors.name} maxLength={100} />
          <Field label="型号" value={form.model} onChangeText={(v) => set('model', v)}
                 placeholder="可选，如 M3 Pro / 18GB" />

          <View style={{ gap: 6 }}>
            <Text style={styles.label}>所属分类 *</Text>
            <TouchableOpacity onPress={() => setPickerOpen(true)} style={[
              styles.picker, { borderColor: errors.category_id ? theme.error : theme.border },
            ]}>
              <Text style={{ flex: 1, color: cur ? theme.text : theme.text3, fontSize: 15 }}>
                {cur ? cur.name : '请选择分类'}
              </Text>
              <Text style={{ color: theme.text3 }}>›</Text>
            </TouchableOpacity>
            {errors.category_id ? <Text style={{ fontSize: 12, color: theme.error }}>{errors.category_id}</Text> : null}
          </View>

          <Field label="使用人" value={form.assignee} onChangeText={(v) => set('assignee', v)}
                 placeholder="部门 / 姓名（可选）" />

          <View style={{ gap: 6 }}>
            <Text style={styles.label}>状态</Text>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {STATUSES.map(s => (
                <TouchableOpacity key={s} onPress={() => set('status', s)} style={[
                  styles.statusChip,
                  form.status === s && { backgroundColor: theme.primarySoft, borderColor: 'transparent' },
                ]}>
                  <Text style={[styles.statusTxt, form.status === s && { color: theme.primary, fontWeight: '600' }]}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <Button title="取消" kind="secondary" style={{ flex: 1 }} onPress={() => navigation.goBack()} />
          <Button title={saving ? '保存中…' : isEdit ? '保存修改' : '创建设备'}
                  loading={saving} style={{ flex: 2 }} onPress={submit} />
        </View>
      </ScrollView>

      <Modal visible={pickerOpen} transparent animationType="slide" onRequestClose={() => setPickerOpen(false)}>
        <TouchableOpacity activeOpacity={1} style={styles.modalBg} onPress={() => setPickerOpen(false)}>
          <TouchableOpacity activeOpacity={1} style={styles.sheet} onPress={() => {}}>
            <View style={styles.grabber} />
            <Text style={styles.sheetTitle}>选择分类</Text>
            <FlatList
              data={cats}
              keyExtractor={(c) => String(c.id)}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { set('category_id', item.id); setPickerOpen(false); }}
                                  style={styles.opt}>
                  <Text style={{ flex: 1, color: theme.text, fontSize: 15 }}>{item.name}</Text>
                  <Text style={{ color: theme.text3, fontSize: 12 }}>{item.device_count} 台</Text>
                  {form.category_id === item.id ? <Text style={{ color: theme.primary, marginLeft: 8 }}>✓</Text> : null}
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: theme.card, borderRadius: theme.radius, padding: 16, borderWidth: 1, borderColor: theme.border, gap: 14 },
  label: { fontSize: 13, color: theme.text2, fontWeight: '500' },
  picker: { height: 44, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: theme.radiusSm, backgroundColor: theme.card },
  statusChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: theme.radiusSm, borderWidth: 1, borderColor: theme.border, backgroundColor: theme.card },
  statusTxt: { fontSize: 13, color: theme.text2 },
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: theme.card, borderTopLeftRadius: theme.radiusLg, borderTopRightRadius: theme.radiusLg, paddingBottom: 24, maxHeight: '60%' },
  grabber: { width: 36, height: 4, borderRadius: 2, backgroundColor: theme.border, alignSelf: 'center', marginTop: 8, marginBottom: 12 },
  sheetTitle: { paddingHorizontal: 20, fontSize: 13, color: theme.text3, marginBottom: 8 },
  opt: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: theme.divider },
});
