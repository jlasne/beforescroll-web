import { redirect } from 'next/navigation'
import redirects from '../../../../redirects.json'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function GoPage({ params }: Props) {
  const { slug } = await params
  const destination = (redirects as Record<string, string>)[slug]

  if (destination) {
    const url = new URL(destination)
    url.searchParams.set('utm_source', 'beforescroll')
    url.searchParams.set('utm_medium', 'social')
    url.searchParams.set('utm_campaign', slug)
    redirect(url.toString())
  }

  redirect('/')
}
