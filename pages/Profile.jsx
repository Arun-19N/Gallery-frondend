import { useSelector } from 'react-redux';
import { useEffect, useMemo, useRef, useState } from 'react';
import api from '../src/utils/api';
import defaultProfile from './defaultprofile.jpeg';
import './Profile.css';
import MyImages from './Imguploadshow';
import { FaPlus } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const userId = authUser?._id || authUser?.id;

  const [user, setUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [bio, setBio] = useState('');
  const [editingBio, setEditingBio] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [savingBio, setSavingBio] = useState(false);
  const [savingName, setSavingName] = useState(false);
  const navigate = useNavigate();

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/auth/user/${userId}`);
        setUser(res.data);
        setBio(res.data.bio || '');
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };
    if (userId) fetchUser();
  }, [userId]);

  // FIX: build the preview URL once per selected file (not on every render),
  // and revoke it on cleanup so we don't leak blob URLs.
  const previewUrl = useMemo(() => {
    if (!selectedImg) return null;
    return URL.createObjectURL(selectedImg);
  }, [selectedImg]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (JPEG, PNG, or WEBP)');
        resetFileInput();
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        resetFileInput();
        return;
      }

      setSelectedImg(file);
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedImg) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('profileImg', selectedImg);

    try {
      const res = await api.post(`/auth/user/${userId}/upload-img`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUser((prev) => ({ ...prev, imgUrl: res.data.imgUrl }));
      setSelectedImg(null);
      setShowEdit(false);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      // FIX: reset the input so selecting the same file again still fires onChange.
      resetFileInput();
    }
  };

  const handleCancelUpload = () => {
    setSelectedImg(null);
    resetFileInput();
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile image?')) {
      return;
    }

    try {
      await api.delete(`/auth/user/${userId}/remove-img`);
      setUser((prev) => ({ ...prev, imgUrl: '' }));
      setShowEdit(false);
    } catch (err) {
      console.error('Image remove failed:', err);
      alert('Failed to remove image. Please try again.');
    }
  };

  const handleNameSubmit = async (e) => {
    e.preventDefault();

    if (!newName.trim()) {
      alert('Name cannot be empty');
      return;
    }

    // FIX: guard against double-submit while the request is in flight.
    if (savingName) return;
    setSavingName(true);

    try {
      const res = await api.put(`/auth/user/${userId}/update-name`, {
        name: newName.trim(),
      });

      setUser((prev) => ({
        ...prev,
        name: res.data.name,
      }));

      setEditingName(false);
    } catch (err) {
      console.error('Error updating name:', err);
      alert('Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  const handleBioSubmit = async (e) => {
    e.preventDefault();

    // FIX: bio save now has its own loading state, separate from image `uploading`.
    if (savingBio) return;
    setSavingBio(true);

    try {
      const res = await api.put(`/auth/user/${userId}/bio`, { bio });
      setUser((prev) => ({ ...prev, bio: res.data.bio }));
      setEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
      alert('Failed to update bio');
    } finally {
      setSavingBio(false);
    }
  };

  if (!userId) return <p>Please login to view profile</p>;
  if (!user) return <p>Loading...</p>;

  const imageUrl = user.imgUrl || defaultProfile;

  return (
    <>
      <div className="d-md-flex d-lg-flex flex-md-row flex-lg-row flex-column" style={{ minHeight: '100vh' }}>
        <div className="profile-container">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleSelectImage}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            style={{ display: 'none' }}
          />

          <div className="d-flex flex-column justify-content-center align-items-center">
            <img
              src={imageUrl}
              alt="Profile"
              role="button"
              tabIndex={0}
              onClick={() => setShowEdit(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setShowEdit(true);
                }
              }}
              style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                cursor: 'pointer',
                objectFit: 'cover',
              }}
            />

            {!editingName ? (
              <h2 onClick={() => {
                setNewName(user.name);
                setEditingName(true);
              }} style={{ cursor: 'pointer' }}>
                {user.name}
              </h2>
            ) : (
              <form onSubmit={handleNameSubmit} className="d-flex flex-column align-items-center gap-2">
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Enter new name"
                  className="form-control"
                  style={{ width: '200px' }}
                  autoFocus
                  disabled={savingName}
                />
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success btn-sm" disabled={savingName}>
                    {savingName ? 'Saving...' : '✅ Save'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setEditingName(false)}
                    disabled={savingName}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}

            {!editingBio ? (
              <div className="bio__part" onClick={() => {
                setBio(user.bio || '');
                setEditingBio(true);
              }} style={{ cursor: 'pointer' }}>
                {user.bio || '📝 Add bio'}
              </div>
            ) : (
              <form className="bio__part d-flex flex-column align-items-center gap-2" onSubmit={handleBioSubmit}>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  style={{ width: 300, height: 80 }}
                  className="form-control"
                  placeholder="Write your bio here..."
                  autoFocus
                  disabled={savingBio}
                />
                <div className="d-flex gap-2">
                  {/* FIX: was disabled={uploading} / showed 'Saving...' based on the image
                      upload flag, which never reflects this request's own progress. */}
                  <button type="submit" className="btn btn-success btn-sm" disabled={savingBio}>
                    {savingBio ? 'Saving...' : '✅ Save'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => setEditingBio(false)}
                    disabled={savingBio}
                  >
                    ❌ Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {showEdit && (
            <div className="imgeditpart">
              <div
                className="hideedit fs-2"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setShowEdit(false);
                  setSelectedImg(null);
                  resetFileInput();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setShowEdit(false);
                    setSelectedImg(null);
                    resetFileInput();
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                ×
              </div>

              <div className="editpart d-flex justify-content-flex-start gap-3 m-2">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => fileInputRef.current.click()}
                  disabled={uploading}
                >
                  Change Image
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                >
                  Remove Image
                </button>
              </div>

              {selectedImg ? (
                <div style={{ marginTop: '1rem' }}>
                  <h5>Preview:</h5>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
                  />
                  <div style={{ marginTop: 10 }} className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handleConfirmUpload}
                      disabled={uploading}
                    >
                      {uploading ? 'Uploading...' : '✅ Confirm Upload'}
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={handleCancelUpload}
                      disabled={uploading}
                    >
                      ❌ Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <img
                  src={imageUrl}
                  alt="Full Profile"
                  style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px' }}
                />
              )}
            </div>
          )}
        </div>

        <div className="showimg__container">
          <div className="d-flex ms-5 m-lg-5 m-md-3 align-items-center justify-content-center my-4 gap-2">
            <div
              className="add__img__icon"
              role="button"
              tabIndex={0}
              onClick={() => navigate('/imgupload')}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate('/imgupload');
              }}
            >
              <FaPlus className='add__img__icon__inner' />
            </div>
            <h2>Add Image</h2>
          </div>

          <MyImages />
        </div>
      </div>
    </>
  );
};

export default Profile;