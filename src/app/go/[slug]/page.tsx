import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import redirects from '../../../../redirects.json'
import GoRedirect from './GoRedirect'

type Destination = string | { ios: string; android: string; desktop: string }

interface Props {
  params: Promise<{ slug: string }>
}

export default async function GoPage({ params }: Props) {
  const { slug } = await params
  const entry = (redirects as Record<string, Destination>)[slug]

  if (!entry) redirect('/')

  const headersList = await headers()
  const ua = headersList.get('user-agent') || ''
  const isIOS = /iPhone|iPad|iPod/i.test(ua)
  const isAndroid = /Android/i.test(ua)

  let destination: string
  if (typeof entry === 'string') {
    destination = entry
  } else {
    destination = isIOS ? entry.ios : isAndroid ? entry.android : entry.desktop
  }

  const url = new URL(destination)
  url.searchParams.set('utm_source', 'beforescroll')
  url.searchParams.set('utm_medium', 'social')
  url.searchParams.set('utm_campaign', slug)

  return <GoRedirect destination={url.toString()} slug={slug} />
}
