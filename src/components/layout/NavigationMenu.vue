<template>
  <el-menu
    :default-active="activeMenu"
    :default-openeds="openedMenus"
    :collapse="props.isCollapse"
    :unique-opened="false"
    router
    class="navigation-menu"
  >
    <!-- 仪表板 -->
    <el-menu-item index="/dashboard">
      <el-icon><Odometer /></el-icon>
      <template #title>仪表板</template>
    </el-menu-item>
    
    <!-- 商品管理 -->
    <el-sub-menu index="products">
      <template #title>
        <el-icon><Goods /></el-icon>
        <span>商品管理</span>
      </template>
      <el-menu-item index="/products">
        <el-icon><List /></el-icon>
        <template #title>商品列表</template>
      </el-menu-item>
      <el-menu-item index="/products/add">
        <el-icon><Plus /></el-icon>
        <template #title>添加商品</template>
      </el-menu-item>
    </el-sub-menu>
    
    <!-- 分类管理 -->
    <el-menu-item index="/categories">
      <el-icon><Menu /></el-icon>
      <template #title>分类管理</template>
    </el-menu-item>
    
    <!-- 规格管理 -->
    <el-menu-item index="/specs">
      <el-icon><SetUp /></el-icon>
      <template #title>规格管理</template>
    </el-menu-item>
    
    <!-- 系统管理 -->
    <el-sub-menu index="system">
      <template #title>
        <el-icon><Setting /></el-icon>
        <span>系统管理</span>
      </template>
      <el-menu-item index="/system/users">
        <el-icon><User /></el-icon>
        <template #title>用户管理</template>
      </el-menu-item>
      <el-menu-item index="/system/settings">
        <el-icon><Tools /></el-icon>
        <template #title>系统设置</template>
      </el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { useNavigation } from '@/composables/useNavigation'
import { 
  Odometer, 
  Goods, 
  Menu, 
  SetUp,
  Setting,
  User,
  Tools,
  List,
  Plus
} from '@element-plus/icons-vue'

// Props
interface Props {
  isCollapse?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isCollapse: false
})

// 使用导航组合式函数
const { activeMenu, openedMenus } = useNavigation()
</script>

<style scoped lang="scss">
.navigation-menu {
  border-right: none;
  height: 100%;
  
  // 菜单项样式
  :deep(.el-menu-item) {
    height: 48px;
    line-height: 48px;
    
    &:hover {
      background-color: var(--el-menu-hover-bg-color);
    }
    
    &.is-active {
      background-color: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
      
      &::before {
        content: '';
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 3px;
        background-color: var(--el-color-primary);
      }
    }
  }
  
  // 子菜单样式
  :deep(.el-sub-menu) {
    .el-sub-menu__title {
      height: 48px;
      line-height: 48px;
      
      &:hover {
        background-color: var(--el-menu-hover-bg-color);
      }
    }
    
    .el-menu-item {
      padding-left: 48px !important;
      
      &.is-active {
        background-color: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
    }
  }
  
  // 折叠状态下的样式
  &.el-menu--collapse {
    width: 64px;
    
    :deep(.el-menu-item),
    :deep(.el-sub-menu__title) {
      padding: 0 20px;
      text-align: center;
    }
    
    :deep(.el-sub-menu) {
      .el-sub-menu__icon-arrow {
        display: none;
      }
    }
  }
}
</style>