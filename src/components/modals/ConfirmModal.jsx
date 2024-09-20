import React, { useRef, useEffect, useImperativeHandle, forwardRef, useState } from 'react';
import CancelButton from '/src/components/ui/CancelButton.jsx'
import AddButton from '/src/components/ui/inputs/AddButton.jsx'

const ConfirmModal = forwardRef(({ onConfirm, message }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef(null);
  
    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                ref.current.close();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isOpen, ref]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center">
            <div ref={modalRef} className="bg-white rounded-[20px] p-6 w-[623px] h-[222px] relative">
                <button 
                    className="absolute top-4 right-4 cursor-pointer"
                    onClick={() => ref.current.close()}
                >
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6.50115 6.49995L12.0401 12.0389M0.962158 12.0389L6.50115 6.49995L0.962158 12.0389ZM12.0401 0.960938L6.50115 6.49995L12.0401 0.960938ZM6.50115 6.49995L0.962158 0.960938L6.50115 6.49995Z" stroke="#2D3648" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <div className="flex flex-col items-center justify-center h-full">
                    <p className="mb-[35px] font-figaRO font-medium text-[20px] leading-[24px] text-[#2D3648]">{message}</p>
                    <div className="flex justify-center space-x-4">
                        <CancelButton onClick={() => ref.current.close()} />
                        <AddButton onClick={onConfirm} noPlus={true} text='დადასტურება' type='filled'/>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ConfirmModal;