import { useState } from 'react';
import { Modal } from '../../components/ui/Modal';
import { ItemTypeSelect } from './ItemTypeSelect';
import { ItemDetailsForm } from './ItemDetailsForm';
import { LocationPicker } from './LocationPicker';
import { useMapStore } from '../../store/map.store';
import { Plus } from 'lucide-react';

type FormData = {
  title: string;
  description: string;
  category: string;
  expiresAt: string;
  radius: number;
};

export const PostItemModal = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'intro' | 'details' | 'location'>('intro');
  const [formData, setFormData] = useState<FormData | null>(null);
  const { clearPostingLocation } = useMapStore();

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setStep('intro');
      setFormData(null);
      clearPostingLocation();
    }, 300);
  };

  const handleContinue = () => {
    setStep('details');
  };

  const handleDetailsSubmit = (data: FormData) => {
    setFormData(data);
    setStep('location');
  };

  const handleBack = () => {
    if (step === 'location') {
      setStep('details');
    } else if (step === 'details') {
      setStep('intro');
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:scale-110 hover:bg-blue-700 hover:shadow-xl active:scale-95"
        aria-label="Post new item"
      >
        <Plus size={28} strokeWidth={2.5} />
      </button>

      <Modal open={open} onClose={handleClose}>
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {step === 'intro' && 'Post Found Item'}
              {step === 'details' && 'Item Details'}
              {step === 'location' && 'Where Did You Find It?'}
            </h2>
            <div className="flex gap-1">
              <div
                className={`h-1 w-8 rounded ${
                  step === 'intro' ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              />
              <div
                className={`h-1 w-8 rounded ${
                  step === 'details' ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              />
              <div
                className={`h-1 w-8 rounded ${
                  step === 'location' ? 'bg-slate-900' : 'bg-slate-300'
                }`}
              />
            </div>
          </div>
        </div>

        {step === 'intro' && <ItemTypeSelect onContinue={handleContinue} />}

        {step === 'details' && (
          <ItemDetailsForm
            type="found"
            onSubmit={handleDetailsSubmit}
            onBack={handleBack}
          />
        )}

        {step === 'location' && formData && (
          <LocationPicker
            type="found"
            formData={formData}
            onClose={handleClose}
            onBack={handleBack}
          />
        )}
      </Modal>
    </>
  );
};


