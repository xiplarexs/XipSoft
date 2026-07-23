import { cn } from "@/utils";
import Link from "next/link";
import { PropsWithChildren } from "react";
import React from "react";

type TMesLink = PropsWithChildren<{
  href: string;
  className?: string;
  style?: React.CSSProperties;
}>;

const MseLink: React.FC<TMesLink> = ({ children, href, className, style }) => {
  return (
    <Link href={href} className={cn(className)} style={style} prefetch={false}>
      {children}
    </Link>
  );
};
export default MseLink;
