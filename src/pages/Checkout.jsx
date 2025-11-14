import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreditCard, MapPin, User, Phone, MessageSquare } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const Checkout = () => {
  const { items, getTotalPrice, getTotalItems, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerNotes: '',
    paymentMethod: 'wechat'
  })
  const [loading, setLoading] = useState(false)

  // 如果购物车为空，重定向到菜单页
  if (items.length === 0) {
    navigate('/menu')
    return null
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const generateOrderNumber = () => {
    const timestamp = Date.now().toString()
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `ORD${timestamp}${random}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const orderNumber = generateOrderNumber()
      const totalAmount = getTotalPrice()
      
      // 创建订单
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user?.id || null,
          order_number: orderNumber,
          status: 'pending',
          total_amount: totalAmount,
          final_amount: totalAmount,
          payment_status: 'pending',
          payment_method: formData.paymentMethod,
          customer_name: formData.customerName,
          customer_phone: formData.customerPhone,
          customer_notes: formData.customerNotes
        })
        .select()
        .single()

      if (orderError) throw orderError

      // 创建订单项
      const orderItems = items.map(item => ({
        order_id: order.id,
        menu_item_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        special_instructions: item.specialInstructions
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) throw itemsError

      // 清空购物车
      clearCart()

      // 跳转到订单确认页面
      navigate('/orders', { 
        state: { 
          message: '订单提交成功！',
          orderNumber 
        }
      })

    } catch (error) {
      console.error('提交订单失败:', error)
      alert('订单提交失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">结算</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 订单信息 */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <User className="h-5 w-5 mr-2" />
              订单信息
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="请输入您的姓名"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  手机号码 *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleChange}
                  required
                  className="input"
                  placeholder="请输入手机号码"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  备注
                </label>
                <textarea
                  name="customerNotes"
                  value={formData.customerNotes}
                  onChange={handleChange}
                  className="input"
                  rows={3}
                  placeholder="如有特殊要求请在此说明"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  支付方式 *
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="wechat">微信支付</option>
                  <option value="alipay">支付宝</option>
                  <option value="cash">现金支付</option>
                  <option value="card">银行卡</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary"
              >
                {loading ? '提交中...' : '提交订单'}
              </button>
            </form>
          </div>
        </div>

        {/* 订单摘要 */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold mb-4">订单摘要</h2>
            
            <div className="space-y-3">
              {items.map((item) => (
                <div key={`${item.id}-${item.specialInstructions}`} className="flex justify-between py-2 border-b">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-600 ml-2">×{item.quantity}</span>
                    {item.specialInstructions && (
                      <p className="text-sm text-gray-500">{item.specialInstructions}</p>
                    )}
                  </div>
                  <span>¥{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between text-lg font-semibold">
                <span>总计：</span>
                <span>¥{getTotalPrice().toFixed(2)}</span>
              </div>
              <div className="text-sm text-gray-600 mt-2">
                共 {getTotalItems()} 件商品
              </div>
            </div>
          </div>

          {/* 商家信息 */}
          <div className="card p-6">
            <h3 className="font-semibold mb-3">商家信息</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>北京市朝阳区xxx街道123号</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                <span>400-123-4567</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 mr-2" />
                <span>营业时间：09:00 - 22:00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout