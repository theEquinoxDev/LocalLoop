import { motion } from 'framer-motion';

type EmptyStateProps = {
  title: string;
  subtitle?: string;
};

export const EmptyState = ({ title, subtitle }: EmptyStateProps) => {
  return (
    <motion.div
      className="flex h-full flex-col items-center justify-center text-center text-slate-600"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <p className="text-lg font-medium">{title}</p>
      {subtitle && <p className="mt-1 text-sm">{subtitle}</p>}
    </motion.div>
  );
};
  