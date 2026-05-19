import { useEffect, useState } from "react";
import useAuth from "../../auth/hooks/useAuth";
import { UploadIcon } from "lucide-react";
import { useProfile } from "../Hooks/useProfile";
import Skeleton from "react-loading-skeleton";
const EditProfile = () => {
  const { user } = useAuth();
  const { updateProfileHandler } = useProfile();
  const [form, setForm] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    phoneNumber: user?.phoneNumber || "",
    profilePicture: null,
  });

  const [preview, setPreview] = useState(user?.profilePicture || "");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 📸 SINGLE IMAGE HANDLER
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // replace old preview
    setForm((prev) => ({
      ...prev,
      profilePicture: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  // 🗑️ REMOVE IMAGE
  const handleRemoveImage = () => {
    setForm((prev) => ({
      ...prev,
      profilePicture: null,
    }));

    setPreview("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", form.username);
    formData.append("bio", form.bio);
    formData.append("phoneNumber", form.phoneNumber);

    if (form.profilePicture) {
      formData.append("profilePicture", form.profilePicture);
    }
    updateProfileHandler(formData);
  };
  useEffect(() => {
    if (!user) return;

    setForm((prev) => ({
      username: user.username,
      bio: user.bio,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
    }));
  }, [user]);
  return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-brand-800 rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-white mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PROFILE IMAGE */}
          <div className="flex flex-col items-center gap-3">
            {/* Preview */}
            <div className="relative">
              <img
                src={preview || user?.profilePicture}
                alt="profile"
                className="w-24 h-24  rounded-full object-cover border-2 border-brand-500"
              />

              {/* Remove button */}
              {preview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full"
                >
                  ×
                </button>
              )}
            </div>

            {/* File Input (single file only) */}
            <label
              htmlFor="profilePicture"
              className="bg-accent-500 w-20 h-20 items-center flex flex-col rounded-lg text-center"
            >
              <UploadIcon className="w-full h-full px-3" />
              <p className="text-xs source-code-pro w-full text-white ">
                Upload An Image
              </p>
            </label>
            <input
              type="file"
              id="profilePicture"
              hidden
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm text-white"
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-brand-300">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              required
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-brand-700 text-white outline-none"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm text-brand-300">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              required
              onChange={handleChange}
              rows={3}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-brand-700 text-white outline-none resize-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm text-brand-300">Phone Number</label>
            <input
              type="number"
              min={1000000000}
              max={9999999999}
              required
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-brand-700 text-white outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-medium transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
