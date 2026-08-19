import { useState } from "react";

import boasVindas from "../../videos/Boas-vindas.mp4";
import acomodacao from "../../videos/Onboarding-cadastrar-acomodacao.mp4";
import relatorio from "../../videos/Onboarding-relatorio.mp4";
import reserva from "../../videos/Onboarding-reserva.mp4";
import dashboard from "../../videos/onboarding-dashboard.mp4";
import financeiro from "../../videos/onboarding-financeiro.mp4";
import importAirbnb from '../../videos/importador-de-reservas.mp4'
import importBooking from '../../videos/Importador-booking.mp4'

const tutorialVideos = [
  {
    id: "boas-vindas",
    title: "Boas-vindas",
    step: "Passo 1",
    duration: "0:51",
    video: boasVindas,
  },
  {
    id: "acomodacao",
    title: "Cadastrar acomodação",
    step: "Passo 2",
    duration: "0:44",
    video: acomodacao,
  },
  {
    id: "reserva",
    title: "Gerenciar reservas",
    step: "Passo 3",
    duration: "1:05",
    video: reserva,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    step: "Passo 4",
    duration: "2:06",
    video: dashboard,
  },
  {
    id: "relatorio",
    title: "Relatórios",
    step: "Passo 5",
    duration: "0:58",
    video: relatorio,
  },
  {
    id: "financeiro",
    title: "Financeiro",
    step: "Passo 6",
    duration: "1:07",
    video: financeiro,
  },
  {
    id: "importAirbnb",
    title: "Importador de Reservas (Airbnb)",
    step: "Passo 7",
    duration: "3:51",
    video: importAirbnb,
  },
  {
    id: "importBooking",
    title: "Importador de Reservas (Booking)",
    step: "Passo 8",
    duration: "1:28",
    video: importBooking,
  }
];

export default function Tutorial({ onClose }: { onClose?: () => void }) {
  const [selectedVideoId, setSelectedVideoId] = useState(tutorialVideos[0].id);

  const selectedVideo =
    tutorialVideos.find((item) => item.id === selectedVideoId) ??
    tutorialVideos[0];

  return (
    <section className="fixed left-0 top-0 min-h-screen w-screen overflow-x-hidden z-10">
      <div className="absolute inset-0 bg-black/90"></div>
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8 max-h-full">
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl backdrop-blur-xl md:p-6 max-h-min relative">
            <button className="absolute right-4 top-4"
              onClick={onClose}>
              <svg
                className="w-10 h-10 fill-red-300"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 10.5858L14.8284 7.75736L16.2426 9.17157L13.4142 12L16.2426 14.8284L14.8284 16.2426L12 13.4142L9.17157 16.2426L7.75736 14.8284L10.5858 12L7.75736 9.17157L9.17157 7.75736L12 10.5858Z"></path>
              </svg>
            </button>
            <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">
              {selectedVideo.title}
            </h2>
            <video
              key={selectedVideo.id}
              src={selectedVideo.video}
              controls
              playsInline
              className="mt-6 h-auto w-full max-h-[60vh] min-h-[220px] rounded-3xl border border-white/10 bg-black shadow-2xl"
            />
          </article>

          <aside className="w-full">
            <div className="space-y-3 max-h-[calc(100vh-80px)] overflow-y-auto pr-1 scroll-default">
              {tutorialVideos.map((item) => {
                const isSelected = item.id === selectedVideo.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedVideoId(item.id)}
                    aria-pressed={isSelected}
                    className={`w-full rounded-3xl border p-4 text-left shadow-xl transition duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 ${
                      isSelected
                        ? "border-emerald-400/80 bg-emerald-400/10 shadow-emerald-900/30"
                        : "border-white/10 bg-white/5 hover:border-emerald-400/50 hover:bg-white/8"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/80">
                          {item.step}
                        </p>
                        <h4 className="mt-1 text-lg font-semibold text-white">
                          {item.title}
                        </h4>
                      </div>
                      <span className="rounded-full border border-white/10 bg-slate-900/80 px-3 py-1 text-xs text-slate-200">
                        {item.duration}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
