export function validateEmployee({ name, age, email, title }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = '姓名不能为空';
  else if (name.length > 20) errors.name = '姓名不超过 20 字符';

  const ageN = parseInt(age, 10);
  if (!age) errors.age = '年龄不能为空';
  else if (Number.isNaN(ageN) || ageN < 18 || ageN > 60) errors.age = '年龄需在 18 ~ 60 之间';

  if (!email || !email.trim()) errors.email = '邮箱不能为空';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = '邮箱格式错误';

  if (!title || !title.trim()) errors.title = '职位不能为空';

  return errors;
}

export function validateDevice({ name, category_id }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = '设备名称不能为空';
  if (!category_id) errors.category_id = '请选择所属分类';
  return errors;
}
