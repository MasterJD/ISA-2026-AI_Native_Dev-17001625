import { differenceInCalendarDays, startOfDay } from "date-fns";
import { z } from "zod";

const today = () => startOfDay(new Date());

export const rentalDateRangeSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .superRefine((value, ctx) => {
    const start = startOfDay(value.from);
    const end = startOfDay(value.to);

    if (start < today()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["from"],
        message: "La fecha inicial no puede estar en el pasado.",
      });
    }

    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message: "La fecha final debe ser mayor o igual a la inicial.",
      });
    }

    if (differenceInCalendarDays(end, start) + 1 > 30) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["to"],
        message: "La renta no puede exceder 30 días en esta demo.",
      });
    }
  });

export const rentalRequestSchema = z.object({
  gearId: z.string().min(1),
  categoryId: z.enum([
    "fotografia-video",
    "montana-camping",
    "deportes-acuaticos",
  ]),
  dateRange: rentalDateRangeSchema,
  totalPrice: z.number().positive(),
});

export type RentalDateRangeInput = z.infer<typeof rentalDateRangeSchema>;
export type RentalRequestInput = z.infer<typeof rentalRequestSchema>;