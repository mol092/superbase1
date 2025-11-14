import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { User, Mail, Phone, Save, Edit } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: ''
  })

  // 如果用户未登录，重定向到登录页
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // 获取用户资料
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') {
          throw error
        }

        const profileData = data || {
          id: user.id,
          email: user.email,
          full_name: '',
          phone: '',
          created_at: new Date().toISOString()
        }

        setProfile(profileData)
        setFormData({
          full_name: profileData.full_name || '',
          phone: profileData.phone || '',
          email: profileData.email || user.email
        })
      } catch (error) {
        console.error('获取用户资料失败:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const { error } = await updateProfile({
        full_name: formData.full_name,
        phone: formData.phone
      })

      if (error) throw error

      // 更新本地状态
      setProfile(prev => ({
        ...prev,
        ...formData
      }))
      setEditing(false)
    } catch (error) {
      console.error('保存资料失败:', error)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-gray-600">加载中...</div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">个人资料</h1>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold flex items-center">
            <User className="h-5 w-5 mr-2" />
            基本信息
          </h2>
          
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="btn btn-secondary flex items-center"
            >
              <Edit className="h-4 w-4 mr-2" />
              编辑资料
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  setEditing(false)
                  setFormData({
                    full_name: profile.full_name || '',
                    phone: profile.phone || '',
                    email: profile.email
                  })
                }}
                className="btn btn-secondary"
              >
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn btn-primary flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? '保存中...' : '保存'}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* 邮箱地址 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              邮箱地址
            </label>
            {editing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled
                className="input bg-gray-100"
              />
            ) : (
              <p className="text-gray-900">{profile.email}</p>
            )}
          </div>

          {/* 姓名 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              姓名
            </label>
            {editing ? (
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="input"
                placeholder="请输入您的姓名"
              />
            ) : (
              <p className="text-gray-900">{profile.full_name || '未设置'}</p>
            )}
          </div>

          {/* 手机号码 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              手机号码
            </label>
            {editing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="input"
                placeholder="请输入手机号码"
              />
            ) : (
              <p className="text-gray-900">{profile.phone || '未设置'}</p>
            )}
          </div>

          {/* 注册时间 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              注册时间
            </label>
            <p className="text-gray-900">
              {new Date(profile.created_at).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* 订单统计 */}
      <div className="card p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">订单统计</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">5</div>
            <div className="text-sm text-gray-600">总订单数</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">3</div>
            <div className="text-sm text-gray-600">已完成</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">1</div>
            <div className="text-sm text-gray-600">进行中</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">1</div>
            <div className="text-sm text-gray-600">待评价</div>
          </div>
        </div>
      </div>

      {/* 快捷操作 */}
      <div className="card p-6 mt-6">
        <h2 className="text-xl font-semibold mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/orders" className="btn btn-secondary text-center">
            查看订单
          </a>
          <a href="/menu" className="btn btn-secondary text-center">
            继续点餐
          </a>
          <a href="/" className="btn btn-primary text-center">
            返回首页
          </a>
        </div>
      </div>
    </div>
  )
}

export default Profile