"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Search, Edit2, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  const members = [
    {
      id: "1",
      name: "Jean Dupont",
      email: "jean.dupont@email.com",
      type: "standard",
      status: "validated",
      joinDate: "2024-11-10",
      activities: 5,
    },
    {
      id: "2",
      name: "Marie Mbongo",
      email: "marie.mbongo@email.com",
      type: "standard",
      status: "pending",
      joinDate: "2024-11-13",
      activities: 0,
    },
    {
      id: "3",
      name: "Pierre Kalala",
      email: "pierre.kalala@email.com",
      type: "standard",
      status: "validated",
      joinDate: "2024-11-05",
      activities: 12,
    },
    {
      id: "4",
      name: "Amelie Nkindi",
      email: "amelie.nkindi@email.com",
      type: "standard",
      status: "pending",
      joinDate: "2024-11-12",
      activities: 0,
    },
    {
      id: "5",
      name: "David Mukadi",
      email: "david.mukadi@email.com",
      type: "admin",
      status: "validated",
      joinDate: "2024-10-15",
      activities: 28,
    },
  ];

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || member.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleValidate = (id: string) => {
    console.log("[v0] Validating member:", id);
  };

  const handleDelete = (id: string) => {
    console.log("[v0] Deleting member:", id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Gestion des Membres
        </h1>
        <p className="mt-2 text-sm text-foreground/60">
          Gérez les inscriptions, validez les profils et suivez les activités
        </p>
      </div>

      {/* Filters */}
      <Card className="py-5">
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
              <Input
                placeholder="Chercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              {[
                { label: "Tous", value: "all" },
                { label: "Validés", value: "validated" },
                { label: "En attente", value: "pending" },
              ].map((status) => (
                <Button
                  key={status.value}
                  variant={
                    filterStatus === status.value ? "default" : "outline"
                  }
                  size="sm"
                  onClick={() => setFilterStatus(status.value)}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card className="py-6">
        <CardHeader>
          <CardTitle>Membres ({filteredMembers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-foreground/70">
                    Nom
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/70">
                    Email
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/70">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/70">
                    Statut
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/70">
                    Activités
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-foreground/70">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-border hover:bg-accent/50"
                  >
                    <td className="py-3 px-4">{member.name}</td>
                    <td className="py-3 px-4 text-foreground/60">
                      {member.email}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          member.type === "admin" ? "default" : "secondary"
                        }
                        className="text-white"
                      >
                        {member.type === "admin" ? "Admin" : "Standard"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant={
                          member.status === "validated" ? "default" : "outline"
                        }
                        className={cn(
                          member.status === "pending" &&
                            "bg-amber-50 text-amber-700 border-amber-200"
                        )}
                      >
                        {member.status === "validated"
                          ? "Validé"
                          : "En attente"}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{member.activities}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        {member.status === "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleValidate(member.id)}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingId(member.id)}
                          className="text-blue-600 hover:bg-blue-50"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
