import React, { forwardRef, useImperativeHandle, useState, useCallback, useEffect } from 'react';

const AddAgentModal = forwardRef((props, ref) => {
  const [modalData, setModalData] = useState(() => {
    const savedData = localStorage.getItem('addAgentModalData');
    return savedData ? JSON.parse(savedData) : {
      name: '',
      surname: '',
      email: '',
      phone: ''
    };
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(() => {
    return localStorage.getItem('addAgentAvatarPreview') || null;
  });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('addAgentModalData', JSON.stringify(modalData));
  }, [modalData]);

  useEffect(() => {
    if (avatarPreview) {
      localStorage.setItem('addAgentAvatarPreview', avatarPreview);
    } else {
      localStorage.removeItem('addAgentAvatarPreview');
    }
  }, [avatarPreview]);

  const validateField = useCallback((name, value) => {
    let error = '';
    switch (name) {
      case 'name':
      case 'surname':
        if (value.length < 2) {
          error = `${name === 'name' ? 'სახელი' : 'გვარი'} უნდა შეიცავდეს მინიმუმ 2 სიმბოლოს`;
        }
        break;
      case 'email':
        if (!value.endsWith("@redberry.ge")) {
          error = "იმეილი უნდა მთავრდებოდეს @redberry.ge-ით";
        }
        break;
      case 'phone':
        if (!/^\d*\.?\d*$/.test(value)) error = 'მხოლოდ რიცხვები';
        if (name === 'bedrooms' && !Number.isInteger(Number(value))) error = 'მხოლოდ მთელი რიცხვები';
        if (!/^5\d{8}$/.test(value)) {
          error = "ტელეფონის ნომერი უნდა იყოს ფორმატში: 5XXXXXXXXX";
        }
        break;
      case 'avatar':
        if (!value) {
          error = "ავატარი სავალდებულოა";
        }
        break;
      default:
        if (!value) error = 'ეს ველი სავალდებულოა';
    }
    return error;
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};
    Object.keys(modalData).forEach(key => {
      const error = validateField(key, modalData[key]);
      if (error) newErrors[key] = error;
    });
    if (!avatarFile) newErrors.avatar = "ავატარი სავალდებულოა";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [modalData, avatarFile, validateField]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let updatedValue = type === 'number' ? (value === '' ? '' : Number(value)) : value;
    validateField(name, updatedValue);
    if (['phone'].includes(name)) {
      updatedValue = value.replace(/[^\d.]/g, '');
      updatedValue = value.replace(/\D/g, '');
    }
    setModalData(prevState => ({
      ...prevState,
      [name]: updatedValue
    }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, avatar: 'გთხოვთ ატვირთოთ მხოლოდ სურათი' }));
        return;
      }
      if (file.size > 1 * 1000 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'სურათის ზომა არ უნდა აღემატებოდეს 1MB-ს' }));
        return;
      }
      setAvatarFile(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  const getMessageClassName = (fieldName) => {
    if (!modalData[fieldName]) return "flex mt-[4px] text-xs text-[#021526]";
    return errors[fieldName] ? "flex mt-[4px] text-xs text-[#F93B1D]" : "flex mt-[4px] text-xs text-[#45A849]";
  };

  const getInputClassName = (fieldName) => {
    let baseClass = "w-full p-2 border rounded-md ";
    if (!modalData[fieldName]) return baseClass + "border-[#021526]";
    return baseClass + (errors[fieldName] ? "border-[#F93B1D]" : "border-[#45A849]");
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setErrors(prev => ({ ...prev, avatar: 'ავატარი სავალდებულოა' }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      Object.keys(modalData).forEach(key => formData.append(key, modalData[key]));
      if (avatarFile) formData.append('avatar', avatarFile);
      props.onSubmit(formData);
      toggleModal();
      // Clear localStorage after successful submission
      localStorage.removeItem('addAgentModalData');
      localStorage.removeItem('addAgentAvatarPreview');
    }
  };

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  useImperativeHandle(ref, () => ({
    toggleModal
  }));

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 w-screen h-screen flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={toggleModal}></div>
      <div className="bg-white w-[1009px] px-[105px] py-[87px] flex-col items-center justify-center max-h-[90vh] overflow-y-auto rounded-xl shadow-lg p-6 z-50" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-medium mb-[61px] text-center">აგენტის დამატება</h2>
        <form className='w-full max-w-[799px] mx-auto mb-[94px]' onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="agentName" className="block mb-1 text-sm">სახელი *</label>
              <input
                type="text"
                id="agentName"
                name="name"
                value={modalData.name}
                onChange={handleChange}
                className={getInputClassName('name')}
                required
              />
              <div className={getMessageClassName('name')}>
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {errors.name || 'მინიმუმ ორი სიმბოლო'}
              </div> 
            </div>
            <div>
              <label htmlFor="agentSurname" className="block mb-1 text-sm">გვარი *</label>
              <input
                type="text"
                id="agentSurname"
                name="surname"
                value={modalData.surname}
                onChange={handleChange}
                className={getInputClassName('surname')}
                required
              />
              <div className={getMessageClassName('surname')}>
                <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {errors.surname || 'მინიმუმ ორი სიმბოლო'}
              </div> 
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="agentEmail" className="block mb-1 text-sm">ელ-ფოსტა *</label>
            <input
              type="email"
              id="agentEmail"
              name="email"
              value={modalData.email}
              onChange={handleChange}
              className={getInputClassName('email')}
              required
            />
            <div className={getMessageClassName('email')}>
              <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {errors.email || 'გამოიყენეთ @redberry.ge ფოსტა'}
            </div> 
          </div>
          <div className="mb-4">
            <label htmlFor="agentPhone" className="block mb-1 text-sm">ტელეფონის ნომერი *</label>
            <input
              type="tel"
              id="agentPhone"
              name="phone"
              value={modalData.phone}
              onChange={handleChange}
              className={getInputClassName('phone')}
              required
            />
            <div className={getMessageClassName('phone')}>
              <svg className="w-3 h-3 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {errors.phone || 'მხოლოდ რიცხვები'}
            </div> 
          </div>
          <div className="mb-6">
            <label htmlFor="agentAvatar" className="block mb-1 text-sm">აგენტის ფოტო *</label>
            <div className="border-2 border-dashed border-[#2D3648] rounded-md p-4 flex items-center justify-center min-h-[120px]">
              {!avatarPreview ? (
                <label 
                  htmlFor="agentAvatar" 
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 8V16" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12H16" stroke="#2D3648" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-sm text-gray-500">ატვირთეთ ფოტო</span>
                </label>
              ) : (
                <div className="relative">
                  <img src={avatarPreview} alt="Agent preview" className="max-w-[100px] max-h-[100px] object-cover" />
                  <button 
                    onClick={removeAvatar}
                    className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full shadow-md"
                    type="button"
                  >
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            <input
              type="file"
              id="agentAvatar"
              name="avatar"
              onChange={handleAvatarChange}
              className="hidden"
              accept="image/*"
            />
            {errors.avatar && <p className="text-xs text-red-500 mt-1">{errors.avatar}</p>}
          </div>
        </form>
        <div className="flex justify-end gap-2">
          <button type="button" onClick={toggleModal} className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200">
            გაუქმება
          </button>
          <button type="submit" onClick={handleSubmit} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
            დამატება აგენტი
          </button>
        </div>
      </div>
    </div>
  )

});

export default AddAgentModal;