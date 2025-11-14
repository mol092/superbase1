import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Register = () => {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    phone: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // 验证密码匹配
    if (formData.password !== formData.confirmPassword) {
      setError('密码不匹配')
      setLoading(false)
      return
    }

    // 验证密码强度
    if (formData.password.length < 6) {
      setError('密码至少需要6位字符')
      setLoading(false)
      return
    }

    try {
      const { error } = await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        phone: formData.phone
      })
      
      if (error) {
        setError(error.message)
      } else {
        // 注册成功，跳转到登录页面
        navigate('/login', { 
          state: { 
            message: '注册成功！请登录您的账号。',
            email: formData.email 
          }
        })
      }
    } catch (err) {
      setError('注册失败，请重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto card p-8">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-primary-100 text-primary-600 rounded-full p-3">
            <UserPlus className="h-8 w-8" />
          </div>
        </div>
        <h1 className="text-2xl font-bold">创建账号</h1>
        <p className="text-gray-600 mt-2">注册您的点餐系统账号</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            姓名
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="input"
            placeholder="请输入您的姓名"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            邮箱地址
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="input"
            placeholder="请输入邮箱地址"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            手机号码
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="input"
            placeholder="请输入手机号码"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            密码
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="input pr-10"
              placeholder="请输入密码（至少6位）"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            确认密码
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="input"
            placeholder="请再次输入密码"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary"
        >
          {loading ? '注册中...' : '注册账号'}
        </button>
      </form>

      <div className="mt-6 text-center space-y-3">
        <Link to="/login" className="block text-primary-600 hover:text-primary-700">
          已有账号？立即登录
        </Link>
        <Link to="/" className="block text-gray-600 hover:text-gray-900">
          返回首页
        </Link>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">注册须知：</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 注册后您将能够保存订单历史</li>
          <li>• 支持在线支付和订单跟踪</li>
          <li>• 可以管理个人资料和收货地址</li>
        </ul>
      </div>
    </div>
  )
}

export default Register