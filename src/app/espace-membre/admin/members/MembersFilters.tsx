"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface MembersFiltersProps {
  currentSearch: string;
  currentStatus: string;
}

export function MembersFilters({
  currentSearch,
  currentStatus,
}: MembersFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/espace-membre/admin/members?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("search", searchTerm);
  };

  return (
    <Card className="py-5">
      <CardContent className="pt-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <Input
              placeholder="Chercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </form>

          {/* Status Filter */}
          <div className="flex gap-2">
            {[
              { label: "Tous", value: "all" },
              { label: "Approuvés", value: "validated" },
              { label: "En attente", value: "pending" },
            ].map((status) => (
              <Button
                key={status.value}
                variant={currentStatus === status.value ? "default" : "outline"}
                size="sm"
                onClick={() => updateFilters("status", status.value)}
                disabled={isPending}
              >
                {status.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
