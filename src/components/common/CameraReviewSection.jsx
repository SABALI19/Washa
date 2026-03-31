import Button from "../Button";
import { Camera, ScanLine } from "lucide-react";

const CameraReviewSection = ({
  capturedItems = [],
  onCapturePhoto,
  onActivateCamera,
  previewTitle = "Camera Preview",
  previewStatus = "Camera Ready",
  previewDescription = "Position your clothing item in the frame",
  captureLabel = "Capture Photo",
  activateLabel = "Activate Camera",
}) => {
  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <h3 className="mb-5 text-xl font-inter font-semibold text-slate-900">
          {previewTitle}
        </h3>

        <div className="rounded-2xl bg-slate-50 p- shadow-inner ring-1 ring-slate-100 sm:p-">
          <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#2c4a7d]/20 bg-[#f5f7f7]  px-6 text-center">
            <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-md">
              <Camera className="h-10 w-10 text-[#2c4a7d]" />
            </div>

            <h4 className="text-xl font-inter font-semibold text-slate-700">
              {previewStatus}
            </h4>
            <p className="mt-3 max-w-md text-lg text-slate-500">
              {previewDescription}
            </p>

            <Button
              variant="primary"
              size="md"
              className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base"
              onClick={onCapturePhoto}
            >
              <Camera className="h-5 w-5" />
              <span>{captureLabel}</span>
            </Button>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            variant="secondary"
            size="md"
            className="inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base"
            onClick={onActivateCamera}
          >
            <ScanLine className="h-5 w-5" />
            <span>{activateLabel}</span>
          </Button>
        </div>
      </div>

      <div>
        <h3 className="mb-5 text-2xl font-semibold text-slate-900">
          Captured Items ({capturedItems.length})
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
  {capturedItems.map((item) => (
    <article
      key={item.id}
      className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200"
    >
      <div className="h-32 p-2">
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover rounded-lg"
        />
      </div>
      <div className="p-1 flex items-center justify-center text-center">
        <p className="text-lg font-semibold text-slate-900">
          {item.name}
        </p>
      </div>
    </article>
  ))}
</div>
      </div>
    </div>
  );
};

export default CameraReviewSection;
