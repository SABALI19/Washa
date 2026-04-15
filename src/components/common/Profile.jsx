import { useState } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import ProfileDropdown from './ProfileDropdown';

const getInitial = (name) =>
  name ? name.trim().charAt(0).toUpperCase() : '?';

const InitialAvatar = ({ name, sizeClass, textClass, borderClass }) => (
  <div
    className={`${sizeClass} ${borderClass} border-gray-300 dark:border-gray-600 shadow-sm rounded-full bg-[#2c4a7d] flex items-center justify-center`}
  >
    <span className={`text-white font-semibold leading-none ${textClass}`}>
      {getInitial(name)}
    </span>
  </div>
);

const Profile = ({ user, size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const sizes = {
    sm: { container: 'w-6 h-6',                   text: 'text-xs',   border: 'border'   },
    md: { container: 'w-8 h-8 md:w-10 md:h-10',   text: 'text-sm',   border: 'border-2' },
    lg: { container: 'w-12 h-12 md:w-14 md:h-14', text: 'text-base', border: 'border-2' },
    xl: { container: 'w-16 h-16 md:w-20 md:h-20', text: 'text-2xl',  border: 'border-4' },
  };

  const sizeConfig = sizes[size] || sizes.md;

  const hasImage = Boolean(user?.profileImage?.trim());
  const showImage = hasImage && !imageError;

  const avatarBorderClass = `${sizeConfig.border} border-gray-300 dark:border-gray-600 shadow-sm`;

  return (
    <div className={`relative flex items-center gap-1 ${className}`}>

      {/* Avatar */}
      <div className="cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
        {showImage ? (
          <img
            key={user.profileImage}
            src={user.profileImage}
            alt={user?.name || 'Profile'}
            className={`${sizeConfig.container} rounded-full object-cover ${avatarBorderClass}`}
            onError={() => setImageError(true)}
          />
        ) : (
          <InitialAvatar
            name={user?.name}
            sizeClass={sizeConfig.container}
            textClass={sizeConfig.text}
            borderClass={sizeConfig.border}
          />
        )}
      </div>

      {/* Name (desktop only) */}
      {user?.name && (
        <span className="hidden md:inline text-sm font-medium text-gray-700">
          {user.name}
        </span>
      )}

      {/* Chevron */}
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
      >
        <FiChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      <ProfileDropdown
        user={user}
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        onViewProfileImage={() => setIsImagePreviewOpen(true)}
      />

      {/* Image Preview Modal */}
      {isImagePreviewOpen && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/60 px-4">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close profile image preview"
            onClick={() => setIsImagePreviewOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-lg bg-white p-4 shadow-xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-slate-900">Profile Image</h2>
              <button
                type="button"
                onClick={() => setIsImagePreviewOpen(false)}
                className="rounded-md px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <div className="mt-4 flex justify-center">
              {showImage ? (
                <img
                  key={user.profileImage}
                  src={user.profileImage}
                  alt={user?.name || 'Profile'}
                  className="h-56 w-56 rounded-lg object-cover"
                />
              ) : (
                <div className="h-56 w-56 rounded-lg bg-[#2c4a7d] flex items-center justify-center">
                  <span className="text-white font-semibold text-7xl leading-none">
                    {getInitial(user?.name)}
                  </span>
                </div>
              )}
            </div>

            {!hasImage && (
              <p className="mt-3 text-center text-xs text-slate-400">
                No profile image uploaded yet.
              </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;