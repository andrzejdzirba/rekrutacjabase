<template>
  <div class="app-layout">
    <a href="#main-content" class="skip-link"> Przejdź do treści </a>
    <header
      class="mobile-topbar d-lg-none text-white position-fixed top-0 start-0 end-0 d-flex align-items-center justify-content-between px-3"
    >
      <div class="d-flex align-items-center gap-2">
        <AppIcon name="callcenter" :size="20" />
        <span class="fs-7 fw-bold">POCC</span>
      </div>
      <button class="btn btn-dark" @click="toggleMenu">
        <AppIcon name="menu" :size="24" />
      </button>
    </header>

    <div class="sidebar-backdrop" :class="{ 'is-active': isMenuOpen }" @click="closeMenu"></div>

    <nav class="sidebar text-white" :class="{ 'is-open': isMenuOpen }">
      <div class="p-3 d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-2">
          <AppIcon name="callcenter" :size="24" />
          <span class="fs-5 fw-bold">POCC</span>
        </div>
        <button class="btn btn-sm text-white d-lg-none" @click="closeMenu">
          <AppIcon name="close" :size="24" />
        </button>
      </div>

      <div class="px-3">
        <div class="fs-7 text-secondary opacity-75">Panel Operatora Call Center</div>
        <hr class="text-secondary opacity-25 my-3" />
      </div>

      <div class="px-3 flex-grow-1 overflow-auto">
        <ul class="nav nav-pills flex-column gap-1">
          <li v-for="item in menuItems" :key="item.to">
            <RouterLink :to="item.to" class="nav-link" active-class="active" @click="closeMenu">
              <AppIcon :name="item.icon" :size="18" class="me-3" />
              <span>{{ item.label }}</span>
            </RouterLink>
          </li>
        </ul>
      </div>

      <div class="p-3 opacity-50 small">v1.0.0 Recruitment Task</div>
    </nav>

    <main class="main-container">
      <div class="container-fluid py-4">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import AppIcon from '@/components/AppIcon.vue'
import { useNavigation } from './composables/useNavigation'

const { menuItems } = useNavigation()
const isMenuOpen = ref<boolean>(false)

const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value)
const closeMenu = () => (isMenuOpen.value = false)

const handleEscape = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) closeMenu()
}

watch(isMenuOpen, (isOpen) => {
  if (window.innerWidth < 992) {
    document.body.style.overflow = isOpen ? 'hidden' : ''
  }
})

onMounted(() => document.addEventListener('keydown', handleEscape))
onUnmounted(() => document.removeEventListener('keydown', handleEscape))
</script>
