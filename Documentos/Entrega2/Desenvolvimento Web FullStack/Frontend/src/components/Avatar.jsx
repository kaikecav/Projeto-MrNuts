import { buildImageUrl } from '../api/client.js';

export default function Avatar({ user, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-24 h-24 text-2xl',
  };
  const initials = (user?.nomeUsuario || '?')
    .split(' ')
    .map((s) => s[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const imgUrl = buildImageUrl(user?.img);

  return (
    <div
      className={`${sizes[size]} rounded-full bg-brand-900 text-white font-semibold flex items-center justify-center overflow-hidden flex-shrink-0`}
    >
      {imgUrl ? (
        <img src={imgUrl} alt={user.nomeUsuario} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
