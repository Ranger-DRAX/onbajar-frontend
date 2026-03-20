import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  cols?: 2 | 3 | 4;
};

export default function ProductGrid({ children, cols = 4 }: Props) {
  const colClass =
    cols === 2
      ? "grid-cols-2"
      : cols === 3
        ? "grid-cols-2 md:grid-cols-3"
        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return <div className={`grid ${colClass} gap-x-4 gap-y-8 md:gap-x-6`}>{children}</div>;
}