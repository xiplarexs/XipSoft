import { redirect } from 'next/navigation'
import AdminSidebar from './AdminSidebar'

export default function AdminPage() {
  // Ana admin sayfası varsayılan olarak analytics'e yönlendirsin
  redirect('/admin/analytics')
}
