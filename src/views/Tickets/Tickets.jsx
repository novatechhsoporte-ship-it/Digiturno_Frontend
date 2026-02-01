import { useTickets } from "@hooks/";
import { TicketsHeader, TicketsFilters, TicketsTable, CreateTicketModal, EditCustomerModal } from "@components/tickets";
import { useTicketSocket } from "@hooks/Tickets/useTicketSocket";

import "./Tickets.scss";

export const Tickets = () => {
  const {
    // State
    pendingTickets,
    loading,
    selectedTenant,
    setSelectedTenant,
    selectedModule,
    setSelectedModule,
    showCreateModal,
    showEditModal,
    editingCustomer,
    showCreateButton,
    isSuperAdmin,
    servicesMap,

    // Forms
    register,
    handleSubmit,
    onSubmitCreate,
    errors,
    isSubmitting,
    isDisabled,
    registerCustomer,
    handleSubmitCustomer,
    errorsCustomer,
    isSubmittingCustomer,
    isDisabledCustomer,

    // Methods
    onCreateTicket,
    onUpdateCustomer,
    handleShowCreateModal,
    handleCloseCreateModal,
    handleCloseEditModal,

    // Table
    ticketColumns,
    ticketActions,

    // Options
    tenantOptions,
    moduleFilterOptions,
  } = useTickets();

  useTicketSocket();

  return (
    <section className="tickets">
      <TicketsHeader showCreateButton={showCreateButton} onShowCreateModal={handleShowCreateModal} />

      <TicketsFilters
        isSuperAdmin={isSuperAdmin}
        selectedTenant={selectedTenant}
        setSelectedTenant={setSelectedTenant}
        selectedModule={selectedModule}
        setSelectedModule={setSelectedModule}
        tenantOptions={tenantOptions}
        moduleFilterOptions={moduleFilterOptions}
      />

      <TicketsTable
        pendingTickets={pendingTickets}
        loading={loading}
        selectedTenant={selectedTenant}
        isSuperAdmin={isSuperAdmin}
        ticketColumns={ticketColumns}
        ticketActions={ticketActions}
      />

      <CreateTicketModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        register={register}
        handleSubmit={handleSubmit}
        onSubmitCreate={onSubmitCreate}
        errors={errors}
        isSubmitting={isSubmitting}
        isDisabled={isDisabled}
        onCreateTicket={onCreateTicket}
        servicesMap={servicesMap}
      />

      <EditCustomerModal
        isOpen={showEditModal}
        onClose={handleCloseEditModal}
        editingCustomer={editingCustomer}
        registerCustomer={registerCustomer}
        handleSubmitCustomer={handleSubmitCustomer}
        errorsCustomer={errorsCustomer}
        isSubmittingCustomer={isSubmittingCustomer}
        isDisabledCustomer={isDisabledCustomer}
        onUpdateCustomer={onUpdateCustomer}
      />
    </section>
  );
};
