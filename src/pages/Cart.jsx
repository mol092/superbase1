import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, Minus, Trash2, ShoppingBag } from 'lucide-react'
import { useCart } from '../contexts/CartContext'

const Cart = () => {
  const { items, updateQuantity, removeItem, getTotalPrice, getTotalItems, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 text-6xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold mb-4">购物车为空</h2>
        <p className="text-gray-600 mb-8">您还没有添加任何商品到购物车</p>
        <Link to="/menu" className="btn btn-primary">
          <ShoppingBag className="h-4 w-4 mr-2" />
          去点餐
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">购物车</h1>
        <button
          onClick={clearCart}
          className="text-red-600 hover:text-red-700 font-medium"
        >
          清空购物车
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={`${item.id}-${item.specialInstructions}`} className="card p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-600">¥{item.price}</p>
                {item.specialInstructions && (
                  <p className="text-sm text-gray-500 mt-1">
                    备注：{item.specialInstructions}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <span className="font-semibold w-20 text-right">
                  ¥{(item.price * item.quantity).toFixed(2)}
                </span>

                <button
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-red-400 hover:text-red-600"
                  title="删除"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-6 mt-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">总计：</span>
          <span className="text-2xl font-bold text-primary-600">
            ¥{getTotalPrice().toFixed(2)}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-6">
          共 {getTotalItems()} 件商品
        </div>

        <div className="flex space-x-4">
          <Link to="/menu" className="flex-1 btn btn-secondary">
            继续点餐
          </Link>
          <Link to="/checkout" className="flex-1 btn btn-primary">
            去结算
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart