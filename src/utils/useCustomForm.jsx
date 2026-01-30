import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

/**
 * Custom hook para formularios con React Hook Form + Zod
 * @param {Object} options
 * @param {ZodSchema} options.schema - Schema de Zod (opcional)
 * @param {Object} options.formOptions - Opciones adicionales de useForm
 */
export const useCustomForm = ({ schema, formOptions } = {}) => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    trigger,
    setValue,
  } = useForm({
    resolver: schema ? zodResolver(schema) : undefined,
    mode: "onChange",
    ...formOptions,
  });

  const isDisabled = Object.keys(errors).length > 0 || isSubmitting;

  return {
    control,
    register,
    handleSubmit,
    errors,
    isSubmitting,
    isDisabled,
    watch,
    reset,
    trigger,
    setValue,
  };
};
