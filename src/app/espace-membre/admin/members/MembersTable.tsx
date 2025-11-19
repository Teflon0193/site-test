"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { deleteMemberAction } from "./actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Member {
  id: string;
  name: string;
  email: string;
  role: "MEMBER" | "ADMIN";
  isApproved: boolean;
  createdAt: Date;
  _count: {
    activities: number;
  };
}

interface MembersTableProps {
  members: Member[];
}

export function MembersTable({ members }: MembersTableProps) {
  const queryClient = useQueryClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const confirmDelete = async () => {
    if (!memberToDelete) return;

    setDeletingId(memberToDelete.id);
    setMemberToDelete(null);

    try {
      const result = await deleteMemberAction(memberToDelete.id);
      if (result.success) {
        toast.success(result.message || "Membre supprimé avec succès");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["admin", "members"] }),
          queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
          queryClient.invalidateQueries({ queryKey: ["admin", "approvals"] }),
        ]);
      } else {
        toast.error(result.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      toast.error("Une erreur inattendue s'est produite");
      console.error(error);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <AlertDialog
        open={memberToDelete !== null}
        onOpenChange={(open: boolean) => !open && setMemberToDelete(null)}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <AlertDialogTitle className="text-xl">
                Supprimer un membre
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-base text-left">
              Êtes-vous sûr de vouloir supprimer{" "}
              <span className="font-semibold text-foreground">
                {memberToDelete?.name}
              </span>{" "}
              ?
              <br />
              <br />
              <span className="text-red-600 font-medium">
                Cette action est irréversible.
              </span>{" "}
              Toutes les données associées à ce membre seront définitivement
              supprimées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 cursor-pointer hover:bg-red-700 focus:ring-red-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Oui, supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                Date d&apos;inscription
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
            {members.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  Aucun membre trouvé
                </td>
              </tr>
            ) : (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="border-b border-border hover:bg-accent/50"
                >
                  <td className="py-3 px-4 font-medium">{member.name}</td>
                  <td className="py-3 px-4 text-foreground/60">
                    {member.email}
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={
                        member.role === "ADMIN" ? "default" : "secondary"
                      }
                      className="text-white"
                    >
                      {member.role === "ADMIN" ? "Admin" : "Standard"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4">
                    <Badge
                      variant={member.isApproved ? "default" : "outline"}
                      className={cn(
                        member.isApproved
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-orange-100 text-orange-800 border-orange-200"
                      )}
                    >
                      {member.isApproved ? "Approuvé" : "En attente"}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-foreground/60">
                    {new Date(member.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4">{member._count.activities}</td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setMemberToDelete({
                            id: member.id,
                            name: member.name,
                          })
                        }
                        disabled={deletingId === member.id}
                        className="text-red-600 cursor-pointer hover:bg-red-50 disabled:opacity-50"
                      >
                        {deletingId === member.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
