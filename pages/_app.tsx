import AppLayout from '@/components/Layout'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
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
