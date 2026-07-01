export default function Button({ variant = 'primary', className = '', children, ...props }) {
  const variants = {
    primary: 'bg-grocery-600 text-white hover:bg-grocery-700 shadow-sm',
    secondary: 'bg-white text-grocery-700 border border-grocery-200 hover:bg-grocery-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'text-gray-600 hover:bg-gray-100',
  };

  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
