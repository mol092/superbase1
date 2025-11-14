import React from 'react'
import { Link } from 'react-router-dom'
import { Utensils, Phone, MapPin, Clock } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 品牌信息 */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Utensils className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold">自助点餐系统</span>
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              为您提供便捷、高效的自助点餐体验。在线浏览菜单、下单支付，享受美味佳肴。
            </p>
            <div className="flex items-center space-x-4 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>400-123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>09:00 - 22:00</span>
              </div>
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">快速导航</h3>
            <ul className="space-y-2">
              <li><Link to="/menu" className="text-gray-300 hover:text-white transition-colors">菜单浏览</Link></li>
              <li><Link to="/orders" className="text-gray-300 hover:text-white transition-colors">我的订单</Link></li>
              <li><Link to="/cart" className="text-gray-300 hover:text-white transition-colors">购物车</Link></li>
            </ul>
          </div>

          {/* 联系信息 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">联系我们</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>北京市朝阳区xxx街道123号</span>
              </div>
              <div>营业时间：09:00 - 22:00</div>
              <div>客服邮箱：service@restaurant.com</div>
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 自助点餐系统. 保留所有权利.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer