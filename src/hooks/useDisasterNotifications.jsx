import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { mockDisasters } from '../lib/data';

export function useDisasterNotifications() {
  const [activeDisasters, setActiveDisasters] = useState(() =>
    mockDisasters.filter(d => d.status === 'aktif')
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const currentActive = mockDisasters.filter(d => d.status === 'aktif');
      const newCount = currentActive.length;
      const oldCount = activeDisasters.length;

      if (newCount > oldCount) {
        const newestDisaster = currentActive[0];
        toast.error(
          `Bencana Baru: ${newestDisaster.title}`,
          {
            duration: 5000,
            icon: '🚨',
          }
        );
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [activeDisasters]);

  return { activeDisasters };
}
