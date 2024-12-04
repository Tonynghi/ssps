import { RouterProvider, createRouter } from '@tanstack/react-router';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { routeTree } from '@/routeTree.gen';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const AppRouter = () => {
  return <RouterProvider router={router} />;
};
const App = () => {
  return (
    <>
      <ToastContainer />
      <AppRouter />
    </>
  );
};

export default App;
