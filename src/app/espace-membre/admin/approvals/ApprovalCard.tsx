"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, User, Calendar, Loader2, Check, X, Phone } from "lucide-react";
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
  const queryClient = useQueryClient();
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      const result = await approveMemberAction(user.id);
      if (result.success) {
        toast.success(result.message || "Membre approuvé avec succès");
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ["admin", "approvals"] }),
          queryClient.invalidateQueries({ queryKey: ["admin", "stats"] }),
          queryClient.invalidateQueries({ queryKey: ["admin", "members"] }),
        ]);
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
    <Card className="border-none shadow-sm bg-white hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-foreground">
                  {user.name}
                </h3>
                <Badge
                  variant="secondary"
                  className="bg-orange-50 text-orange-700 hover:bg-orange-100 border-0"
                >
                  En attente
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mt-2">
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span className="truncate">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span className="truncate">{user.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
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

          <div className="flex items-center gap-3 w-full lg:w-auto pl-16 lg:pl-0">
            <Button
              onClick={handleApprove}
              disabled={isApproving}
              className="flex-1 lg:flex-none bg-green-600 hover:bg-green-700 text-white shadow-sm"
            >
              {isApproving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Approuver
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="flex-1 lg:flex-none border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
              disabled={isApproving}
            >
              <X className="w-4 h-4 mr-2" />
              Refuser
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
