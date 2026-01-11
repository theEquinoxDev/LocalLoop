import { useForm } from 'react-hook-form';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

type FormData = {
  title: string;
  description: string;
  category: string;
  expiresAt: string;
  radius: number;
};

type Props = {
  type: 'lost' | 'found';
  onSubmit: (data: FormData) => void;
  onBack: () => void;
};

const categories = [
  'electronics',
  'clothing',
  'accessories',
  'documents',
  'keys',
  'wallet',
  'bag',
  'phone',
  'jewelry',
  'books',
  'toys',
  'sports',
  'general',
];

export const ItemDetailsForm = ({ onSubmit, onBack }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      radius: 200,
    },
  });

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const oneYearLater = new Date();
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    return oneYearLater.toISOString().split('T')[0];
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Title *
        </label>
        <Input
          placeholder="e.g., Lost iPhone 13"
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 3,
              message: 'Title must be at least 3 characters',
            },
          })}
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Description
        </label>
        <Textarea
          placeholder="Provide additional details about the item..."
          rows={4}
          {...register('description')}
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Category *
        </label>
        <Select
          {...register('category', { required: 'Category is required' })}
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </Select>
        {errors.category && (
          <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Expiration Date *
        </label>
        <Input
          type="date"
          min={getMinDate()}
          max={getMaxDate()}
          {...register('expiresAt', { required: 'Expiration date is required' })}
        />
        {errors.expiresAt && (
          <p className="mt-1 text-xs text-red-600">
            {errors.expiresAt.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Search Radius (meters)
        </label>
        <Input
          type="number"
          min="50"
          max="5000"
          step="50"
          placeholder="200"
          {...register('radius', {
            valueAsNumber: true,
            min: { value: 50, message: 'Minimum radius is 50 meters' },
            max: { value: 5000, message: 'Maximum radius is 5000 meters' },
          })}
        />
        {errors.radius && (
          <p className="mt-1 text-xs text-red-600">{errors.radius.message}</p>
        )}
        <p className="mt-1 text-xs text-slate-500">
          How far from the location should people search? (default: 200m)
        </p>
      </div>

      <div className="flex gap-2">
        <Button type="button" variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Next: Select Location
        </Button>
      </div>
    </form>
  );
};


