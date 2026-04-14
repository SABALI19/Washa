import { useEffect, useState } from 'react';
import { FiUser, FiChevronDown } from 'react-icons/fi';
import ProfileDropdown from './ProfileDropdown';

const Profile = ({ user, size = 'md', className = '' }) => {
  const [imageError, setImageError] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);

  const sizes = {
    sm: { container: 'w-6 h-6',                   icon: 'w-3 h-3',                border: 'border'   },
    md: { container: 'w-8 h-8 md:w-10 md:h-10',   icon: 'w-4 h-4 md:w-5 md:h-5', border: 'border-2' },
    lg: { container: 'w-12 h-12 md:w-14 md:h-14', icon: 'w-6 h-6 md:w-7 md:h-7', border: 'border-2' },
    xl: { container: 'w-16 h-16 md:w-20 md:h-20', icon: 'w-8 h-8 md:w-10 md:h-10',border: 'border-4' },
  };

  const sizeConfig = sizes[size] || sizes.md;
  const containerClass = `${sizeConfig.container} rounded-full ${sizeConfig.border} border-gray-300 dark:border-gray-600 shadow-sm`;
  const showImage = user?.profileImage && !imageError;

  useEffect(() => {
    setImageError(false);
  }, [user?.profileImage]);

  return (
    <div className={`relative flex items-center gap-1 ${className}`}>

      {/* Avatar */}
      <div
        className="cursor-pointer"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        {showImage ? (
          <img
            src={user.profileImage}
            alt={user?.name || 'Profile'}
            className={`${containerClass} object-cover`}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`${containerClass} bg-[#2c4a7d] flex items-center justify-center`}>
            <FiUser className={`text-white ${sizeConfig.icon}`} />
          </div>
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
                  src={user.profileImage}
                  alt={user?.name || 'Profile'}
                  className="h-56 w-56 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-56 w-56 items-center justify-center rounded-lg bg-[#2c4a7d]">
                  <FiUser className="h-20 w-20 text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Profile;
