<template>
  <div class="container-fluid py-4">
    <div class="mb-4">
      <h1 class="h3 mb-0 fw-bold">Szczegóły zgłoszenia</h1>
    </div>

    <div v-if="store.isLoadingTicket" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="ticket" class="mx-auto">
      <div class="shadow-sm border rounded bg-light p-4 mb-4">
        <div class="mb-4">
          <p class="text-muted small text-uppercase fw-bold d-block mb-1">ID Zgłoszenia</p>
          <p class="mb-0">#{{ ticket.id }}</p>
        </div>

        <div class="mb-4">
          <p class="text-muted small text-uppercase fw-bold d-block mb-1">Temat</p>
          <p class="mb-0 fw-semibold">{{ ticket.subject }}</p>
        </div>

        <div class="mb-4">
          <p class="text-muted small text-uppercase fw-bold d-block mb-1">Klient</p>
          <p class="mb-0">{{ ticket.customerName }}</p>
        </div>

        <div class="mb-4">
          <p class="text-muted small text-uppercase fw-bold d-block mb-1">Opis</p>
          <p class="text-dark mb-0">{{ ticket.description || 'Brak opisu.' }}</p>
        </div>

        <div class="mb-4">
          <p class="text-muted small text-uppercase fw-bold d-block mb-1">Data utworzenia</p>
          <p class="mb-0">{{ new Date(ticket.createdAt).toLocaleString('pl-PL') }}</p>
        </div>

        <div class="mb-4">
          <p class="text-muted small text-uppercase fw-bold d-block mb-1">Priorytet</p>
          <p class="text-capitalize mb-0">
            <span :class="{ 'text-danger fw-bold': ticket.priority === 'high' }">
              {{ ticket.priority }}
            </span>
          </p>
        </div>

        <hr class="my-4 opacity-10" />

        <div class="p-4 border rounded bg-white shadow-sm mt-4">
          <label class="form-label fw-bold small text-muted text-uppercase mb-3">
            Zmień status zgłoszenia
          </label>

          <div class="row g-3">
            <div class="col-md-8">
              <select
                v-model="selectedStatus"
                class="form-select form-select-lg shadow-none"
                :disabled="isSaving"
              >
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ STATUS_LABELS[status] }}
                </option>
              </select>
            </div>

            <div class="col-md-4">
              <button
                @click="handleSave"
                class="btn btn-navy btn-lg w-100 fw-bold h-100 d-flex align-items-center justify-content-center"
                :disabled="isSaving || selectedStatus === ticket?.status"
              >
                <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>

                <AppIcon
                  v-if="!isSaving && selectedStatus !== ticket?.status"
                  name="save"
                  :size="20"
                  class="me-2"
                />

                {{ isSaving ? 'Zapisywanie...' : 'Zapisz zmiany' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="text-center mt-5">
        <button
          @click="goBack"
          class="btn btn-light-custom px-4 py-2 fw-semibold d-inline-flex align-items-center"
        >
          <AppIcon name="backtolist" :size="20" class="me-2" />
          Wróć do listy zgłoszeń
        </button>
      </div>
    </div>

    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        class="toast align-items-center text-white bg-success border-0 shadow-lg"
        :class="{ show: showToast }"
        role="alert"
      >
        <div class="d-flex">
          <div class="toast-body d-flex align-items-center">
            <AppIcon name="save" :size="18" class="me-2" />
            Zmiany zostały zapisane pomyślnie!
          </div>
          <button
            type="button"
            class="btn btn-link text-white border-0 p-0 me-3 m-auto shadow-none"
            @click="showToast = false"
            aria-label="Zamknij"
          >
            <AppIcon name="close" :size="18" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTicketsStore } from '@/stores/tickets'
import { STATUS_LABELS, type Ticket, type TicketStatus } from '@/types/ticket'
import AppIcon from '@/components/AppIcon.vue'

// Routing i Store z odpowiednimi typami
const route = useRoute()
const router = useRouter()
const store = useTicketsStore()

// Stan komponentu z jawnym typowaniem
const ticket = ref<Ticket | null>(null)
const selectedStatus = ref<TicketStatus | ''>('')
const isSaving = ref<boolean>(false)
const showToast = ref<boolean>(false)

// Generowanie opcji statusu z wykluczeniem 'all'
const statusOptions = Object.keys(STATUS_LABELS).filter((key) => key !== 'all') as TicketStatus[]

onMounted(async () => {
  const id = Number(route.params.id)

  if (isNaN(id) || id <= 0) {
    console.error('Nieprawidłowe ID zgłoszenia')
    router.replace('/tickets')
    return
  }

  const data = await store.fetchTicketById(id)
  if (data) {
    ticket.value = data
    selectedStatus.value = data.status
  }
})

const handleSave = async (): Promise<void> => {
  // Guard clause dla TS i logiki biznesowej
  if (!ticket.value || !selectedStatus.value) return

  isSaving.value = true
  try {
    const newStatus = selectedStatus.value as TicketStatus
    await store.updateTicketStatus(ticket.value.id, newStatus)

    // Aktualizacja lokalnej referencji po sukcesie
    ticket.value.status = newStatus

    // Obsługa powiadomienia Success
    showToast.value = true
    setTimeout(() => {
      showToast.value = false
    }, 3000)
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieoczekiwany błąd'
    console.error('Błąd podczas zapisu:', errorMessage)
    // Tutaj można by dodać showToastError.value = true
  } finally {
    isSaving.value = false
  }
}

const goBack = (): void => {
  router.back()
}
</script>
