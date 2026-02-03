"use client";

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
      className="space-y-0 border-t border-zinc-200"
    >
      {departments.map((dept) => (
        <AccordionItem
          key={dept.id}
          value={dept.id}
          className="border-b border-zinc-200"
        >
          <AccordionTrigger className="py-6 sm:py-8 lg:py-10 cursor-pointer hover:no-underline group hover:bg-zinc-50 transition-colors px-4 sm:px-6">
            <div className="flex items-center gap-4 text-left flex-1 min-w-0">
              <span className="text-xl sm:text-2xl md:text-3xl lg:text-2xl font-black uppercase tracking-tighter text-black group-hover:text-accent transition-colors truncate">
                {dept.name}
              </span>
              <span className="px-3 py-1 bg-black text-white text-xs font-bold uppercase tracking-widest group-hover:bg-accent group-hover:text-black transition-colors flex-shrink-0">
                {dept.members.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-12 pt-8 px-4 sm:px-6 bg-zinc-50/50">
            <div className={dept.gridCols}>
              {dept.members.map((member) => (
                <MemberCard
                  key={`${member.name}-${member.email}`}
                  member={member}
                />
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
