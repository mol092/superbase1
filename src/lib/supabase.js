import { createClient } from '@supabase/supabase-js'

// 更新为新的Supabase配置
const supabaseUrl = 'https://cghbobwnejjtzrduwety.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnaGJvYnduZWpqdHpyZHV3ZXR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0OTc1NzMsImV4cCI6MjA3ODA3MzU3M30.M8FyiW9mF1xaZoem75r6vBmVmtVMTnkLwfX1UPOw05Q'

// 创建Supabase客户端
export const supabase = createClient(supabaseUrl, supabaseAnonKey)