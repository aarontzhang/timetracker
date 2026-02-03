interface CategoryButtonProps {
  name: string;
  color: string;
  onClick: () => void;
}

export function CategoryButton({ name, color, onClick }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center px-4 py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 active:scale-95 transition-all min-h-[48px] min-w-[80px]"
      style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
    >
      <span className="text-sm font-medium text-gray-800">{name}</span>
    </button>
  );
}
