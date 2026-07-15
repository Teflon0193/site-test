"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CircleX,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  spaceRequestService,
  type BookedCalendarEvent,
} from "@/services/spaceRequestService";

const weekDays = [
  "Lun",
  "Mar",
  "Mer",
  "Jeu",
  "Ven",
  "Sam",
  "Dim",
];

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    date.getDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseDate(value: string) {
  const [year, month, day] = value
    .slice(0, 10)
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function formatLongDate(value: string) {
  return parseDate(value).toLocaleDateString(
    "fr-FR",
    {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );
}

export default function MemberEventsCalendarPage() {
  const today = useMemo(() => {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }, []);

  const [displayMonth, setDisplayMonth] =
    useState(
      () =>
        new Date(
          today.getFullYear(),
          today.getMonth(),
          1
        )
    );

  const [events, setEvents] = useState<
    BookedCalendarEvent[]
  >([]);
  const [selectedDate, setSelectedDate] =
    useState<string | null>(null);
  const [loading, setLoading] =
    useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const loadEvents = useCallback(
    async (showInitialLoader = true) => {
      try {
        if (showInitialLoader) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const data =
          await spaceRequestService.getBookedCalendarEvents();

        setEvents(
          Array.isArray(data) ? data : []
        );
      } catch (error) {
        console.error(
          "Member calendar error:",
          error
        );
        toast.error(
          "Impossible de charger les dates occupées."
        );
        setEvents([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const eventsByDate = useMemo(() => {
    const map = new Map<
      string,
      BookedCalendarEvent[]
    >();

    events.forEach((event) => {
      if (!event.date) return;

      const key = event.date.slice(0, 10);
      const current = map.get(key) || [];
      current.push(event);
      map.set(key, current);
    });

    return map;
  }, [events]);

  const calendarCells = useMemo(() => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();
    const daysInMonth = new Date(
      year,
      month + 1,
      0
    ).getDate();

    // Conversion dimanche=0 vers lundi=0.
    const leadingEmptyCells =
      (new Date(year, month, 1).getDay() +
        6) %
      7;

    const cells: Array<Date | null> =
      Array.from(
        { length: leadingEmptyCells },
        () => null
      );

    for (
      let day = 1;
      day <= daysInMonth;
      day += 1
    ) {
      cells.push(new Date(year, month, day));
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return cells;
  }, [displayMonth]);

  const selectedEvents = selectedDate
    ? eventsByDate.get(selectedDate) || []
    : [];

  const selectedIsPast = selectedDate
    ? parseDate(selectedDate) < today
    : false;

  const monthTitle =
    displayMonth.toLocaleDateString(
      "fr-FR",
      {
        month: "long",
        year: "numeric",
      }
    );

  const changeMonth = (offset: number) => {
    setDisplayMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() + offset,
          1
        )
    );
    setSelectedDate(null);
  };

  return (
    <div className="space-y-6 text-[#5C4033]">
      <section className="rounded-2xl bg-[#D1965B] p-6 text-white shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-white/15 p-3">
            <CalendarCheck2 className="h-7 w-7" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-white/75">
              Disponibilité des espaces
            </p>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
              Calendrier des événements
            </h1>
            <p className="mt-2 max-w-3xl text-white/90">
              Consultez les dates déjà confirmées
              avant d’introduire une nouvelle demande
              d’occupation.
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <section className="overflow-hidden rounded-2xl border border-[#D1965B]/15 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-[#D1965B]/15 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => changeMonth(-1)}
                className="border-[#D1965B]/30"
                aria-label="Mois précédent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <h2 className="min-w-48 text-center text-xl font-bold capitalize">
                {monthTitle}
              </h2>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => changeMonth(1)}
                className="border-[#D1965B]/30"
                aria-label="Mois suivant"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDisplayMonth(
                    new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      1
                    )
                  );
                  setSelectedDate(
                    dateKey(today)
                  );
                }}
                className="border-[#D1965B]/30"
              >
                Aujourd’hui
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={refreshing}
                onClick={() =>
                  void loadEvents(false)
                }
                className="border-[#D1965B]/30"
                aria-label="Actualiser"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    refreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[500px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#D1965B]" />
                <p className="mt-3 text-sm text-[#5C4033]/60">
                  Chargement du calendrier...
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3 sm:p-6">
              <div className="grid grid-cols-7 border-b border-[#D1965B]/15 pb-2">
                {weekDays.map((day, index) => (
                  <div
                    key={day}
                    className={`py-2 text-center text-xs font-bold uppercase tracking-wide ${
                      index === 6
                        ? "text-red-500"
                        : "text-[#5C4033]/55"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="mt-2 grid grid-cols-7 gap-1.5 sm:gap-2">
                {calendarCells.map(
                  (date, index) => {
                    if (!date) {
                      return (
                        <div
                          key={`empty-${index}`}
                          className="min-h-16 sm:min-h-24"
                        />
                      );
                    }

                    const key = dateKey(date);
                    const bookedEvents =
                      eventsByDate.get(key) || [];
                    const isBooked =
                      bookedEvents.length > 0;
                    const isPast = date < today;
                    const isToday =
                      key === dateKey(today);
                    const isSelected =
                      selectedDate === key;

                    return (
                      <button
                        key={key}
                        type="button"
                        disabled={isPast}
                        onClick={() =>
                          setSelectedDate(key)
                        }
                        className={`relative min-h-16 rounded-xl border p-1.5 text-left transition sm:min-h-24 sm:p-3 ${
                          isPast
                            ? "cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                            : isSelected
                              ? "border-[#5C4033] ring-2 ring-[#D1965B]/25"
                              : isBooked
                                ? "border-red-200 bg-red-50 hover:border-red-300"
                                : "border-emerald-100 bg-emerald-50/60 hover:border-emerald-300 hover:bg-emerald-50"
                        }`}
                      >
                        <span
                          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-bold ${
                            isToday
                              ? "bg-[#D1965B] text-white"
                              : ""
                          }`}
                        >
                          {date.getDate()}
                        </span>

                        {!isPast && (
                          <span
                            className={`mt-1 hidden text-[11px] font-semibold sm:block ${
                              isBooked
                                ? "text-red-700"
                                : "text-emerald-700"
                            }`}
                          >
                            {isBooked
                              ? "Occupée"
                              : "Disponible"}
                          </span>
                        )}

                        {isBooked && !isPast && (
                          <span className="absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500" />
                        )}
                      </button>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </section>

        <aside className="space-y-5">
          <section className="rounded-2xl border border-[#D1965B]/15 bg-white p-5 shadow-sm">
            <h2 className="font-bold">
              Légende
            </h2>

            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded bg-emerald-100 ring-1 ring-emerald-300" />
                Date disponible
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded bg-red-100 ring-1 ring-red-300" />
                Date occupée et confirmée
              </div>
              <div className="flex items-center gap-3">
                <span className="h-4 w-4 rounded bg-gray-100 ring-1 ring-gray-200" />
                Date passée
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#D1965B]/15 bg-white p-5 shadow-sm">
            {!selectedDate ? (
              <div className="py-5 text-center">
                <CalendarCheck2 className="mx-auto h-10 w-10 text-[#D1965B]/45" />
                <h2 className="mt-3 font-bold">
                  Sélectionnez une date
                </h2>
                <p className="mt-1 text-sm text-[#5C4033]/60">
                  Cliquez sur une date du calendrier
                  pour vérifier sa disponibilité.
                </p>
              </div>
            ) : selectedIsPast ? (
              <div>
                <CircleX className="h-9 w-9 text-gray-400" />
                <h2 className="mt-3 font-bold">
                  Date passée
                </h2>
              </div>
            ) : selectedEvents.length > 0 ? (
              <div>
                <CircleX className="h-9 w-9 text-red-500" />
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-red-600">
                  Date occupée
                </p>
                <h2 className="mt-1 font-bold capitalize">
                  {formatLongDate(selectedDate)}
                </h2>

                <div className="mt-4 space-y-3">
                  {selectedEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-xl border border-red-100 bg-red-50 p-3"
                    >
                      <p className="font-semibold text-red-900">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-red-700">
                        {event.reference}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-sm leading-6 text-[#5C4033]/65">
                  Choisissez une autre date pour votre
                  demande d’occupation.
                </p>
              </div>
            ) : (
              <div>
                <CircleCheck className="h-9 w-9 text-emerald-600" />
                <p className="mt-3 text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Date disponible
                </p>
                <h2 className="mt-1 font-bold capitalize">
                  {formatLongDate(selectedDate)}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#5C4033]/65">
                  Aucune occupation confirmée n’est
                  enregistrée pour cette date.
                </p>

                <Button
                  asChild
                  className="mt-5 w-full bg-[#D1965B] text-white hover:bg-[#B97D47]"
                >
                  <Link
                    href={`/espace-membre/membre/nouvelle-demande?date=${selectedDate}`}
                  >
                    Demander cette date
                  </Link>
                </Button>
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}