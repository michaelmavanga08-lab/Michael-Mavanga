/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useEffect } from 'react';
import { PenTool, Trash2, CheckCircle2 } from 'lucide-react';
import { translations } from '../locales';
import { AppLanguage } from '../types';

interface SignatureCanvasProps {
  language: AppLanguage;
  onSave: (signatureDataUrl: string) => void;
  onClear: () => void;
  initialSignature: string | null;
}

export default function SignatureCanvas({
  language,
  onSave,
  onClear,
  initialSignature,
}: SignatureCanvasProps) {
  const t = translations[language];
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  // Set up high DPI support for the canvas and draw initial signature if exists
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set brush styles
    ctx.strokeStyle = '#0f172a'; // Deep slate
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Clear and draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasSigned(true);
      };
      img.src = initialSignature;
    } else {
      setHasSigned(false);
    }
  }, [initialSignature]);

  // Handle Redrawing background on size modifications or cleanups
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
    onClear();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    // Check if TouchEvent or MouseEvent
    if ('touches' in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Save current drawing to parent
    const dataUrl = canvas.toDataURL('image/png');
    onSave(dataUrl);
  };

  return (
    <div className="space-y-3" id="signature-canvas-wrapper">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-700 dark:text-zinc-300 flex items-center space-x-1.5">
          <PenTool className="w-3.5 h-3.5 text-amber-500" />
          <span>{t.signaturePlaceholder}</span>
        </label>
        {hasSigned && (
          <span className="flex items-center space-x-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
            <CheckCircle2 className="w-3 h-3" />
            <span>Captured</span>
          </span>
        )}
      </div>

      <div className="relative border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          width={400}
          height={180}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-[180px] bg-white cursor-crosshair touch-none block"
          id="handwritten-signature-canvas"
        />
        
        {!hasSigned && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-gray-300 dark:text-zinc-600">
            <p className="text-xs font-sans text-center px-4">
              {t.signaturePlaceholder}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          id="btn-clear-signature"
          onClick={clearCanvas}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-[11px] text-gray-600 dark:text-zinc-400 font-medium transition-all cursor-pointer"
        >
          <Trash2 className="w-3 h-3 text-red-500" />
          <span>{t.clearSignature}</span>
        </button>
      </div>
    </div>
  );
}
