// app/learning-resources/page.tsx
import AILearningSearch from './AILearningSearch';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Learning Resources - LearNoted',
  description:
    'Find the best learning resources for any topic with our AI-powered search tool.',
};

export default function LearningResourcesPage() {
  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900'>
      <Header />
      <AILearningSearch />
      <Footer />
    </div>
  );
}
