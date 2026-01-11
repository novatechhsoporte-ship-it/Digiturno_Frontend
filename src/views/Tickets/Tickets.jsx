import React from "react";
import { useTickets } from "@hooks/";
import { TicketsHeader, TicketsFilters, TicketsTable, CreateTicketModal, EditCustomerModal } from "@components/tickets";

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

    // Forms
    register,
    handleSubmit,
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
    moduleOptions,
    moduleFilterOptions,
  } = useTickets();

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
        errors={errors}
        isSubmitting={isSubmitting}
        isDisabled={isDisabled}
        moduleOptions={moduleOptions}
        onCreateTicket={onCreateTicket}
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
