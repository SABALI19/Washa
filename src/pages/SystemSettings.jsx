import { useCallback, useMemo, useRef, useState } from "react";
import { Camera, Image, RotateCcw, Save, UserRound } from "lucide-react";

import Button from "../components/Button.jsx";
import Card from "../components/Card.jsx";
import useAuthSession from "../hooks/useAuthSession.js";
import { apiRequest, getAuthSession, saveAuthSession } from "../utils/auth.js";

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Unable to read the selected image."));
    reader.readAsDataURL(file);
  });

const SystemSettings = () => {
  const session = useAuthSession();
  const fileInputRef = useRef(null);
  const user = session?.user || {};
  const [previewImage, setPreviewImage] = useState(user.profileImage || "");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const hasImage = Boolean(previewImage);
  const hasChanges = previewImage !== (user.profileImage || "");
  const initials = useMemo(
    () =>
      String(user.name || user.email || "U")
        .trim()
        .charAt(0)
        .toUpperCase(),
    [user.email, user.name],
  );

  const handleImageSelect = useCallback(async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Choose a PNG, JPG, or WebP image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("Choose an image smaller than 2MB.");
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);

      setPreviewImage(dataUrl);
      setError("");
      setMessage("");
    } catch (readError) {
      setError(readError.message);
    }
  }, []);

  const handleSave = useCallback(async () => {
    try {
      setIsSaving(true);
      const data = await apiRequest("/auth/profile-image", {
        body: JSON.stringify({ profileImage: previewImage }),
        method: "PATCH",
      });
      const currentSession = getAuthSession();

      if (currentSession) {
        saveAuthSession({
          ...currentSession,
          user: {
            ...currentSession.user,
            ...data.user,
          },
        });
      }

      setError("");
      setMessage(data.message || "Profile image saved.");
    } catch (saveError) {
      setError(saveError.message || "Unable to save profile image.");
      setMessage("");
    } finally {
      setIsSaving(false);
    }
  }, [previewImage]);

  return (
    <section className="min-h-screen bg-[var(--color-surface)]">
      <div className="mx-auto max-w-[1100px] px-4 py-6 sm:px-6">
        <div>
          <h1 className="text-[1.25rem] font-inter font-semibold tracking-normal text-[#2c4a7d] sm:text-[1.45rem] lg:text-[1.65rem]">
            System Settings
          </h1>
          <p className="mt-1.5 text-[0.78rem] text-slate-500">
            Profile image, account details, and workspace preferences
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-[1rem] bg-red-50 px-4 py-3 text-[0.82rem] text-red-600">
            {error}
          </div>
        )}

        {message && (
          <div className="mt-4 rounded-[1rem] bg-emerald-50 px-4 py-3 text-[0.82rem] text-emerald-700">
            {message}
          </div>
        )}

        <div className="mt-5 grid gap-4 lg:grid-cols-[320px_minmax(0,1fr)]">
          <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
            <h2 className="text-[1rem] font-semibold text-slate-900">Profile Image</h2>

            <div className="mt-4 flex justify-center">
              {hasImage ? (
                <img
                  src={previewImage}
                  alt={user.name || "Profile"}
                  className="h-44 w-44 rounded-lg object-cover ring-1 ring-slate-100"
                />
              ) : (
                <div className="flex h-44 w-44 items-center justify-center rounded-lg bg-[#2c4a7d] text-5xl font-semibold text-white">
                  {initials || <UserRound className="h-16 w-16" />}
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />

            <div className="mt-4 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[0.72rem] font-medium"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Choose</span>
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-[0.72rem] font-medium"
              >
                <Save className="h-3.5 w-3.5" />
                <span>{isSaving ? "Saving..." : "Save"}</span>
              </Button>
            </div>

            <button
              type="button"
              onClick={() => {
                setPreviewImage("");
                setMessage("");
                setError("");
              }}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-[0.72rem] font-medium text-slate-600 transition-colors hover:border-red-200 hover:text-red-600"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Remove Image
            </button>
          </Card>

          <Card className="rounded-[1.2rem] border-slate-100 p-4 shadow-[0_6px_20px_rgba(15,23,42,0.06)]">
            <h2 className="text-[1rem] font-semibold text-slate-900">Account Details</h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg bg-slate-50 px-3 py-3">
                <p className="text-[0.7rem] text-slate-500">Name</p>
                <p className="mt-1 truncate text-[0.85rem] font-semibold text-slate-900">
                  {user.name || "Not available"}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-3">
                <p className="text-[0.7rem] text-slate-500">Email</p>
                <p className="mt-1 truncate text-[0.85rem] font-semibold text-slate-900">
                  {user.email || "Not available"}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-3">
                <p className="text-[0.7rem] text-slate-500">Role</p>
                <p className="mt-1 truncate text-[0.85rem] font-semibold capitalize text-slate-900">
                  {user.role || "User"}
                </p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-3">
                <p className="text-[0.7rem] text-slate-500">Image Status</p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-[0.85rem] font-semibold text-slate-900">
                  <Image className="h-3.5 w-3.5 text-[var(--color-primary)]" />
                  {hasImage ? "Custom image set" : "Default avatar"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SystemSettings;
