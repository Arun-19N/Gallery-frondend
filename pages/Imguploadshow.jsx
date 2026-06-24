import React, { useEffect, useState } from 'react';
import api from '../src/utils/api';
import './Imguploadshow.css';

const MyImages = () => {
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await api.get('/images/my-images', { withCredentials: true });
        setImages(res.data);
        console.log('Fetched images:', res.data);
        console.log('Image URLs:', res.data.map(img => img.imageUrl));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchImages();
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!images.length) return <p>No images uploaded yet.</p>;

  return (
    <>
      <div>
        {/* Image grid */}
        <div
          className="text-center d-flex justify-content-center gap-4"
          style={{ display: 'flex', flexWrap: 'wrap' }}
        >
          {images.map(img => (
            <div className="image-card" key={img._id} style={{ border: '1px solid #ccc' }}>
              <img
                // ✅ FIX: Cloudinary URLs are already complete (https://res.cloudinary.com/...).
                // Previously this was prefixed with http://localhost:5000, which only worked
                // for the old local-disk relative paths and broke the URL for Cloudinary links.
                src={img.imageUrl}
                alt={img.title}
                width="200"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedImg(img.imageUrl)}
              />
              <div className="pt-1 px-1 mb-1">
                <h5>{img.title}</h5>
                <p>{img.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedImg && (
          <div
            onClick={() => setSelectedImg(null)}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
              cursor: 'pointer',
            }}
          >
            <img src={selectedImg} alt="Full Size" style={{ maxHeight: '90%', maxWidth: '90%' }} />
          </div>
        )}
      </div>
    </>
  );
};

export default MyImages;