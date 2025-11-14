import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, Utensils } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useCart } from '../contexts/CartContext'

const Header = () => {
  const { user, signOut } = useAuth()
  const { getTotalItems, setIsOpen } = useCart()
  const location = useLocation()

  const handleSignOut = async () => {
    await signOut()
  }

  const navigation = [
    { name: '首页', href: '/', current: location.pathname === '/' },
    { name: '菜单', href: '/menu', current: location.pathname === '/menu' },
    { name: '我的订单', href: '/orders', current: location.pathname === '/orders' },
  ]

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Utensils className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">自助点餐</span>
          </Link>

          {/* 导航菜单 */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  item.current
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* 右侧操作 */}
          <div className="flex items-center space-x-4">
            {/* 购物车 */}
            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-gray-500 hover:text-gray-900 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* 用户菜单 */}
            {user ? (
              <div className="flex items-center space-x-2">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user.email}</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-500 hover:text-gray-900 transition-colors"
                  title="退出登录"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  登录
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary"
                >
                  注册
                </Link>
              </div>
            )}

            {/* 移动端菜单按钮 */}
            <button className="md:hidden p-2 text-gray-500 hover:text-gray-900">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header