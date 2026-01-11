import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../store/auth.store';

type FormData = {
  email: string;
  password: string;
};

export const LoginForm = () => {
  const { register, handleSubmit } = useForm<FormData>();
  const navigate = useNavigate();
  const loginUser = useAuthStore((s) => s.loginUser);
  const loading = useAuthStore((s) => s.loading);

  const onSubmit = async (data: FormData) => {
    try {
      await loginUser(data.email, data.password);
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      alert(error?.response?.data?.message || error?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input placeholder="Email" {...register('email', { required: true })} />
      <Input type="password" placeholder="Password" {...register('password', { required: true })} />
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={() => navigate('/register')}
          className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
        >
          Register here
        </button>
      </p>
    </form>
  );
};
