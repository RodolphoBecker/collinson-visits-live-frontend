import AppLayout from '@/components/Layout'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import '../styles/globals.css'

const CollinsonApp = ({ Component, pageProps }: AppProps) => {
    const router = useRouter()

    return (
        <AppLayout>
            <Component {...pageProps} />
        </AppLayout>
    )
}

export default CollinsonApp
