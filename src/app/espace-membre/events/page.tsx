"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Tag } from "lucide-react";

export default function EventsPage() {
  // Fake events data
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Concert de Jazz Congolais",
      category: "Musique",
      date: "2025-01-10",
      time: "19:00",
      location: "Salle principale",
      capacity: 150,
      registered: 120,
      price: "5000 FC",
      description:
        "Un concert exceptionnel mettant en avant les meilleures formations de jazz congolais.",
      isRegistered: true,
    },
    {
      id: 2,
      title: "Atelier de Danse Traditionnelle",
      category: "Danse",
      date: "2025-01-15",
      time: "14:00",
      location: "Studio B",
      capacity: 50,
      registered: 45,
      price: "3000 FC",
      description:
        "Apprenez les mouvements traditionnels de danse congolaise avec nos instructeurs expérimentés.",
      isRegistered: true,
    },
    {
      id: 3,
      title: "Projection Cinéma Africain",
      category: "Cinéma",
      date: "2025-01-20",
      time: "20:00",
      location: "Cinéma",
      capacity: 100,
      registered: 80,
      price: "2500 FC",
      description:
        "Découvrez les derniers chef-d'œuvres du cinéma africain dans une ambiance cinématographique.",
      isRegistered: false,
    },
    {
      id: 4,
      title: "Exposition Photographique",
      category: "Arts visuels",
      date: "2025-02-01",
      time: "10:00",
      location: "Galerie",
      capacity: 200,
      registered: 150,
      price: "Gratuit",
      description:
        "Une exposition mettant en avant les plus belles photographies du patrimoine africain.",
      isRegistered: false,
    },
    {
      id: 5,
      title: "Débat - La culture africaine en 2025",
      category: "Littérature",
      date: "2025-02-10",
      time: "18:00",
      location: "Auditorium",
      capacity: 200,
      registered: 100,
      price: "Gratuit",
      description:
        "Débat captivant avec intellectuels et artistes sur l'évolution de la culture africaine.",
      isRegistered: false,
    },
    {
      id: 6,
      title: "Cours de Théâtre - Mise en scène",
      category: "Théâtre",
      date: "2025-02-15",
      time: "16:00",
      location: "Studio A",
      capacity: 30,
      registered: 25,
      price: "7500 FC",
      description:
        "Formation intensive aux techniques de mise en scène théâtrale avec un metteur en scène renommé.",
      isRegistered: false,
    },
  ]);

  const handleRegister = (eventId: number) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, isRegistered: true, registered: event.registered + 1 }
          : event
      )
    );
  };

  const handleUnregister = (eventId: number) => {
    setEvents(
      events.map((event) =>
        event.id === eventId
          ? { ...event, isRegistered: false, registered: event.registered - 1 }
          : event
      )
    );
  };

  const occupancyPercentage = (registered: number, capacity: number) => {
    return Math.round((registered / capacity) * 100);
  };

  const getOccupancyColor = (percentage: number) => {
    if (percentage > 80) return "bg-red-100 text-red-800";
    if (percentage > 50) return "bg-amber-100 text-amber-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Événements</h1>
        <p className="text-muted-foreground mt-2">
          Découvrez et inscrivez-vous aux événements du centre
        </p>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {events.map((event) => (
          <Card
            key={event.id}
            className="flex flex-col hover:shadow-lg transition-shadow"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{event.title}</CardTitle>
                  <Badge variant="outline">{event.category}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col gap-4">
              {/* Description */}
              <p className="text-sm text-muted-foreground">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-primary" />
                  <span>
                    {new Date(event.date).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-primary" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  <span>{event.location}</span>
                </div>
              </div>

              {/* Occupancy & Price */}
              <div className="space-y-2 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span className="text-sm">Occupancy</span>
                  </div>
                  <Badge
                    className={getOccupancyColor(
                      occupancyPercentage(event.registered, event.capacity)
                    )}
                  >
                    {occupancyPercentage(event.registered, event.capacity)}%
                  </Badge>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{
                      width: `${occupancyPercentage(
                        event.registered,
                        event.capacity
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {event.registered} / {event.capacity} places
                </p>
              </div>

              {/* Price and Action */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center gap-1">
                  <Tag size={16} className="text-muted-foreground" />
                  <span className="font-semibold text-primary">
                    {event.price}
                  </span>
                </div>
                {event.isRegistered ? (
                  <Button
                    variant="outline"
                    onClick={() => handleUnregister(event.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Annuler l'inscription
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleRegister(event.id)}
                    disabled={event.registered >= event.capacity}
                  >
                    S'inscrire
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
