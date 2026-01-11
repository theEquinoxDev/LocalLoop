import { useItemStore } from '../../store/item.store';
import { ItemCard } from './ItemCard';
import { EmptyState } from '../../components/feedback/EmptyState';
import type { Item } from '../../types/item';

type ItemListProps = {
  items?: Item[];
};

export const ItemList = ({ items: itemsProp }: ItemListProps) => {
  const storeItems = useItemStore((s) => s.items);
  const items = itemsProp ?? storeItems;

  if (items.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          title="No items found"
          subtitle="Try adjusting your filters"
        />
      </div>
    );
  }

  return (
    <div className="space-y-2 p-3">
      {items.map((item) => (
        <ItemCard key={item._id} item={item} />
      ))}
    </div>
  );
};
