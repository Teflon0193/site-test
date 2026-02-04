"use client";

import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Download } from "lucide-react";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFPreviewProps {
  pdfUrl: string;
  maxPages?: number;
  onDownloadClick: () => void;
  isAuthenticated: boolean;
}

function getPageWidth() {
  if (typeof window === "undefined") return 800;
  return Math.min(800, window.innerWidth - 40);
}

export default function PDFPreview({
  pdfUrl,
  maxPages = 2,
  onDownloadClick,
  isAuthenticated,
}: PDFPreviewProps) {
  const [numPages, setNumPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pageWidth, setPageWidth] = useState(800);

  useEffect(() => {
    setPageWidth(getPageWidth());
    const handleResize = () => setPageWidth(getPageWidth());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="pdf-preview-wrapper w-full">
      <Document
        file={pdfUrl}
        onLoadSuccess={({ numPages }) => {
          setNumPages(numPages);
          setLoading(false);
        }}
        onLoadError={(error) => {
          console.error("[PDF Preview] Error loading PDF:", error);
          setLoading(false);
        }}
        loading={
          <div className="w-full h-96 bg-zinc-50 animate-pulse border-2 border-zinc-100 flex items-center justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
              Chargement de la liseuse...
            </p>
          </div>
        }
        className="pdf-document"
      >
        <div className="space-y-12">
          {!loading &&
            Array.from(new Array(Math.min(maxPages, numPages)), (_, i) => (
              <div
                key={`page_${i + 1}`}
                className="pdf-page-container flex justify-center"
              >
                <Page
                  pageNumber={i + 1}
                  width={pageWidth}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="pdf-page shadow-none border-4 border-black bg-white"
                />
              </div>
            ))}
        </div>
      </Document>

      {numPages > maxPages && (
        <div className="relative mt-20">
          {/* Sharp overlay */}
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] h-64 -mt-64 border-t-2 border-dashed border-zinc-300 pointer-events-none" />

          {/* CTA Banner */}
          <div className="relative z-10 bg-primary text-white p-12 md:p-16 flex flex-col items-center justify-center text-center">
            <div className="max-w-xl space-y-8">
              <div className="h-1 w-24 bg-white mx-auto"></div>

              <div className="space-y-4">
                <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                  Contenu <br />
                  <span className="text-white">Limité</span>
                </h3>

                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                  <span className="text-white">
                    +{numPages - maxPages} PAGES
                  </span>{" "}
                  SUPPLÉMENTAIRES DANS L&apos;ÉDITION COMPLÈTE
                </p>
              </div>

              <div className="pt-4 flex flex-col items-center gap-6">
                <button
                  onClick={onDownloadClick}
                  className="group relative inline-flex items-center gap-4 bg-white text-black px-10 py-5 font-black uppercase tracking-[0.2em] text-xs hover:bg-accent hover:text-white transition-all duration-300"
                >
                  <Download className="h-4 w-4" />
                  {isAuthenticated
                    ? "TÉLÉCHARGER LE PDF COMPLET"
                    : "SE CONNECTER POUR TÉLÉCHARGER"}
                </button>

                {!isAuthenticated && (
                  <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-500">
                    CRÉEZ UN COMPTE POUR ACCÉDER À TOUTES NOS PUBLICATIONS
                  </p>
                )}
              </div>
            </div>

            {/* Decorative corner */}
            <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-white/20"></div>
            <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-white/20"></div>
          </div>
        </div>
      )}
    </div>
  );
}
