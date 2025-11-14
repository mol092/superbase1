-- 自助点餐系统数据库表结构
-- 创建时间：2025-11-14

-- 用户表（继承Supabase auth.users表）
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 菜单项表
CREATE TABLE IF NOT EXISTS menu_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category TEXT NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    spicy_level INTEGER DEFAULT 0, -- 0: 不辣, 1: 微辣, 2: 中辣, 3: 重辣
    preparation_time INTEGER, -- 准备时间（分钟）
    calories INTEGER,
    ingredients TEXT[],
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES user_profiles(id),
    order_number TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, confirmed, preparing, ready, completed, cancelled
    total_amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_method TEXT, -- cash, card, wechat, alipay
    customer_name TEXT,
    customer_phone TEXT,
    customer_notes TEXT,
    estimated_prep_time INTEGER,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订单项表（订单与菜单项的关联表）
CREATE TABLE IF NOT EXISTS order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES menu_items(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- 创建更新时间触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例数据
INSERT INTO menu_items (name, description, price, category, spicy_level, preparation_time, calories, ingredients, tags) VALUES
('宫保鸡丁', '经典川菜，鸡肉鲜嫩，花生香脆', 42.00, '主菜', 2, 15, 320, ARRAY['鸡肉', '花生', '青椒', '红椒', '花椒'], ARRAY['川菜', '热门', '招牌']),
('麻婆豆腐', '麻辣鲜香，豆腐嫩滑', 28.00, '主菜', 3, 12, 280, ARRAY['豆腐', '牛肉末', '豆瓣酱', '花椒'], ARRAY['川菜', '素食', '麻辣']),
('糖醋排骨', '酸甜可口，排骨酥烂', 48.00, '主菜', 0, 20, 380, ARRAY['排骨', '白糖', '醋', '姜'], ARRAY['江浙菜', '甜酸', '热门']),
('鱼香肉丝', '鱼香风味，肉丝滑嫩', 36.00, '主菜', 1, 10, 300, ARRAY['猪肉', '木耳', '胡萝卜', '青椒'], ARRAY['川菜', '家常']),
('番茄鸡蛋汤', '清淡鲜美，营养丰富', 18.00, '汤类', 0, 8, 120, ARRAY['番茄', '鸡蛋', '葱花'], ARRAY['汤类', '清淡', '素食']),
('扬州炒饭', '米饭粒粒分明，配料丰富', 25.00, '主食', 0, 10, 350, ARRAY['米饭', '鸡蛋', '虾仁', '火腿', '青豆'], ARRAY['主食', '招牌']),
('凉拌黄瓜', '清爽开胃，脆嫩可口', 12.00, '凉菜', 0, 5, 80, ARRAY['黄瓜', '蒜末', '醋', '香油'], ARRAY['凉菜', '开胃', '素食']),
('可乐', '冰镇可口可乐', 8.00, '饮料', 0, 1, 150, ARRAY['可乐'], ARRAY['饮料', '碳酸']),
('酸梅汤', '酸甜解腻，传统饮品', 12.00, '饮料', 0, 2, 100, ARRAY['乌梅', '山楂', '冰糖'], ARRAY['饮料', '传统', '解腻']);

-- 启用行级安全策略
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 创建安全策略
-- 用户只能访问自己的个人信息
CREATE POLICY "用户只能访问自己的信息" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

-- 所有用户都可以查看菜单
CREATE POLICY "所有人可查看菜单" ON menu_items
    FOR SELECT USING (true);

-- 用户只能访问自己的订单
CREATE POLICY "用户只能访问自己的订单" ON orders
    FOR ALL USING (auth.uid() = user_id);

-- 通过订单关联限制订单项的访问
CREATE POLICY "通过订单限制订单项访问" ON order_items
    FOR ALL USING (EXISTS (
        SELECT 1 FROM orders 
        WHERE orders.id = order_items.order_id 
        AND orders.user_id = auth.uid()
    ));