import React, { useState } from 'react';
import api from '../src/utils/api'; // adjust path if needed
import './uploadeimgpart.css';
import { useNavigate } from 'react-router-dom';

const UploadImageForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [confirmMode, setConfirmMode] = useState(false);
  const navigate = useNavigate();
  

  // When file selected, set image + preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setConfirmMode(true);
  };

  // Upload handler
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      await api.post('/images/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      alert('Image uploaded!');
      navigate('/profile');
      window.location.reload();
      // clear form after upload
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Upload failed');
    }
  };

  // Cancel preview/image
  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setImage(null);
    setPreview(null);
    setConfirmMode(false);
    // leave title/description or clear them too:
    setTitle('');
    setDescription('');
  };

  return (
    <>
    
    <div className="img__up__form__container mb-5 d-flex justify-content-center align-items-center flex-column" style={{ minHeight: '80vh' }}>

      <form onSubmit={handleUpload} className=' flex-column  col-lg-8 col-md-8 col-11'>
  
        {/* Preview image */}
        {preview && (
          <div style={{ marginTop: '10px', textAlign: 'center' }}>
            {/* <h4>Preview:</h4> */}
            <img
              src={preview}
              className='Preview__img__uplode'
              alt="Preview"
              style={{  border: '1px solid #ccc'}}
            />
          </div>
        )}

        <input type="file" onChange={handleFileChange} className=' mt-5' />



          <input
          className='img__up__form__container__input'
          type="text"
          placeholder="Title"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          />
          <textarea
          placeholder="Description"
           className='img__up__form__container__input'
          value={description}
          onChange={e => setDescription(e.target.value)}
          />
          {/* Confirm / Cancel buttons */}
          {confirmMode && (
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
              <button type="submit">Confirm Upload</button>
              <button type="button" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          )}
      </form>
    </div>
    </>
  );
};

export default UploadImageForm;
