import React from 'react'
import { X, Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { Link } from 'react-router-dom'

const CartSidebar = () => {
  const { 
    items, 
    isOpen, 
    setIsOpen, 
    updateQuantity, 
    removeItem, 
    getTotalPrice, 
    getTotalItems 
  } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* 背景遮罩 */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={() => setIsOpen(false)}
      />
      
      {/* 侧边栏 */}
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="relative w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl">
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-4 py-6 border-b">
              <h2 className="text-lg font-semibold">购物车</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* 购物车内容 */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <div className="text-4xl mb-4">🛒</div>
                  <p>购物车为空</p>
                </div>
              ) : (
                <div className="p-4 space-y-4">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.specialInstructions}`} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-500">¥{item.price}</p>
                        {item.specialInstructions && (
                          <p className="text-xs text-gray-400 mt-1">备注：{item.specialInstructions}</p>
                        )}
                      </div>
                      
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
                        
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-red-400 hover:text-red-600 ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 底部结算 */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>总计：</span>
                  <span>¥{getTotalPrice().toFixed(2)}</span>
                </div>
                
                <Link
                  to="/checkout"
                  className="w-full btn btn-primary"
                  onClick={() => setIsOpen(false)}
                >
                  去结算 ({getTotalItems()} 件商品)
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartSidebar