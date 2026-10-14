import NextLink from "next/link";
import React from "react";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Link = ({ to, href, children, ...props }: LinkProps) => {
  const destination = href || to || "#";
  return (
    <NextLink href={destination} {...props}>
      {children}
    </NextLink>
  );
};

export default Link;
