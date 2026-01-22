import { useState, useEffect } from "react";
import Spinner from "@/components/feedback/Spinner";

interface PDFPreviewProps {
  file: File | string;
  className?: string;
}

export function PDFPreview({ file, className = "" }: Readonly<PDFPreviewProps>) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let objectUrl: string | null = null;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);

        const pdfjsLib = await import("pdfjs-dist");

        const pdfjsWorker = await import("pdfjs-dist/build/pdf.worker.min.mjs?url");
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker.default;

        let pdfData: string | ArrayBuffer | Uint8Array;

        if (file instanceof File) {
          const arrayBuffer = await file.arrayBuffer();
          pdfData = new Uint8Array(arrayBuffer);
        } else {
          pdfData = file;
        }

        const pdf = await pdfjsLib.getDocument(pdfData).promise;

        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Canvas context를 가져올 수 없습니다");
        }

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        const imageUrl = canvas.toDataURL("image/png");
        setPreviewUrl(imageUrl);
        setLoading(false);
      } catch (err) {
        console.error("PDF 로드 에러:", err);
        setError(err instanceof Error ? err.message : "PDF를 불러올 수 없습니다");
        setLoading(false);
      }
    };

    loadPDF();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  if (loading) {
    return (
      <div className={`flex h-full w-full items-center justify-center ${className}`}>
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex h-full w-full items-center justify-center ${className}`}>
        <p className="text-xs text-red-400">⚠️ 로드 실패</p>
      </div>
    );
  }

  if (!previewUrl) {
    return null;
  }

  return (
    <img
      src={previewUrl}
      alt="PDF 미리보기"
      className={`h-full w-full rounded-2xl object-cover ${className}`}
    />
  );
}
