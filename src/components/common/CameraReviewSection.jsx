import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { Camera, ScanLine, Trash2, Upload } from "lucide-react";

const CameraReviewSection = ({
  capturedItems = [],
  onCapturedItemsChange,
  onCapturePhoto,
  onActivateCamera,
  previewTitle = "Camera Preview",
  previewStatus = "Camera Ready",
  previewDescription = "Position your clothing item in the frame",
  captureLabel = "Capture Photo",
  activateLabel = "Activate Camera",
}) => {
  const [cameraError, setCameraError] = useState("");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isStartingCamera, setIsStartingCamera] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const streamRef = useRef(null);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsCameraActive(false);
  };

  useEffect(() => stopCameraStream, []);

  const activateCamera = async () => {
    if (!navigator?.mediaDevices?.getUserMedia) {
      setCameraError(
        "This device or browser does not support camera access. Upload photos instead."
      );
      return;
    }

    setIsStartingCamera(true);
    setCameraError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      stopCameraStream();
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      onActivateCamera?.(stream);
    } catch {
      setCameraError(
        "Camera access was blocked. Please allow permission or upload photos from your device."
      );
      setIsCameraActive(false);
    } finally {
      setIsStartingCamera(false);
    }
  };

  const handleCameraToggle = async () => {
    if (isCameraActive) {
      stopCameraStream();
      return;
    }

    await activateCamera();
  };

  const appendCapturedImages = (images, source = "camera") => {
    if (!onCapturedItemsChange) {
      return;
    }

    const nextItems = images.map((image, index) => ({
      id: `${source}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: `Item ${capturedItems.length + index + 1}`,
      image,
      source,
    }));

    onCapturedItemsChange([...capturedItems, ...nextItems]);
    nextItems.forEach((item) => onCapturePhoto?.(item));
    setCameraError("");
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) {
      setCameraError("Activate the camera before taking a photo.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, width, height);

    appendCapturedImages([canvas.toDataURL("image/jpeg", 0.92)]);
  };

  const handleUploadedFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) {
      return;
    }

    const images = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );

    appendCapturedImages(images, "upload");
    event.target.value = "";
  };

  const removeCapturedItem = (itemId) => {
    onCapturedItemsChange?.(
      capturedItems.filter((item) => item.id !== itemId)
    );
  };

  const latestCapture = capturedItems[capturedItems.length - 1];
  const statusText = cameraError
    ? cameraError
    : isCameraActive
      ? "Live camera is active. Position the item and capture when ready."
      : latestCapture
        ? "Camera is off. Your latest captured item is shown below."
        : previewDescription;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
      <div>
        <h3 className="mb-5 text-xl font-inter font-semibold text-slate-900">
          {previewTitle}
        </h3>

        <div className="rounded-2xl bg-slate-50 p-4 shadow-inner ring-1 ring-slate-100 sm:p-5">
          <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#2c4a7d]/20 bg-[#f5f7f7]">
            {isCameraActive ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-[420px] w-full rounded-2xl object-cover"
              />
            ) : latestCapture ? (
              <img
                src={latestCapture.image}
                alt={latestCapture.name}
                className="h-[420px] w-full rounded-2xl object-cover"
              />
            ) : (
              <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-md">
                  <Camera className="h-10 w-10 text-[#2c4a7d]" />
                </div>

                <h4 className="text-xl font-inter font-semibold text-slate-700">
                  {previewStatus}
                </h4>
                <p className="mt-3 max-w-md text-lg text-slate-500">
                  {previewDescription}
                </p>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/65 to-transparent px-6 py-6 text-left">
              <h4 className="text-xl font-inter font-semibold text-white">
                {isCameraActive ? "Live Camera Feed" : previewStatus}
              </h4>
              <p className="mt-2 max-w-xl text-sm text-slate-100">
                {statusText}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              className="inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base"
              onClick={handleCapturePhoto}
              disabled={!isCameraActive}
            >
              <Camera className="h-5 w-5" />
              <span>{captureLabel}</span>
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base"
              onClick={handleCameraToggle}
              disabled={isStartingCamera}
            >
              <ScanLine className="h-5 w-5" />
              <span>
                {isStartingCamera
                  ? "Starting Camera..."
                  : isCameraActive
                    ? "Stop Camera"
                    : activateLabel}
              </span>
            </Button>

            <Button
              variant="secondary"
              size="md"
              className="inline-flex items-center justify-center gap-3 rounded-2xl px-8 py-4 text-base"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-5 w-5" />
              <span>Upload Photo</span>
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            className="hidden"
            onChange={handleUploadedFiles}
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      <div>
        <h3 className="mb-5 text-2xl font-semibold text-slate-900">
          Captured Items ({capturedItems.length})
        </h3>

        {capturedItems.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">
              No items captured yet
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Start the camera or upload photos to build your order.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {capturedItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200"
              >
                <div className="relative h-32 p-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeCapturedItem(item.id)}
                    className="absolute right-4 top-4 rounded-full bg-white/90 p-2 text-slate-600 shadow-sm transition-colors hover:text-[#2c4a7d]"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-3 p-3">
                  <p className="text-base font-semibold text-slate-900">
                    {item.name}
                  </p>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium capitalize text-slate-500">
                    {item.source || "camera"}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraReviewSection;
