import Button from "./Button";
import {
  Copy,
  ExternalLink,
  LoaderCircle,
  QrCode,
  X,
} from "lucide-react";
import {
  buildOrderShareQrCodeUrl,
  copyTextToClipboard,
} from "../utils/orderShare.js";
import { useEffect, useState } from "react";

const OrderShareModal = ({
  error = "",
  isGenerating = false,
  isOpen = false,
  onClose,
  onGenerate,
  orderLabel = "",
  shareUrl = "",
}) => {
  const [copyMessage, setCopyMessage] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setCopyMessage("");
    }
  }, [isOpen, shareUrl]);

  if (!isOpen) {
    return null;
  }

  const handleCopyLink = async () => {
    try {
      await copyTextToClipboard(shareUrl);
      setCopyMessage("Share link copied.");
    } catch (copyError) {
      setCopyMessage(copyError.message || "Unable to copy the share link.");
    }
  };

  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-900/45 px-4 backdrop-blur-sm">
      <div className="w-full max-w-[560px] rounded-[1.6rem] bg-white p-6 shadow-[0_28px_70px_rgba(15,23,42,0.24)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-primary)]">
              Pickup QR
            </p>
            <h2 className="mt-2 text-[1.5rem] font-semibold tracking-[-0.03em] text-slate-900">
              Generate a pickup QR code
            </h2>
            <p className="mt-3 text-[0.92rem] leading-7 text-slate-500">
              Create a secure share link for {orderLabel}. The person handling pickup can open it from their phone or scan the QR code to view the order details on your website.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close pickup QR modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {!shareUrl ? (
          <div className="mt-6 rounded-[1.25rem] border border-dashed border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[var(--color-primary)] shadow-sm">
                <QrCode className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[0.92rem] font-semibold text-slate-900">
                  Share this order with a pickup helper
                </p>
                <p className="mt-2 text-[0.86rem] leading-6 text-slate-500">
                  We’ll generate a dedicated link and QR code for this order. Anyone with that link can open the shared pickup view, so only send it to the person you trust to collect the order for you.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
            <div className="rounded-[1.25rem] bg-slate-50 p-4">
              <img
                src={buildOrderShareQrCodeUrl(shareUrl)}
                alt={`QR code for ${orderLabel}`}
                className="h-full w-full rounded-[1rem] bg-white object-contain p-3 shadow-sm"
              />
            </div>
            <div className="space-y-4">
              <div className="rounded-[1.1rem] border border-slate-200 bg-slate-50 p-4">
                <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-slate-500">
                  Share Link
                </p>
                <p className="mt-2 break-all text-[0.86rem] leading-6 text-slate-700">
                  {shareUrl}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.82rem] font-semibold"
                >
                  <Copy className="h-4 w-4" />
                  <span>Copy Link</span>
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => window.open(shareUrl, "_blank", "noopener,noreferrer")}
                  className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.82rem] font-semibold"
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Open Shared Page</span>
                </Button>
              </div>

              {copyMessage && (
                <p className="text-[0.8rem] font-medium text-[var(--color-primary)]">
                  {copyMessage}
                </p>
              )}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-5 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-[0.82rem] font-semibold"
          >
            Close
          </Button>
          {!shareUrl && (
            <Button
              variant="primary"
              size="md"
              onClick={onGenerate}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-[0.82rem] font-semibold"
            >
              {isGenerating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4" />}
              <span>{isGenerating ? "Generating..." : "Generate Link & QR"}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderShareModal;
