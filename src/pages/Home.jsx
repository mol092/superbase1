import React from 'react'
import { Link } from 'react-router-dom'
import { Utensils, Clock, Star, Users } from 'lucide-react'

const Home = () => {
  const features = [
    {
      icon: Utensils,
      title: '丰富菜单',
      description: '涵盖各类中式美食，满足不同口味需求'
    },
    {
      icon: Clock,
      title: '快速点餐',
      description: '在线下单，减少等待时间，提高用餐效率'
    },
    {
      icon: Star,
      title: '品质保证',
      description: '精选食材，专业厨师，确保每一道菜品的品质'
    },
    {
      icon: Users,
      title: '贴心服务',
      description: '支持特殊要求，为您提供个性化的用餐体验'
    }
  ]

  return (
    <div className="space-y-16">
      {/* 英雄区域 */}
      <section className="text-center space-y-8">
        <div className="flex justify-center">
          <div className="bg-primary-100 text-primary-800 rounded-full p-4">
            <Utensils className="h-12 w-12" />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          欢迎来到
          <span className="text-primary-600"> 自助点餐系统</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          为您提供便捷、高效的自助点餐体验。在线浏览菜单、下单支付，享受美味佳肴。
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/menu" className="btn btn-primary text-lg px-8 py-3">
            开始点餐
          </Link>
          <Link to="/orders" className="btn btn-secondary text-lg px-8 py-3">
            查看订单
          </Link>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="card p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-100 text-primary-600 rounded-full p-3">
                <feature.icon className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* 推荐菜品 */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-8">今日推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: '宫保鸡丁', price: 42, description: '经典川菜，麻辣鲜香' },
            { name: '糖醋排骨', price: 48, description: '酸甜可口，排骨酥烂' },
            { name: '麻婆豆腐', price: 28, description: '麻辣鲜香，豆腐嫩滑' }
          ].map((dish, index) => (
            <div key={index} className="card p-6">
              <h3 className="text-xl font-semibold mb-2">{dish.name}</h3>
              <p className="text-gray-600 mb-4">{dish.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-primary-600">¥{dish.price}</span>
                <Link to="/menu" className="btn btn-primary">
                  点餐
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 营业信息 */}
      <section className="card p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">营业信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h3 className="font-semibold mb-2">营业时间</h3>
            <p className="text-gray-600">09:00 - 22:00</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">联系电话</h3>
            <p className="text-gray-600">400-123-4567</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">地址</h3>
            <p className="text-gray-600">北京市朝阳区xxx街道123号</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home