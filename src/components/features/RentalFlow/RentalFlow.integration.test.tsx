import { addDays } from "date-fns";
import { useMemo, useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { DateRange } from "react-day-picker";

import { RentalFlow } from "@/components/features/RentalFlow";
import type { CategoryId, GearItem } from "@/types/gear";

const { toastSuccessMock, toastErrorMock } = vi.hoisted(() => {
  return {
    toastSuccessMock: vi.fn(),
    toastErrorMock: vi.fn(),
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

const mockItemsByCategory: Record<CategoryId, GearItem[]> = {
  "fotografia-video": [
    {
      id: "gear-cam-1",
      name: "Cámara Mirrorless",
      categoryId: "fotografia-video",
      categoryName: "Fotografía y Video",
      shortDescription: "Cámara para contenido profesional.",
      dailyRate: 60,
      currency: "USD",
      imageURL: "https://source.unsplash.com/featured/?camera",
      technicalSpecs: {
        weight: "1.5kg",
        sensor: "Full Frame",
      },
      availability: {
        inStock: true,
        totalUnits: 3,
      },
    },
  ],
  "montana-camping": [
    {
      id: "gear-camp-1",
      name: "Carpa Alpina",
      categoryId: "montana-camping",
      categoryName: "Montaña y Camping",
      shortDescription: "Carpa para climas extremos.",
      dailyRate: 40,
      currency: "USD",
      imageURL: "https://source.unsplash.com/featured/?camping",
      technicalSpecs: {
        weight: "2.8kg",
        capacity: "2 personas",
      },
      availability: {
        inStock: true,
        totalUnits: 5,
      },
    },
  ],
  "deportes-acuaticos": [
    {
      id: "gear-water-1",
      name: "Tabla de Surf",
      categoryId: "deportes-acuaticos",
      categoryName: "Deportes Acuáticos",
      shortDescription: "Tabla shortboard de alto desempeño.",
      dailyRate: 55,
      currency: "USD",
      imageURL: "https://source.unsplash.com/featured/?surf",
      technicalSpecs: {
        weight: "2.3kg",
        length: "6'2",
      },
      availability: {
        inStock: true,
        totalUnits: 4,
      },
    },
  ],
};

function RentalHarness({ initialDateRange }: { initialDateRange?: DateRange }) {
  const [category, setCategory] = useState<CategoryId>("fotografia-video");
  const [gearId, setGearId] = useState<string>("gear-cam-1");

  const selectedItem = useMemo(() => {
    const items = mockItemsByCategory[category];
    return items.find((item) => item.id === gearId) ?? items[0];
  }, [category, gearId]);

  return (
    <div>
      <label htmlFor="category">Categoría</label>
      <select
        id="category"
        value={category}
        onChange={(event) => {
          const nextCategory = event.currentTarget.value as CategoryId;
          setCategory(nextCategory);
          setGearId(mockItemsByCategory[nextCategory][0].id);
        }}
      >
        <option value="fotografia-video">Fotografía y Video</option>
        <option value="montana-camping">Montaña y Camping</option>
        <option value="deportes-acuaticos">Deportes Acuáticos</option>
      </select>

      <label htmlFor="gear">Equipo</label>
      <select
        id="gear"
        value={selectedItem.id}
        onChange={(event) => setGearId(event.currentTarget.value)}
      >
        {mockItemsByCategory[category].map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <RentalFlow item={selectedItem} initialDateRange={initialDateRange} />
    </div>
  );
}

describe("RentalFlow integration", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({ status: "confirmed" }),
    });

    toastSuccessMock.mockClear();
    toastErrorMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("confirms rental for water sports category without stuck loading", async () => {
    const user = userEvent.setup();
    render(<RentalHarness />);

    await user.selectOptions(screen.getByLabelText("Categoría"), "deportes-acuaticos");
    await user.click(screen.getByRole("button", { name: "Continuar a fechas" }));
    await user.click(screen.getByRole("button", { name: "Ver resumen" }));
    await user.click(screen.getByRole("button", { name: "Confirmar renta" }));

    await waitFor(() => {
      expect(screen.getByText("Rental Confirmed")).toBeInTheDocument();
    });

    expect(toastSuccessMock).toHaveBeenCalledTimes(1);
    expect(toastErrorMock).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, requestOptions] = fetchMock.mock.calls[0] as [
      string,
      { body: string }
    ];
    const payload = JSON.parse(requestOptions.body) as { totalPrice: number };
    expect(payload.totalPrice).toBeCloseTo(181.5, 5);
  });

  it("applies 20% smart insurance for photography totals", async () => {
    const user = userEvent.setup();
    render(<RentalHarness />);

    await user.click(screen.getByRole("button", { name: "Continuar a fechas" }));
    await user.click(screen.getByRole("button", { name: "Ver resumen" }));
    await user.click(screen.getByRole("button", { name: "Confirmar renta" }));

    await waitFor(() => {
      expect(screen.getByText("Rental Confirmed")).toBeInTheDocument();
    });

    const [, requestOptions] = fetchMock.mock.calls[0] as [
      string,
      { body: string }
    ];
    const payload = JSON.parse(requestOptions.body) as { totalPrice: number };
    expect(payload.totalPrice).toBeCloseTo(216, 5);
  });

  it("does not show success toast when date range is invalid", async () => {
    const user = userEvent.setup();
    render(
      <RentalHarness
        initialDateRange={{
          from: addDays(new Date(), -10),
          to: addDays(new Date(), -7),
        }}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Continuar a fechas" }));
    await user.click(screen.getByRole("button", { name: "Ver resumen" }));

    expect(
      screen.getByText("La fecha inicial no puede estar en el pasado."),
    ).toBeInTheDocument();
    expect(screen.queryByText("Rental Confirmed")).not.toBeInTheDocument();
    expect(toastSuccessMock).not.toHaveBeenCalled();
  });
});
