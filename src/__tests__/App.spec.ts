import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import { describe, it, expect, beforeEach } from 'vitest'

import App from '../App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: { template: '<div></div>' } }],
})

describe('App.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('powinien przełączać widoczność menu po kliknięciu buttona', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, createPinia()],
        stubs: {
          AppIcon: true,
          RouterLink: true,
          RouterView: true,
        },
      },
    })

    const menuButton = wrapper.find('.mobile-topbar .btn-dark')

    const sidebar = wrapper.find('.sidebar')

    expect(sidebar.classes()).not.toContain('is-open')

    await menuButton.trigger('click')

    expect(sidebar.classes()).toContain('is-open')
  })
})
