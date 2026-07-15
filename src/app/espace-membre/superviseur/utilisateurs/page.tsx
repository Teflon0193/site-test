"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { isAxiosError } from "axios";
import { KeyRound, RefreshCw, Search, ShieldCheck, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ASSIGNABLE_ROLES,
  supervisorService,
  type AssignableRole,
  type SupervisedUser,
} from "../supervisorService";

const roleLabels: Record<AssignableRole, string> = {
  MEMBER: "Membre",
  PROGRAMME: "Programmes",
  PROGRAMME_SUPERVISEUR: "Superviseur Programme",
  PROGRAMME_ASSISTANT: "Assistant Programme",
  REGISSEUR_GENERAL: "Régisseur général",
  DIRECTION_ARTISTIQUE: "Direction artistique",
  COMMUNICATION: "Communication",
  JURIDIQUE: "Juridique",
  FINANCE: "Finances",
  SUPERVISEUR: "Superviseur",
  ADMIN: "Administrateur",
};

function getErrorMessage(error: unknown) {
  if (isAxiosError(error)) {
    return error.response?.data?.message || "Une erreur est survenue.";
  }
  return error instanceof Error ? error.message : "Une erreur est survenue.";
}

export default function SupervisorUsersPage() {
  const [users, setUsers] = useState<SupervisedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [query, setQuery] = useState("");
  const [resetUser, setResetUser] = useState<SupervisedUser | null>(null);
  const [password, setPassword] = useState("");

  const loadUsers = useCallback(async () => {
    try {
      setLoading(true);
      setUsers(await supervisorService.getUsers());
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return users;
    return users.filter((user) =>
      `${user.first_name} ${user.last_name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(value)
    );
  }, [users, query]);

  const changeRole = async (user: SupervisedUser, role: AssignableRole) => {
    try {
      await supervisorService.assignRole(user.id, role);
      setUsers((list) =>
        list.map((item) => (item.id === user.id ? { ...item, role } : item))
      );
      toast.success("Rôle attribué avec succès");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const resetPassword = async () => {
    if (!resetUser || password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      setProcessing(true);
      await supervisorService.resetPassword(resetUser.id, password);
      toast.success("Mot de passe réinitialisé");
      setResetUser(null);
      setPassword("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProcessing(false);
    }
  };

  const deleteUser = async (user: SupervisedUser) => {
    const accepted = window.confirm(
      `Supprimer définitivement ${user.first_name} ${user.last_name} ?`
    );
    if (!accepted) return;

    try {
      await supervisorService.deleteUser(user.id);
      setUsers((list) => list.filter((item) => item.id !== user.id));
      toast.success("Utilisateur supprimé");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-7">
      <section className="rounded-2xl bg-[#D1965B] p-6 text-white sm:p-8">
        <p className="text-sm uppercase tracking-wider text-white/75">Supervision</p>
        <h1 className="mt-2 text-3xl font-bold">Utilisateurs et rôles</h1>
        <p className="mt-2 text-white/85">
          Attribuez tous les rôles, réinitialisez les mots de passe et supprimez les comptes.
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-[#5C4033]/40" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Nom, email ou rôle..."
            className="border-[#D1965B]/25 bg-white pl-9"
          />
        </div>
        <Button variant="outline" onClick={() => void loadUsers()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Actualiser
        </Button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldCheck className="mr-2 inline h-4 w-4" />
        Les rôles ADMIN et SUPERVISEUR donnent des permissions importantes. Vérifiez le compte avant de les attribuer.
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#D1965B]/15 bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center">Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-[#F8F5EF] text-left text-[#5C4033]">
                <tr>
                  <th className="p-4">Utilisateur</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Rôle</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D1965B]/10">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="p-4 font-semibold text-[#5C4033]">
                      {user.first_name} {user.last_name}
                    </td>
                    <td className="p-4 text-[#5C4033]/65">{user.email}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(event) =>
                          void changeRole(user, event.target.value as AssignableRole)
                        }
                        className="rounded-lg border border-[#D1965B]/30 bg-white px-3 py-2 text-[#5C4033]"
                      >
                        {ASSIGNABLE_ROLES.map((role) => (
                          <option key={role} value={role}>
                            {roleLabels[role]}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => setResetUser(user)}>
                          <KeyRound className="mr-2 h-4 w-4" /> Mot de passe
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => void deleteUser(user)}
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
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
        )}
      </div>

      {resetUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
            <div className="flex justify-between border-b p-5">
              <div>
                <h2 className="text-xl font-bold text-[#5C4033]">Nouveau mot de passe</h2>
                <p className="text-sm text-[#5C4033]/60">{resetUser.email}</p>
              </div>
              <button onClick={() => setResetUser(null)}><X /></button>
            </div>
            <div className="p-5">
              <Label>Mot de passe temporaire</Label>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2"
              />
              <div className="mt-5 flex justify-end gap-2">
                <Button variant="outline" onClick={() => setResetUser(null)}>Annuler</Button>
                <Button
                  onClick={() => void resetPassword()}
                  disabled={processing}
                  className="bg-[#D1965B] text-white"
                >
                  {processing ? "Traitement..." : "Réinitialiser"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}