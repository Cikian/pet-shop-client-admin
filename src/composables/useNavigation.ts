import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export interface MenuItem {
  index: string
  title: string
  icon?: string
  children?: MenuItem[]
  hidden?: boolean
  disabled?: boolean
}

export const useNavigation = () => {
  const route = useRoute()
  const router = useRouter()

  // 菜单配置
  const menuItems: MenuItem[] = [
    {
      index: '/dashboard',
      title: '仪表板',
      icon: 'Odometer'
    },
    {
      index: 'products',
      title: '商品管理',
      icon: 'Goods',
      children: [
        {
          index: '/products',
          title: '商品列表',
          icon: 'List'
        },
        {
          index: '/products/add',
          title: '添加商品',
          icon: 'Plus'
        }
      ]
    },
    {
      index: '/categories',
      title: '分类管理',
      icon: 'Menu'
    },
    {
      index: '/specs',
      title: '规格管理',
      icon: 'SetUp'
    },
    {
      index: 'system',
      title: '系统管理',
      icon: 'Setting',
      children: [
        {
          index: '/system/users',
          title: '用户管理',
          icon: 'User'
        },
        {
          index: '/system/settings',
          title: '系统设置',
          icon: 'Tools'
        }
      ]
    }
  ]

  // 获取当前激活的菜单项
  const activeMenu = computed(() => {
    const path = route.path
    
    // 精确匹配
    if (path === '/dashboard') return '/dashboard'
    if (path === '/categories') return '/categories'
    if (path === '/specs') return '/specs'
    
    // 商品管理路由匹配
    if (path === '/products') return '/products'
    if (path === '/products/add') return '/products/add'
    if (path.startsWith('/products/') && path.includes('/edit')) {
      return '/products' // 编辑页面高亮商品列表
    }
    
    // 系统管理路由匹配
    if (path.startsWith('/system/users')) return '/system/users'
    if (path.startsWith('/system/settings')) return '/system/settings'
    
    return path
  })

  // 获取当前打开的子菜单
  const openedMenus = computed(() => {
    const path = route.path
    const opened: string[] = []
    
    if (path.startsWith('/products')) {
      opened.push('products')
    }
    
    if (path.startsWith('/system')) {
      opened.push('system')
    }
    
    return opened
  })

  // 导航到指定路由
  const navigateTo = (path: string) => {
    if (path && path !== route.path) {
      router.push(path)
    }
  }

  // 检查菜单项是否激活
  const isMenuActive = (menuIndex: string) => {
    return activeMenu.value === menuIndex
  }

  // 检查子菜单是否应该打开
  const isSubMenuOpen = (menuIndex: string) => {
    return openedMenus.value.includes(menuIndex)
  }

  return {
    menuItems,
    activeMenu,
    openedMenus,
    navigateTo,
    isMenuActive,
    isSubMenuOpen
  }
}