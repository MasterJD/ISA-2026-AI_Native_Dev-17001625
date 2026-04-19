# Smart Insurance

## Business Rules

Smart Insurance is applied over the rental subtotal (`dailyRate * totalDays`) with category-based rates:

- Fotografía y Video: 20%
- Montaña y Camping: 10%
- Deportes Acuáticos: 10%

Final rental total formula:

`finalTotal = subtotal + (subtotal * insuranceRate)`

## Implementation Map

- Calculation module: `src/lib/smart-insurance.ts`
- UI summary integration: `src/components/features/RentalFlow/PriceSummary.tsx`
- Rental request integration: `src/components/features/RentalFlow/RentalFlow.tsx`

## Test Strategy

- Unit tests: `src/lib/smart-insurance.test.ts`
- Component rendering tests: `src/components/features/RentalFlow/PriceSummary.test.tsx`
- End-to-end flow assertions in integration: `src/components/features/RentalFlow/RentalFlow.integration.test.tsx`

## Mermaid: Sequence

```mermaid
sequenceDiagram
    autonumber
    participant User
    participant RentalFlow
    participant PriceSummary
    participant SmartInsurance
    participant API as /api/rentals/confirm

    User->>RentalFlow: Selecciona equipo y fechas
    RentalFlow->>PriceSummary: Calcula subtotal de renta
    PriceSummary->>SmartInsurance: getInsuranceRate(categoryId)
    SmartInsurance-->>PriceSummary: 0.20 o 0.10
    PriceSummary->>SmartInsurance: calculateInsuranceFee(subtotal, categoryId)
    SmartInsurance-->>PriceSummary: insuranceFee
    PriceSummary-->>User: Muestra subtotal + insurance + total
    User->>RentalFlow: Confirmar renta
    RentalFlow->>SmartInsurance: calculateTotalWithInsurance(subtotal, categoryId)
    SmartInsurance-->>RentalFlow: totalPrice
    RentalFlow->>API: POST rentalRequest(totalPrice)
    API-->>RentalFlow: confirmed
```

## Mermaid: Calculation Flowchart

```mermaid
flowchart TD
    A[Inicio] --> B[Calcular subtotal = dailyRate * totalDays]
    B --> C{categoryId == fotografia-video?}
    C -- Si --> D[insuranceRate = 20%]
    C -- No --> E[insuranceRate = 10%]
    D --> F[insuranceFee = subtotal * insuranceRate]
    E --> F
    F --> G[finalTotal = subtotal + insuranceFee]
    G --> H[Enviar totalPrice en confirmación]
```