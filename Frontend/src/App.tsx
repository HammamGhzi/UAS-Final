import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import { useEffect } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn('Browser tidak mendukung geolocation');
      return;
    }

    // watchPosition terus memantau lokasi user secara real-time.
    // Setiap kali lokasi berubah / diperbarui browser, localStorage otomatis terupdate.
    // Lebih akurat dari getCurrentPosition karena browser terus berusaha
    // memperbaiki sinyal GPS selama halaman terbuka.
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        localStorage.setItem('userLocation', JSON.stringify(location));
        console.log('Lokasi user diperbarui:', location, `(akurasi: ${pos.coords.accuracy?.toFixed(0)}m)`);
      },
      (err) => {
        console.warn('Gagal dapat lokasi:', err.message);
      },
      {
        enableHighAccuracy: true, // paksa GPS hardware (bukan hanya WiFi)
        timeout: 15000,           // tunggu sampai 15 detik per update
        maximumAge: 0,            // jangan pakai cache lokasi lama, selalu minta fresh
      }
    );

    // Cleanup: hentikan watch saat komponen unmount (tab ditutup / navigasi keluar)
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
