import { createFileRoute } from '@tanstack/react-router';

import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return (
    <>
      <div className="relative flex flex-col">
        <Header />
      </div>
      <Footer />
    </>
  );
}
