import React, { useState, useEffect } from 'react'
import { Plus, Minus, Search, Filter } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { supabase } from '../lib/supabase'

const Menu = () => {
  const { addItem } = useCart()
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [specialInstructions, setSpecialInstructions] = useState({})

  // 获取菜单数据
  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*')
          .eq('is_available', true)
          .order('category')
          .order('name')

        if (error) throw error
        setMenuItems(data || [])
      } catch (error) {
        console.error('获取菜单数据失败:', error)
        // 使用模拟数据作为备选
        setMenuItems([
          {
            id: '1',
            name: '宫保鸡丁',
            description: '经典川菜，鸡肉鲜嫩，花生香脆',
            price: 42,
            category: '主菜',
            spicy_level: 2,
            ingredients: ['鸡肉', '花生', '青椒'],
            tags: ['川菜', '热门']
          },
          {
            id: '2',
            name: '麻婆豆腐',
            description: '麻辣鲜香，豆腐嫩滑',
            price: 28,
            category: '主菜',
            spicy_level: 3,
            ingredients: ['豆腐', '牛肉末', '豆瓣酱'],
            tags: ['川菜', '麻辣']
          },
          {
            id: '3',
            name: '糖醋排骨',
            description: '酸甜可口，排骨酥烂',
            price: 48,
            category: '主菜',
            spicy_level: 0,
            ingredients: ['排骨', '白糖', '醋'],
            tags: ['江浙菜', '甜酸']
          },
          {
            id: '4',
            name: '番茄鸡蛋汤',
            description: '清淡鲜美，营养丰富',
            price: 18,
            category: '汤类',
            spicy_level: 0,
            ingredients: ['番茄', '鸡蛋'],
            tags: ['汤类', '清淡']
          },
          {
            id: '5',
            name: '扬州炒饭',
            description: '米饭粒粒分明，配料丰富',
            price: 25,
            category: '主食',
            spicy_level: 0,
            ingredients: ['米饭', '鸡蛋', '虾仁'],
            tags: ['主食', '招牌']
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  // 获取所有分类
  const categories = ['全部', ...new Set(menuItems.map(item => item.category))]

  // 过滤菜单项
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === '全部' || item.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // 按分类分组
  const groupedItems = filteredItems.reduce((groups, item) => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category].push(item)
    return groups
  }, {})

  const handleAddToCart = (item) => {
    const instructions = specialInstructions[item.id] || ''
    addItem(item, 1, instructions)
    setSpecialInstructions(prev => ({ ...prev, [item.id]: '' }))
  }

  const updateSpecialInstructions = (itemId, instructions) => {
    setSpecialInstructions(prev => ({
      ...prev,
      [itemId]: instructions
    }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">加载菜单中...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* 搜索和筛选 */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="搜索菜品..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>

          {/* 分类筛选 */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input"
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 菜单列表 */}
      <div className="space-y-8">
        {Object.keys(groupedItems).length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🍽️</div>
            <p className="text-gray-600">未找到相关菜品</p>
          </div>
        ) : (
          Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-2xl font-bold border-b pb-2">{category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <div key={item.id} className="card p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>

                    {/* 菜品信息 */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">辣度:</span>
                        <span>{['不辣', '微辣', '中辣', '重辣'][item.spicy_level]}</span>
                      </div>
                      {item.ingredients && (
                        <div className="text-sm">
                          <span className="text-gray-500">食材:</span>
                          <span className="ml-2">{item.ingredients.join(', ')}</span>
                        </div>
                      )}
                    </div>

                    {/* 价格和操作 */}
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-primary-600">¥{item.price}</span>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="btn btn-primary"
                      >
                        <Plus className="h-4 w-4" />
                        加入购物车
                      </button>
                    </div>

                    {/* 特殊要求 */}
                    <div>
                      <textarea
                        placeholder="特殊要求（如：少辣、不加葱等）"
                        value={specialInstructions[item.id] || ''}
                        onChange={(e) => updateSpecialInstructions(item.id, e.target.value)}
                        className="input text-sm resize-none"
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Menu