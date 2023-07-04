import Image from 'next/image'
import { Inter } from 'next/font/google'
import DefaultLayout from '../Components/Layout/DefaultLayout'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    return (
        <DefaultLayout>
            Next
        </DefaultLayout>
    )
}
