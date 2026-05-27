import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DemoLeadForm } from "@/components/landing/DemoLeadForm";
import * as actions from "@/features/leads/actions";
import type { LeadFormValues } from "@/features/leads/schema";

const mockData: LeadFormValues = {
  restaurant_name: "Casa Demo",
  owner_name: "Ana Pérez",
  email: "ana@casademo.com",
  whatsapp: "+5491112345678",
  city: "Buenos Aires",
  restaurant_type: "Bistró",
  number_of_tables: 20,
  plan_interest: "Pro"
};

describe("DemoLeadForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("renderiza el botón de envío", () => {
    render(<DemoLeadForm />);
    expect(screen.getByRole("button", { name: /solicitar demo/i })).toBeInTheDocument();
  });

  it("muestra mensaje de éxito tras envío exitoso", async () => {
    vi.spyOn(actions, "submitLead").mockResolvedValue({
      ok: true,
      message: "Solicitud recibida.",
      data: mockData,
      automationStatus: { status: "sent" }
    });

    render(<DemoLeadForm />);
    fireEvent.click(screen.getByRole("button", { name: /solicitar demo/i }));

    await waitFor(() => {
      expect(screen.getByText("Solicitud recibida.")).toBeInTheDocument();
    });
  });

  it("muestra mensaje de error cuando la validación falla", async () => {
    vi.spyOn(actions, "submitLead").mockResolvedValue({
      ok: false,
      message: "Revisá los campos del formulario.",
      fieldErrors: { email: ["Ingresá un email válido."] },
      automationStatus: { status: "skipped", reason: "Validation failed before automation." }
    });

    render(<DemoLeadForm />);
    fireEvent.click(screen.getByRole("button", { name: /solicitar demo/i }));

    await waitFor(() => {
      expect(screen.getByText("Revisá los campos del formulario.")).toBeInTheDocument();
    });
  });

  it("deshabilita el botón durante el envío", async () => {
    vi.spyOn(actions, "submitLead").mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                message: "ok",
                data: mockData,
                automationStatus: { status: "sent" }
              }),
            100
          )
        )
    );

    render(<DemoLeadForm />);
    fireEvent.click(screen.getByRole("button", { name: /solicitar demo/i }));

    expect(screen.getByRole("button", { name: /enviando/i })).toBeDisabled();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /solicitar demo/i })).toBeInTheDocument();
    });
  });
});
