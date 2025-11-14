import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext({})

export const useCart = () => {
  return useContext(CartContext)
}

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([])
  const [isOpen, setIsOpen] = useState(false)

  // 从本地存储加载购物车
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setItems(JSON.parse(savedCart))
    }
  }, [])

  // 保存购物车到本地存储
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items))
  }, [items])

  // 添加商品到购物车
  const addItem = (menuItem, quantity = 1, specialInstructions = '') => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item => item.id === menuItem.id && item.specialInstructions === specialInstructions
      )

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex].quantity += quantity
        return updatedItems
      } else {
        return [...prevItems, {
          ...menuItem,
          quantity,
          specialInstructions,
          addedAt: new Date().toISOString()
        }]
      }
    })
    setIsOpen(true)
  }

  // 更新商品数量
  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  // 移除商品
  const removeItem = (itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId))
  }

  // 清空购物车
  const clearCart = () => {
    setItems([])
    setIsOpen(false)
  }

  // 计算总价
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  // 计算总数量
  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0)
  }

  const value = {
    items,
    isOpen,
    setIsOpen,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}