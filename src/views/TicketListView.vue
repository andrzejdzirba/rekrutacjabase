<template>
  <div class="container-fluid py-4">
    <div
      class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3"
    >
      <h1 class="h3 mb-0 fw-bold">Zgłoszenia</h1>

      <div class="btn-group shadow-sm border rounded overflow-hidden">
        <button
          v-for="(label, key) in filterLabels"
          :key="key"
          type="button"
          class="btn flex-fill border-0"
          :class="
            store.statusFilter === key
              ? 'btn-primary text-white active-filter'
              : 'btn-light text-dark'
          "
          @click.stop="store.setFilter(key as TicketStatus | 'all')"
        >
          {{ label }}
        </button>
      </div>
    </div>

    <div class="card shadow-sm border-0">
      <div v-if="store.isLoading" class="card-body text-center py-5">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <template v-else>
        <div class="table-responsive">
          <table class="table align-middle mb-0 custom-table">
            <thead>
              <tr>
                <th class="ps-4 py-3">#</th>
                <th class="ps-4 py-3">Temat zgłoszenia</th>
                <th class="py-3">Klient</th>
                <th class="py-3">Data</th>
                <th class="py-3">Status</th>
                <th class="py-3">Priorytet</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="ticket in store.tickets"
                :key="ticket.id"
                @click="goToDetails(ticket.id)"
                class="clickable-row"
              >
                <td data-label="Id" class="ps-md-4">
                  <div class="fw-bold text-decoration-none">
                    <span class="fs-8 text-muted">#{{ ticket.id }}</span>
                  </div>
                </td>
                <td data-label="Temat" class="ps-md-4">
                  <div class="fw-bold text-decoration-none">
                    {{ ticket.subject }}
                  </div>
                </td>
                <td data-label="Klient">{{ ticket.customerName }}</td>
                <td data-label="Data">
                  {{ new Date(ticket.createdAt).toLocaleDateString('pl-PL') }}
                </td>
                <td data-label="Status">
                  <span class="badge rounded-pill" :class="getStatusBadgeClass(ticket.status)">
                    {{ STATUS_LABELS[ticket.status] }}
                  </span>
                </td>
                <td data-label="Priorytet" class="text-capitalize fs-7">
                  <span :class="{ 'text-danger fw-bold': ticket.priority === 'high' }">
                    {{ ticket.priority }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card-footer bg-white py-3 border-top">
          <div
            class="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3"
          >
            <div class="small text-muted">
              Pokazano
              <strong>{{ (store.currentPage - 1) * store.itemsPerPage + 1 }}</strong>
              -
              <strong>{{
                Math.min(store.currentPage * store.itemsPerPage, store.totalItems)
              }}</strong>
              / <strong>{{ store.totalItems }}</strong> wyników
            </div>

            <nav v-if="store.totalPages > 1">
              <ul class="pagination pagination-sm mb-0">
                <li class="page-item" :class="{ disabled: store.currentPage === 1 }">
                  <button class="page-link" @click.stop="store.setPage(store.currentPage - 1)">
                    &laquo;
                  </button>
                </li>

                <li
                  v-for="page in store.totalPages"
                  :key="page"
                  class="page-item"
                  :class="{ active: store.currentPage === page }"
                >
                  <button class="page-link" @click.stop="store.setPage(page)">{{ page }}</button>
                </li>

                <li class="page-item" :class="{ disabled: store.currentPage === store.totalPages }">
                  <button class="page-link" @click.stop="store.setPage(store.currentPage + 1)">
                    &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import { STATUS_LABELS, type TicketStatus } from '@/types/ticket'

const store = useTicketsStore()
const router = useRouter()

const filterLabels = STATUS_LABELS

onMounted(() => {
  store.fetchTickets()
})

const goToDetails = (id: number) => {
  router.push({ name: 'ticket-details', params: { id } })
}

const getStatusBadgeClass = (status: TicketStatus) => {
  const classes: Record<TicketStatus, string> = {
    new: 'bg-primary',
    in_progress: 'bg-info',
    closed: 'bg-success',
  }
  return classes[status] || 'bg-secondary'
}
</script>
