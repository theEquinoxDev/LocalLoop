import { Button } from '../../components/ui/Button';
import { Package } from 'lucide-react';

type Props = {
  onContinue: () => void;
};

export const ItemTypeSelect = ({ onContinue }: Props) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Package size={32} className="text-blue-600" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-slate-900">Report Found Item</h3>
        <p className="text-sm text-slate-600">
          Help reunite lost items with their owners by posting what you found!
        </p>
      </div>
      <Button className="w-full" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
};
