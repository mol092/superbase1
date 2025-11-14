# 数据库设计文档

## 表结构说明

### 1. user_profiles (用户表)
- **id**: 用户ID，与Supabase auth.users表关联
- **email**: 用户邮箱
- **full_name**: 用户姓名
- **phone**: 用户电话
- **avatar_url**: 头像URL

### 2. menu_items (菜单项表)
- **name**: 菜品名称
- **description**: 菜品描述
- **price**: 价格
- **category**: 分类（主菜、汤类、主食等）
- **spicy_level**: 辣度等级（0-3）
- **preparation_time**: 准备时间
- **ingredients**: 食材列表
- **tags**: 标签列表

### 3. orders (订单表)
- **order_number**: 订单号
- **status**: 订单状态（pending, confirmed, preparing, ready, completed, cancelled）
- **total_amount**: 总金额
- **payment_status**: 支付状态
- **customer_notes**: 顾客备注

### 4. order_items (订单项表)
- **order_id**: 关联订单ID
- **menu_item_id**: 关联菜单项ID
- **quantity**: 数量
- **unit_price**: 单价
- **special_instructions**: 特殊要求

## 数据关系

```
user_profiles (1) ←→ (∞) orders (1) ←→ (∞) order_items (∞) ←→ (1) menu_items
```

## 安全策略

系统启用了行级安全（RLS）策略：
- 用户只能查看和修改自己的信息
- 所有用户都可以查看菜单
- 用户只能访问自己的订单数据

## 使用说明

1. 在Supabase控制台中执行 `schema.sql` 创建表结构
2. 根据需要调整安全策略
3. 示例数据已包含，可以直接使用