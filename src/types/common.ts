// Ortak tipler — ISP: her modul sadece ihtiyacı olanı import eder

export type PostStatus = "draft" | "published";

export interface PaginatedResult<T> {
  data: T[];
  hasMore: boolean;
  nextOffset: number;
}
