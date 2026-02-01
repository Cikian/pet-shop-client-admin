# 需求文档

## 介绍

电商网站管理后台系统，用于管理商品、分类、SKU、规格等电商核心数据。系统基于Vue3+Vite构建，提供现代化、简洁、年轻、充满活力的用户界面。

## 术语表

- **System**: 电商管理后台系统
- **Admin_User**: 管理员用户
- **Product**: 商品
- **Category**: 商品分类
- **SKU**: 库存单元（Stock Keeping Unit）
- **Spec_Key**: 规格键（规格类型）
- **Spec_Value**: 规格值
- **Product_Image**: 商品附图
- **Access_Token**: 访问令牌
- **Store**: Vuex/Pinia状态管理
- **Local_Storage**: 浏览器本地存储

## 需求

### 需求 1: 用户认证与授权

**用户故事:** 作为管理员，我希望能够安全地登录系统，以便访问管理功能。

#### 验收标准

1. WHEN 管理员提供有效的用户名和密码 THEN THE System SHALL 验证凭据并返回访问令牌
2. WHEN 登录成功 THEN THE System SHALL 将访问令牌存储到Store和本地存储中
3. WHEN 登录成功 THEN THE System SHALL 将用户信息存储到Store中
4. WHEN 访问令牌不存在 THEN THE System SHALL 重定向用户到登录页面
5. WHEN 响应头包含new-token THEN THE System SHALL 用新令牌替换现有令牌

### 需求 2: HTTP请求封装与拦截

**用户故事:** 作为开发者，我希望有统一的HTTP请求处理机制，以便简化API调用和处理认证。

#### 验收标准

1. THE System SHALL 提供封装的HTTP方法（getAction、postAction、putAction、deleteAction）
2. WHEN 发送请求 THEN THE System SHALL 自动添加Authorization请求头
3. WHEN 响应包含new-token头 THEN THE System SHALL 自动更新本地和Store中的令牌
4. WHEN API返回Result对象 THEN THE System SHALL 正确解析result属性中的数据

### 需求 3: 商品分类管理

**用户故事:** 作为管理员，我希望能够管理商品分类，以便组织商品结构。

#### 验收标准

1. WHEN 管理员访问分类列表 THEN THE System SHALL 显示分页的分类数据
2. WHEN 管理员创建新分类 THEN THE System SHALL 验证分类信息并保存
3. WHEN 管理员编辑分类 THEN THE System SHALL 更新分类信息
4. WHEN 管理员删除分类 THEN THE System SHALL 移除分类记录
5. WHEN 管理员搜索分类 THEN THE System SHALL 根据条件过滤结果

### 需求 4: 规格管理

**用户故事:** 作为管理员，我希望能够管理商品规格键和规格值，以便为商品定义属性。

#### 验收标准

1. WHEN 管理员创建规格键 THEN THE System SHALL 保存规格键信息（名称、输入类型、排序）
2. WHEN 管理员为规格键添加规格值 THEN THE System SHALL 关联规格值到对应规格键
3. WHEN 规格键的输入类型为image THEN THE System SHALL 支持规格值的图片上传
4. WHEN 管理员删除规格键 THEN THE System SHALL 检查是否有关联的规格值
5. THE System SHALL 支持规格的排序功能

### 需求 5: 商品管理

**用户故事:** 作为管理员，我希望能够管理商品信息，以便维护商品目录。

#### 验收标准

1. WHEN 管理员创建商品 THEN THE System SHALL 保存商品基本信息
2. WHEN 管理员编辑商品 THEN THE System SHALL 更新商品信息
3. WHEN 管理员删除商品 THEN THE System SHALL 软删除商品记录
4. WHEN 管理员查看商品列表 THEN THE System SHALL 显示分页的商品数据
5. WHEN 管理员搜索商品 THEN THE System SHALL 根据条件过滤商品

### 需求 6: 商品附图管理

**用户故事:** 作为管理员，我希望能够为商品添加多张图片，以便展示商品详情。

#### 验收标准

1. WHEN 管理员为商品添加图片 THEN THE System SHALL 关联图片到对应商品
2. WHEN 管理员上传图片 THEN THE System SHALL 验证图片格式和大小
3. WHEN 管理员设置图片排序 THEN THE System SHALL 按排序显示图片
4. WHEN 管理员删除图片 THEN THE System SHALL 移除图片记录
5. THE System SHALL 支持图片的启用/禁用状态管理

### 需求 7: SKU管理

**用户故事:** 作为管理员，我希望能够为商品创建不同的SKU，以便管理商品的不同规格组合。

#### 验收标准

1. WHEN 管理员为商品创建SKU THEN THE System SHALL 生成唯一的SKU编码
2. WHEN 管理员设置SKU价格和库存 THEN THE System SHALL 保存价格和库存信息
3. WHEN 管理员设置库存预警值 THEN THE System SHALL 支持库存预警功能
4. WHEN 管理员标记默认SKU THEN THE System SHALL 确保每个商品只有一个默认SKU
5. THE System SHALL 支持SKU的批量操作

### 需求 8: SKU规格关系管理

**用户故事:** 作为管理员，我希望能够为SKU设置规格组合，以便明确每个SKU的属性。

#### 验收标准

1. WHEN 管理员为SKU选择规格组合 THEN THE System SHALL 创建SKU与规格的关联关系
2. WHEN 管理员修改SKU规格 THEN THE System SHALL 更新关联关系
3. WHEN 管理员删除SKU THEN THE System SHALL 同时删除相关的规格关系
4. THE System SHALL 验证规格组合的唯一性
5. THE System SHALL 支持规格组合的可视化展示

### 需求 9: 综合商品添加流程

**用户故事:** 作为管理员，我希望能够在一个页面中完成商品的完整创建，包括基本信息、图片、SKU和规格设置。

#### 验收标准

1. WHEN 管理员访问商品添加页面 THEN THE System SHALL 提供分步骤的表单界面
2. WHEN 管理员填写商品基本信息 THEN THE System SHALL 实时验证输入数据
3. WHEN 管理员添加商品图片 THEN THE System SHALL 支持多图片上传和排序
4. WHEN 管理员创建SKU THEN THE System SHALL 根据选择的规格自动生成SKU组合
5. WHEN 管理员保存商品 THEN THE System SHALL 原子性地保存所有相关数据

### 需求 10: 用户界面设计

**用户故事:** 作为管理员，我希望使用现代化、简洁的界面，以便高效地完成管理任务。

#### 验收标准

1. THE System SHALL 提供响应式的用户界面设计
2. THE System SHALL 使用现代化的UI组件库
3. THE System SHALL 提供直观的导航和操作流程
4. THE System SHALL 支持深色/浅色主题切换
5. THE System SHALL 在移动设备上正常显示和操作