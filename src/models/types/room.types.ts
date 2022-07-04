export const HotelTypes = {
  ADMIN: "admin",
  CLIENT: "client",
} as const;
export type HotelTypes = typeof HotelTypes[keyof typeof HotelTypes];
