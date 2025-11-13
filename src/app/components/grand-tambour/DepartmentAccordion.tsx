"use client";

import { FaUsers } from "react-icons/fa6";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { Department } from "@/data/departments";
import MemberCard from "./MemberCard";

interface DepartmentAccordionProps {
  departments: Department[];
  defaultValue?: string;
}

export default function DepartmentAccordion({
  departments,
  defaultValue = "direction",
}: DepartmentAccordionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultValue}
      className="space-y-4"
    >
      {departments.map((dept) => (
        <AccordionItem
          key={dept.id}
          value={dept.id}
          className="border rounded-lg overflow-hidden bg-card"
        >
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors cursor-pointer uppercase">
            <div className="flex items-center gap-3 text-left">
              <FaUsers className="w-5 h-5 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-sm sm:text-xl font-bold text-foreground">
                  {dept.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {dept.members.length}{" "}
                  {dept.members.length === 1 ? "membre" : "membres"}
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 sm:px-6 py-8">
            <div className={dept.gridCols}>
              {dept.members.map((member) => (
                <MemberCard key={`${member.name}-${member.email}`} member={member} />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

