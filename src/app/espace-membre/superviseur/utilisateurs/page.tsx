"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isAxiosError } from "axios";
import {
  KeyRound,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  supervisorService,
  type AssignableRole as ServiceAssignableRole,
  type SupervisedUser,
} from "../supervisorService";

const ASSIGNABLE_ROLES = [
  "MEMBER",
  "PROGRAMME_SUPERVISEUR",
  "PROGRAMME_ASSISTANT",
  "REGISSEUR_GENERAL",
  "DIRECTION_ARTISTIQUE_SUPERVISEUR",
  "DIRECTION_ARTISTIQUE_ASSISTANT",
  "COMMUNICATION",
  "JURIDIQUE_SUPERVISEUR",
  "JURIDIQUE_ASSISTANT",
  "FINANCE",
  "SUPERVISEUR",
  "ADMIN",
] as const;

type AssignableRole =
  (typeof ASSIGNABLE_ROLES)[number];

type ManagedUser = Omit<
  SupervisedUser,
  "role"
> & {
  role: AssignableRole | string;
};

const roleLabels: Record<
  AssignableRole,
  string
> = {
  MEMBER: "Membre",

  PROGRAMME_SUPERVISEUR:
    "Superviseur Programme",

  PROGRAMME_ASSISTANT:
    "Assistant Programme",

  REGISSEUR_GENERAL:
    "Régisseur général",

  DIRECTION_ARTISTIQUE_SUPERVISEUR:
    "Superviseur Direction artistique",

  DIRECTION_ARTISTIQUE_ASSISTANT:
    "Assistant Direction artistique",

  COMMUNICATION:
    "Communication",

  JURIDIQUE_SUPERVISEUR:
    "Superviseur Juridique",

  JURIDIQUE_ASSISTANT:
    "Assistant Juridique",

  FINANCE:
    "Finances",

  SUPERVISEUR:
    "Superviseur général",

  ADMIN:
    "Administrateur",
};

function getErrorMessage(
  error: unknown
): string {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      "Une erreur est survenue."
    );
  }

  return error instanceof Error
    ? error.message
    : "Une erreur est survenue.";
}

export default function SupervisorUsersPage() {
  const [users, setUsers] = useState<
    ManagedUser[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [processing, setProcessing] =
    useState(false);

  const [changingRoleId, setChangingRoleId] =
    useState<number | null>(null);

  const [deletingUserId, setDeletingUserId] =
    useState<number | null>(null);

  const [query, setQuery] = useState("");

  const [resetUser, setResetUser] =
    useState<ManagedUser | null>(null);

  const [password, setPassword] =
    useState("");

  const loadUsers = useCallback(
    async () => {
      try {
        setLoading(true);

        const data =
          await supervisorService.getUsers();

        setUsers(data);
      } catch (error) {
        console.error(
          "Supervisor users loading error:",
          error
        );

        toast.error(
          getErrorMessage(error)
        );
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const value = query
      .trim()
      .toLowerCase();

    if (!value) {
      return users;
    }

    return users.filter((user) => {
      const searchableValue = [
        user.first_name,
        user.last_name,
        user.email,
        user.role,
        roleLabels[
          user.role as AssignableRole
        ] || "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableValue.includes(
        value
      );
    });
  }, [users, query]);

  const changeRole = async (
    user: ManagedUser,
    role: AssignableRole
  ) => {
    if (user.role === role) {
      return;
    }

    const previousRole = user.role;

    try {
      setChangingRoleId(user.id);

      /*
       * Mise à jour optimiste pour que
       * l'interface réagisse immédiatement.
       */
      setUsers((list) =>
        list.map((item) =>
          item.id === user.id
            ? {
                ...item,
                role,
              }
            : item
        )
      );

      const updatedUser =
        await supervisorService.assignRole(
          user.id,
          role as ServiceAssignableRole
        );

      setUsers((list) =>
        list.map((item) =>
          item.id === user.id
            ? {
                ...item,
                ...updatedUser,
                role:
                  updatedUser?.role ||
                  role,
              }
            : item
        )
      );

      toast.success(
        "Rôle attribué avec succès",
        {
          description:
            `${user.first_name} ${user.last_name} est maintenant ${
              roleLabels[role]
            }.`,
        }
      );
    } catch (error) {
      /*
       * Restaurer l'ancien rôle si
       * la requête backend échoue.
       */
      setUsers((list) =>
        list.map((item) =>
          item.id === user.id
            ? {
                ...item,
                role: previousRole,
              }
            : item
        )
      );

      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setChangingRoleId(null);
    }
  };

  const resetPassword = async () => {
    const cleanPassword =
      password.trim();

    if (
      !resetUser ||
      cleanPassword.length < 6
    ) {
      toast.error(
        "Le mot de passe doit contenir au moins 6 caractères."
      );

      return;
    }

    try {
      setProcessing(true);

      await supervisorService.resetPassword(
        resetUser.id,
        cleanPassword
      );

      toast.success(
        "Mot de passe réinitialisé",
        {
          description:
            `Le mot de passe de ${resetUser.first_name} ${resetUser.last_name} a été modifié.`,
        }
      );

      setResetUser(null);
      setPassword("");
    } catch (error) {
      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setProcessing(false);
    }
  };

  const closePasswordModal = () => {
    if (processing) {
      return;
    }

    setResetUser(null);
    setPassword("");
  };

  const deleteUser = async (
    user: ManagedUser
  ) => {
    const accepted =
      window.confirm(
        `Supprimer définitivement le compte de ${user.first_name} ${user.last_name} ?`
      );

    if (!accepted) {
      return;
    }

    try {
      setDeletingUserId(user.id);

      await supervisorService.deleteUser(
        user.id
      );

      setUsers((list) =>
        list.filter(
          (item) =>
            item.id !== user.id
        )
      );

      toast.success(
        "Utilisateur supprimé"
      );
    } catch (error) {
      toast.error(
        getErrorMessage(error)
      );
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="space-y-7">
      <section className="rounded-2xl bg-[#D1965B] p-6 text-white shadow-sm sm:p-8">
        <p className="text-sm uppercase tracking-wider text-white/75">
          Supervision
        </p>

        <h1 className="mt-2 text-3xl font-bold">
          Utilisateurs et rôles
        </h1>

        <p className="mt-2 max-w-3xl text-white/85">
          Attribuez les rôles des
          services, gérez les superviseurs
          et assistants, réinitialisez les
          mots de passe et supprimez les
          comptes.
        </p>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C4033]/40" />

          <Input
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="Nom, email ou rôle..."
            className="border-[#D1965B]/25 bg-white pl-9 pr-10"
          />

          {query && (
            <button
              type="button"
              onClick={() =>
                setQuery("")
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-[#5C4033]/40 transition hover:bg-[#F3EEE5] hover:text-[#5C4033]"
              aria-label="Effacer la recherche"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            void loadUsers()
          }
          disabled={loading}
          className="border-[#D1965B]/30 text-[#5C4033]"
        >
          <RefreshCw
            className={`mr-2 h-4 w-4 ${
              loading
                ? "animate-spin"
                : ""
            }`}
          />

          Actualiser
        </Button>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <ShieldCheck className="mr-2 inline h-4 w-4" />

        Les rôles Administrateur et
        Superviseur général donnent des
        permissions importantes. Vérifiez
        le compte avant de les attribuer.
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#D1965B]/15 bg-white shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-[#5C4033]/60">
            Chargement des
            utilisateurs...
          </div>
        ) : filteredUsers.length ===
          0 ? (
          <div className="p-12 text-center">
            <Search className="mx-auto h-10 w-10 text-[#D1965B]/40" />

            <p className="mt-3 font-semibold text-[#5C4033]">
              Aucun utilisateur trouvé
            </p>

            <p className="mt-1 text-sm text-[#5C4033]/60">
              Modifiez votre recherche
              ou actualisez la liste.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-sm">
              <thead className="bg-[#F8F5EF] text-left text-[#5C4033]">
                <tr>
                  <th className="p-4">
                    Utilisateur
                  </th>

                  <th className="p-4">
                    Email
                  </th>

                  <th className="p-4">
                    Rôle actuel
                  </th>

                  <th className="p-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#D1965B]/10">
                {filteredUsers.map(
                  (user) => {
                    const roleIsChanging =
                      changingRoleId ===
                      user.id;

                    const userIsDeleting =
                      deletingUserId ===
                      user.id;

                    return (
                      <tr
                        key={user.id}
                        className="transition hover:bg-[#F8F5EF]/60"
                      >
                        <td className="p-4">
                          <p className="font-semibold text-[#5C4033]">
                            {
                              user.first_name
                            }{" "}
                            {
                              user.last_name
                            }
                          </p>

                          <p className="mt-1 text-xs text-[#5C4033]/50">
                            Identifiant :
                            {user.id}
                          </p>
                        </td>

                        <td className="p-4 text-[#5C4033]/65">
                          {user.email}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <select
                              value={
                                user.role
                              }
                              onChange={(
                                event
                              ) =>
                                void changeRole(
                                  user,
                                  event
                                    .target
                                    .value as AssignableRole
                                )
                              }
                              disabled={
                                roleIsChanging ||
                                userIsDeleting
                              }
                              className="min-w-[250px] rounded-lg border border-[#D1965B]/30 bg-white px-3 py-2 text-[#5C4033] outline-none transition focus:border-[#D1965B] focus:ring-2 focus:ring-[#D1965B]/20 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {ASSIGNABLE_ROLES.map(
                                (role) => (
                                  <option
                                    key={
                                      role
                                    }
                                    value={
                                      role
                                    }
                                  >
                                    {
                                      roleLabels[
                                        role
                                      ]
                                    }
                                  </option>
                                )
                              )}
                            </select>

                            {roleIsChanging && (
                              <RefreshCw className="h-4 w-4 animate-spin text-[#D1965B]" />
                            )}
                          </div>
                        </td>

                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setResetUser(
                                  user
                                );
                                setPassword(
                                  ""
                                );
                              }}
                              disabled={
                                roleIsChanging ||
                                userIsDeleting
                              }
                            >
                              <KeyRound className="mr-2 h-4 w-4" />

                              Mot de passe
                            </Button>

                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                void deleteUser(
                                  user
                                )
                              }
                              disabled={
                                roleIsChanging ||
                                userIsDeleting
                              }
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                              aria-label={`Supprimer ${user.first_name} ${user.last_name}`}
                            >
                              {userIsDeleting ? (
                                <RefreshCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {resetUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#D1965B]/15 p-5">
              <div>
                <h2 className="text-xl font-bold text-[#5C4033]">
                  Nouveau mot de passe
                </h2>

                <p className="mt-1 text-sm text-[#5C4033]/60">
                  {resetUser.email}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closePasswordModal
                }
                disabled={processing}
                className="rounded-lg p-1 text-[#5C4033]/60 transition hover:bg-[#F3EEE5] hover:text-[#5C4033]"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5">
              <Label htmlFor="temporary-password">
                Mot de passe temporaire
              </Label>

              <Input
                id="temporary-password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                placeholder="Au moins 6 caractères"
                className="mt-2"
                autoComplete="new-password"
              />

              <p className="mt-2 text-xs text-[#5C4033]/55">
                Communiquez ce mot de
                passe temporaire à
                l’utilisateur de manière
                sécurisée.
              </p>

              <div className="mt-5 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    closePasswordModal
                  }
                  disabled={processing}
                >
                  Annuler
                </Button>

                <Button
                  type="button"
                  onClick={() =>
                    void resetPassword()
                  }
                  disabled={
                    processing ||
                    password.trim()
                      .length < 6
                  }
                  className="bg-[#D1965B] text-white hover:bg-[#B97D47]"
                >
                  {processing
                    ? "Traitement..."
                    : "Réinitialiser"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}