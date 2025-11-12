"use client";

import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, User, Calendar, Loader2 } from "lucide-react";
import { approveMemberAction } from "./actions";
import { toast } from "sonner";

interface ApprovalCardProps {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    phone: string | null;
  };
}

export function ApprovalCard({ user }: ApprovalCardProps) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await approveMemberAction(user.id);
      if (result.success) {
        toast.success(result.message || "Membre approuvé avec succès");
      } else {
        toast.error(result.error || "Erreur lors de l'approbation");
      }
    } catch (error) {
      toast.error("Une erreur inattendue s'est produite");
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow py-4">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-3 flex-1">
            {/* Infos utilisateur */}
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg truncate">
                    {user.name}
                  </h3>
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-600 border-orange-200"
                  >
                    En attente
                  </Badge>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-1.5">
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">{user.phone}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Inscription le{" "}
                    {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="w-full sm:w-auto cursor-pointer bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Approuver et envoyer l'email"
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full cursor-pointer sm:w-auto border-red-200 text-red-600 hover:bg-red-50"
              disabled={isApproving}
            >
              Refuser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
