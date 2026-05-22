# 工蜂办公 · 前端 (React Native / Expo)

## 启动

```bash
# 1. 安装依赖
npm install            # 或者 yarn

# 2. 启动 Expo dev server
npm start

# 3. 在另一台终端选择平台
npm run ios            # iOS Simulator (macOS)
npm run android        # Android Emulator
npm run web            # 浏览器（调试用）
# 或者扫码用 Expo Go 真机调试
```

## 配置后端地址

修改 `app.json` -> `expo.extra.apiBaseUrl`：

| 运行环境          | 推荐地址                          |
| ----------------- | --------------------------------- |
| Android 模拟器    | `http://10.0.2.2:5000`          |
| iOS 模拟器        | `http://localhost:5000`         |
| 真机 / Expo Go    | `http://<电脑LAN-IP>:5000`      |

> Expo 不再支持 Node 的 `process.env`，所以放在 `app.json` 而不是 `.env`。

## 目录结构

```
src/
├── api/                # axios 实例 + 接口封装
│   ├── client.js       # baseURL + JWT 拦截器 + 统一响应解包 + 401 自动登出
│   ├── auth.js
│   ├── employees.js
│   ├── categories.js
│   └── devices.js
├── contexts/
│   ├── AuthContext.js  # 用户 / 令牌 / 401 自动跳登录
│   └── ToastContext.js # 全局 Toast
├── navigation/
│   ├── RootNavigator.js   # AuthStack / AppStack 切换
│   ├── AuthStack.js
│   └── AppStack.js        # Tab(员工 / 设备 / 我的) + 内嵌 Stack
├── screens/
│   ├── LoginScreen.js
│   ├── EmployeeListScreen.js     # FlatList + 下拉刷新 + FAB + 删除 Alert
│   ├── EmployeeDetailScreen.js
│   ├── EmployeeFormScreen.js     # 表单校验
│   ├── CategoryListScreen.js
│   ├── DeviceListScreen.js
│   ├── DeviceFormScreen.js       # 含分类下拉 (BottomSheet Modal)
│   └── ProfileScreen.js
├── components/
│   ├── Button.js
│   ├── Field.js
│   ├── EmptyState.js
│   └── Pill.js
├── utils/
│   └── validators.js
└── theme.js
```

## 关键能力对应考点

| 考点                                | 实现位置                                                |
| ----------------------------------- | ------------------------------------------------------- |
| FlatList + 下拉刷新                 | `EmployeeListScreen.js` 中 `FlatList` + `RefreshControl` |
| 表单校验                            | `utils/validators.js` + Field 的 `error` 状态       |
| axios + 请求拦截器                  | `api/client.js` 中 `request` 拦截器自动加 JWT       |
| 401 自动跳登录                      | `api/client.js` 响应拦截器 + AuthContext 的 onUnauthorized |
| AsyncStorage 存令牌                 | `api/client.js` 的 tokenStore                         |
| React Navigation 路由守卫           | `RootNavigator.js` 根据 user 切换栈                  |
| 删除二次确认                        | `Alert.alert` 用于所有删除操作                        |
| Toast / Alert / ActivityIndicator   | ToastContext + Button `loading`                       |
| 下拉选择器                          | `DeviceFormScreen` 自定义 BottomSheet Modal           |
