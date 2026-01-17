import React from 'react';
import { useAddEventForm } from '../hooks/useAddEventForm';
import { useEvents } from '../contexts/EventContext';
import AddEventDesktop from './add-event/AddEventDesktop';
import AddEventMobile from './add-event/AddEventMobile';

const AddEventModal: React.FC = () => {
    const { isModalOpen, closeModal } = useEvents();
    const form = useAddEventForm();

    if (!isModalOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-3 md:px-4 font-display">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={closeModal}
            ></div>

            {/* Desktop View */}
            <div className="hidden md:block relative z-10 w-auto">
                <AddEventDesktop form={form} />
            </div>

            {/* Mobile View */}
            <div className="md:hidden relative z-10 w-full animate-[scaleIn_0.2s_ease-out] flex flex-col max-h-[92vh]">
                <AddEventMobile form={form} />
            </div>
        </div >
    );
};

export default AddEventModal;