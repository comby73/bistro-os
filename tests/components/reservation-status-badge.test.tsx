import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ReservationStatusBadge } from "@/components/reservations/ReservationStatusBadge";

describe("ReservationStatusBadge", () => {
  it("muestra 'Pendiente' para status pending", () => {
    render(<ReservationStatusBadge status="pending" />);
    expect(screen.getByText("Pendiente")).toBeInTheDocument();
  });

  it("muestra 'Confirmada' para status confirmed", () => {
    render(<ReservationStatusBadge status="confirmed" />);
    expect(screen.getByText("Confirmada")).toBeInTheDocument();
  });

  it("muestra 'Sentada' para status seated", () => {
    render(<ReservationStatusBadge status="seated" />);
    expect(screen.getByText("Sentada")).toBeInTheDocument();
  });

  it("muestra 'Cancelada' para status cancelled", () => {
    render(<ReservationStatusBadge status="cancelled" />);
    expect(screen.getByText("Cancelada")).toBeInTheDocument();
  });

  it("muestra 'Completada' para status completed", () => {
    render(<ReservationStatusBadge status="completed" />);
    expect(screen.getByText("Completada")).toBeInTheDocument();
  });
});
