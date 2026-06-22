// import { useSelector } from 'react-redux';
// import { useEffect, useRef, useState } from 'react';
// import api from '../src/utils/api';
// import defaultProfile from './defaultprofile.jpeg';
// import './Profile.css';

// const Profile = () => {
//   const { user: authUser } = useSelector((state) => state.auth);
//   const userId = authUser?._id || authUser?.id;
//   const [user, setUser] = useState(null);
//   const [showEdit, setShowEdit] = useState(false);
//   const [selectedImg, setSelectedImg] = useState(null); // preview file before upload
//   const fileInputRef = useRef(null);
//   const [bio,setBio ] = useState(null);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const res = await api.get(`/auth/user/${userId}`);
//         setUser(res.data);
//       } catch (err) {
//         console.error('Error fetching user:', err);
//       }
//     };
//     if (userId) fetchUser();
//   }, [userId]);

//   const handleSelectImage = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedImg(file);
//     }
//   };

//   const handleConfirmUpload = async () => {
//     if (!selectedImg) return;

//     const formData = new FormData();
//     formData.append('profileImg', selectedImg);

//     try {
//       const res = await api.post(`/auth/user/${userId}/upload-img`, formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
//       setUser((prev) => ({ ...prev, imgUrl: res.data.imgUrl }));
//       setSelectedImg(null);
//       setShowEdit(false);
//     } catch (err) {
//       console.error('Image upload failed:', err);
//     }
//   };

//   const handleCancelUpload = () => {
//     setSelectedImg(null); // cancel preview
//   };

//   const handleRemoveImage = async () => {
//     try {
//       await api.delete(`/auth/user/${userId}/remove-img`);
//       setUser((prev) => ({ ...prev, imgUrl: '' }));
//       setShowEdit(false);
//     } catch (err) {
//       console.error('Image remove failed:', err);
//     }
//   };


//   const handlesetBio = async (e) => {
//       try {
//       const res =   await api.bio(`/auth/bio/id`);

//         setBio(res.data)
         
//       } catch (error) {
//          console.log('Error')
//       }
//   }

//   if (!userId) return <p>Please login to view profile</p>;
//   if (!user) return <p>Loading...</p>;

//   const imageUrl = user.imgUrl ? `http://localhost:5000${user.imgUrl}` : defaultProfile;

//   return (

//     <>
//     <div className='profile-container'>
    
//       <input
//         type="file"
//         ref={fileInputRef}
//         onChange={handleSelectImage}
//         accept="image/*"
//         style={{ display: 'none' }}
//       />

//       <div className='d-flex flex-column '>
//         <img
//           src={imageUrl}
//           alt="Profile"
//           style={{
//             width: 120,
//             height: 120,
//             borderRadius: '50%',
//             cursor: 'pointer',
//             objectFit: 'cover',
//           }}
//           onClick={() => setShowEdit(true)}
//         />
//          <h2>{user.name}</h2>

//          <div className="bito__part"   onClick = {() => setBio(true)}>
//              {user.bio ||  " Add bio"  }  

           

             
//          </div>
//       </div>

//       {showEdit && (
//         <div className="imgeditpart">
//           <div className="hideedit fs-2" style={{ cursor: 'pointer' }} onClick={() => setShowEdit(false)}>
//             ×
//           </div>

//           <div className="editpart d-flex justify-content-end gap-3 m-2">
//             <button onClick={() => fileInputRef.current.click()}>Change Image</button>
//             <button onClick={handleRemoveImage}>Remove Image</button>
//           </div>

//           {/* Show image preview if selected */}
//           {selectedImg && (
//             <div style={{ marginTop: '1rem' }}>
//               <h5>Preview:</h5>
//               <img
//                 src={URL.createObjectURL(selectedImg)}
//                 alt="Preview"
//                 style={{ height: 250, objectFit: 'cover' }}
//               />
//               <div style={{ marginTop: 10 }}>
//                 <button onClick={handleConfirmUpload} style={{ marginRight: 10 }}>✅ Confirm Upload</button>
//                 <button onClick={handleCancelUpload}>❌ Cancel</button>
//               </div>
//             </div>
//           )}

          

//           {/* Show original full image if no preview is selected */}
//           {!selectedImg && (
//             <img src={imageUrl} alt="Full Profile" style={{ width: 'auto', height: 400 }} />
//           )}
//         </div>
//       )}

//       <div className="bio__part">
//          <form action="" onSubmit={handlesetBio}>
//            <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
//            <button type="submit">Save</button>
//           </form>
//      </div>
      
//     </div>
//     </>
//   );
// };

// export default Profile;

import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import api from '../src/utils/api';
import defaultProfile from './defaultprofile.jpeg';
import './Profile.css';
import Uploadeuserimg from './Uploadeuserimg';
import MyImages from './Imguploadshow';
import { FaPlus } from "react-icons/fa"; 
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user: authUser } = useSelector((state) => state.auth);
  const userId = authUser?._id || authUser?.id;

  const [user, setUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);
  const [bio, setBio] = useState('Add your bio here...');
  const [editingBio, setEditingBio] = useState(false);
  const [editingName, setEditingName] = useState(false);
const [newName, setNewName] = useState('');
  const navigate = useNavigate(); // hook to navigate

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

  const handleSelectImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImg(file);
    }
  };

  const handleConfirmUpload = async () => {
    if (!selectedImg) return;
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
    }
  };

  const handleCancelUpload = () => setSelectedImg(null);

  const handleRemoveImage = async () => {
    try {
      await api.delete(`/auth/user/${userId}/remove-img`);
      setUser((prev) => ({ ...prev, imgUrl: '' }));
      setShowEdit(false);
    } catch (err) {
      console.error('Image remove failed:', err);
    }
  };

  const handleNameSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await api.put(`/auth/user/${userId}/update-name`, {
      name: newName,
    });

    setUser((prev) => ({
      ...prev,
      name: res.data.name, // ✅ assume API returns updated name
    }));

    setEditingName(false);
  } catch (err) {
    console.error('Error updating name:', err);
    alert('Failed to update name');
  }
};


  const handleBioSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(`/auth/user/${userId}/bio`, { bio });
      setUser((prev) => ({ ...prev, bio: res.data.bio }));
      setEditingBio(false);
    } catch (error) {
      console.error('Error updating bio:', error);
    }
  };

  if (!userId) return <p>Please login to view profile</p>;
  if (!user) return <p>Loading...</p>;

  const imageUrl = user.imgUrl ? `http://localhost:5000${user.imgUrl}` : defaultProfile;

  return (

    <>
    <div className="d-md-flex d-lg-flex  flex-md-row flex-lg-row flex-column  " style={{ minHeight: '100vh' }}>

    <div className="profile-container">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleSelectImage}
        accept="image/*"
        style={{ display: 'none' }}
      />

      <div className="d-flex flex-column justify-content-center align-items-center">
        <img
          src={imageUrl}
          alt="Profile"
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            cursor: 'pointer',
            objectFit: 'cover',
          }}
          onClick={() => setShowEdit(true)}
        />


       {!editingName ? (
  <h2 onClick={() => {
    setNewName(user.name);
    setEditingName(true);
  }} style={{ cursor: 'pointer' }}>
     {user.name}
  </h2>
 ) : (
  <form onSubmit={handleNameSubmit}>
    <input
      value={newName}
      onChange={(e) => setNewName(e.target.value)}
      placeholder="Enter new name"
    
    />
    <button type="submit">✅ Save</button>
    <button type="button" onClick={() => setEditingName(false)}>❌ Cancel</button>
  </form>
)}

        {!editingBio ? (
          <div className="bio__part" onClick={() => setEditingBio(true)}>
            {user.bio || '📝 Add bio'}
          </div>
        ) : (
          <form className="bio__part" onSubmit={handleBioSubmit}>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              style={{ width: 300, height: 80 }}
            />
            <div>
              <button type="submit">✅ Save</button>
              <button type="button" onClick={() => setEditingBio(false)}>
                ❌ Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {showEdit && (
        <div className="imgeditpart">
          <div className="hideedit fs-2" onClick={() => setShowEdit(false)} style={{ cursor: 'pointer' }}>
            ×
          </div>

          <div className="editpart d-flex justify-content-flex-start gap-3 m-2">
            <button onClick={() => fileInputRef.current.click()}>Change Image</button>
            <button onClick={handleRemoveImage}>Remove Image</button>
          </div>

          {selectedImg ? (
            <div style={{ marginTop: '1rem' }}>
              <h5>Preview:</h5>
              <img
                src={URL.createObjectURL(selectedImg)}
                alt="Preview"
                // className='img-fluid'
                // style={{ height: 250, objectFit: 'cover' }}
              />
              <div style={{ marginTop: 10 }}>
                <button onClick={handleConfirmUpload} style={{ marginLeft: 20}}>✅ Confirm Upload</button>
                <button onClick={handleCancelUpload}>❌ Cancel</button>
              </div>
            </div>
          ) : (
            <img src={imageUrl} alt="Full Profile" />
          )}
        </div>
      )}
    </div>
    <div className="showimg__container">

<div className="d-flex ms-5 m-lg-5 m-md-3 d-flex   align-items-center justify-content-center my-4 gap-2">
      <div className="add__img__icon"  onClick={() => navigate('/imgupload')}>  
 
      <FaPlus className='add__img__icon__inner'/> 
      </div><h2 className=''>Add Image</h2>
</div>

         {/* <Uploadeuserimg/> */}
         <MyImages/>
    </div>
    </div>
    
    </>
  );
};

export default Profile;