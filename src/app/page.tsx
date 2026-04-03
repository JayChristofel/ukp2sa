import { redirect } from 'next/navigation';

export default function RootPage() {
  // Simple fallback redirect. Middleware usually handles this.
  redirect('/id');
}
