import { buildMetadata } from '@learner/utils/seo/buildMetadata';
import SearchClient from './SearchClient';

// Canonical ignores the ?q= and filter params so every search combination
// does not become its own indexable URL.
export const metadata = buildMetadata({
  title: 'Free Online Courses & Learning Resources',
  description:
    'Browse free courses, videos, games, stories and reading material from Pratham Open School. Filter by language, subject and age group.',
  path: '/pos/search',
});

export default function PosSearchPage() {
  return <SearchClient />;
}
