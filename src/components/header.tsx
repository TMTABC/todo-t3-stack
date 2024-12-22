import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

// Define the type for breadcrumb items
type BreadcrumbItemProps = {
  label: string;
  href?: string; // Optional for pages without links
};

type HeaderProps = {
  breadcrumbs: BreadcrumbItemProps[];
};

const Header: React.FC<HeaderProps> = ({ breadcrumbs }) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={item.label}>
              <BreadcrumbItem className={index > 0 ? "hidden md:block" : ""}>
                {item.href ? (
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                ) : (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator className="hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
};

export default Header;
