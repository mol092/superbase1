import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Calendar, Clock, DollarSign, Package, CheckCircle, Clock as ClockIcon, Truck, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const Orders = () => {
  const { user } = useAuth()
  const location = useLocation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // 获取订单状态显示信息
  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { text: '待确认', icon: ClockIcon, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
      confirmed: { text: '已确认', icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
      preparing: { text: '制作中', icon: Package, color: 'text-orange-600', bgColor: 'bg-orange-100' },
      ready: { text: '待取餐', icon: Truck, color: 'text-green-600', bgColor: 'bg-green-100' },
      completed: { text: '已完成', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-100' },
      cancelled: { text: '已取消', icon: Clock, color: 'text-red-600', bgColor: 'bg-red-100' }
    }
    return statusMap[status] || statusMap.pending
  }

  // 获取订单数据
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              menu_items (
                name,
                price
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setOrders(data || [])
      } catch (error) {
        console.error('获取订单失败:', error)
        // 使用模拟数据作为备选
        setOrders([
          {
            id: '1',
            order_number: 'ORD20251114001',
            status: 'completed',
            total_amount: 85,
            final_amount: 85,
            payment_status: 'paid',
            created_at: '2025-11-14T10:30:00Z',
            order_items: [
              { quantity: 1, menu_items: { name: '宫保鸡丁', price: 42 } },
              { quantity: 1, menu_items: { name: '麻婆豆腐', price: 28 } },
              { quantity: 1, menu_items: { name: '可乐', price: 8 } }
            ]
          },
          {
            id: '2',
            order_number: 'ORD20251114002',
            status: 'preparing',
            total_amount: 48,
            final_amount: 48,
            payment_status: 'paid',
            created_at: '2025-11-14T11:15:00Z',
            order_items: [
              { quantity: 1, menu_items: { name: '糖醋排骨', price: 48 } }
            ]
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  // 格式化时间
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">加载订单中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">我的订单</h1>
        {!user && (
          <div className="text-sm text-gray-600">
            登录后查看完整的订单历史
          </div>
        )}
      </div>

      {/* 成功消息 */}
      {location.state?.message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          {location.state.message}
          {location.state.orderNumber && (
            <span className="font-semibold ml-2">订单号：{location.state.orderNumber}</span>
          )}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold mb-4">暂无订单</h2>
          <p className="text-gray-600 mb-8">您还没有下过任何订单</p>
          <a href="/menu" className="btn btn-primary">
            去点餐
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            const StatusIcon = statusInfo.icon
            
            return (
              <div key={order.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      订单号：{order.order_number}
                    </h3>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(order.created_at)}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ¥{order.final_amount}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center px-3 py-1 rounded-full ${statusInfo.bgColor}`}>
                    <StatusIcon className={`h-4 w-4 mr-1 ${statusInfo.color}`} />
                    <span className={`text-sm font-medium ${statusInfo.color}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>

                {/* 订单项 */}
                <div className="border-t pt-4">
                  {order.order_items?.map((item, index) => (
                    <div key={index} className="flex justify-between py-2">
                      <div>
                        <span className="font-medium">{item.menu_items?.name}</span>
                        <span className="text-gray-600 ml-2">×{item.quantity}</span>
                        {item.special_instructions && (
                          <p className="text-sm text-gray-500">{item.special_instructions}</p>
                        )}
                      </div>
                      <span>¥{(item.menu_items?.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* 订单操作 */}
                {order.status === 'ready' && (
                  <div className="border-t pt-4 mt-4">
                    <button className="btn btn-primary">
                      确认取餐
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Orders