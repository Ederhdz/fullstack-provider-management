import { useEffect } from "react";
import { useForm } from "react-hook-form";

import type { Provider, ProviderPayload } from "../types/provider";

type ProviderFormProps = {
  initialValues?: Provider | null;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (payload: ProviderPayload) => Promise<void>;
};

const emptyValues: ProviderPayload = {
  type: "PHYSICAL_PERSON",
  businessName: "",
  rfc: "",
  email: "",
  phone: "",
};

export function ProviderForm({
  initialValues,
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
}: ProviderFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProviderPayload>({
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        type: initialValues.type,
        businessName: initialValues.businessName,
        rfc: initialValues.rfc,
        email: initialValues.email,
        phone: initialValues.phone,
      });
    } else {
      reset(emptyValues);
    }
  }, [initialValues, reset]);

  return (
    <form className="provider-form" onSubmit={handleSubmit(onSubmit)}>
      <label>
        Tipo
        <select {...register("type", { required: "El tipo es obligatorio." })}>
          <option value="PHYSICAL_PERSON">Persona fisica</option>
          <option value="LEGAL_ENTITY">Persona moral</option>
        </select>
        {errors.type && <span className="field-error">{errors.type.message}</span>}
      </label>

      <label>
        Nombre o razon social
        <input
          maxLength={150}
          {...register("businessName", {
            required: "El nombre es obligatorio.",
            maxLength: {
              value: 150,
              message: "Maximo 150 caracteres.",
            },
          })}
        />
        {errors.businessName && (
          <span className="field-error">{errors.businessName.message}</span>
        )}
      </label>

      <label>
        RFC
        <input
          maxLength={13}
          {...register("rfc", {
            required: "El RFC es obligatorio.",
            minLength: {
              value: 12,
              message: "Minimo 12 caracteres.",
            },
            maxLength: {
              value: 13,
              message: "Maximo 13 caracteres.",
            },
          })}
        />
        {errors.rfc && <span className="field-error">{errors.rfc.message}</span>}
      </label>

      <label>
        Email
        <input
          type="email"
          maxLength={150}
          {...register("email", {
            required: "El email es obligatorio.",
          })}
        />
        {errors.email && <span className="field-error">{errors.email.message}</span>}
      </label>

      <label>
        Telefono
        <input
          maxLength={20}
          {...register("phone", {
            required: "El telefono es obligatorio.",
            maxLength: {
              value: 20,
              message: "Maximo 20 caracteres.",
            },
          })}
        />
        {errors.phone && <span className="field-error">{errors.phone.message}</span>}
      </label>

      <div className="form-actions">
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : submitLabel}
        </button>
        <button className="secondary" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
