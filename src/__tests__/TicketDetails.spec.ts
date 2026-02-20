import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { vi, describe, it, expect, beforeEach } from 'vitest'

import { useTicketsStore } from '../stores/tickets'
import TicketDetails from '../views/TicketDetailsView.vue'

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { id: '1' } }),
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
}))

describe('TicketDetails.vue', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('powinien wyrenderować komponent', async () => {
    const wrapper = mount(TicketDetails, {
      global: {
        plugins: [createPinia()],
        stubs: {
          AppIcon: true,
          RouterLink: true,
        },
      },
    })

    const store = useTicketsStore()

    store.fetchTicketById = vi.fn().mockResolvedValue({
      id: 1,
      subject: 'Błąd synchronizacji płatności',
      customerName: 'Jan Kowalski',
      status: 'new',
      priority: 'high',
      createdAt: new Date().toISOString(),
      description: 'Klient zgłasza problem z przetworzeniem transakcji kartą kredytową.',
    })

    await store.fetchTicketById(1)
    await flushPromises()

    expect(wrapper.exists()).toBe(true)
  })
})
