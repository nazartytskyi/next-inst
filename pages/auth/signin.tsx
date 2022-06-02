import type { InferGetServerSidePropsType } from 'next'

import Image from 'next/image'
import { getProviders, signIn } from 'next-auth/react'
import Header from '../../components/Header';


const SignIn = ({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    console.log(providers);

    return (
        <>
            <Header />

            <div className='flex flex-col items-center justify-center min-h-screen py-2 -mt-56 px-14 text-center'>
                <div className='relative w-80'>
                    <Image
                        width='5'
                        height='2'
                        src='https://links.papareact.com/ocw'
                        layout='responsive'
                        objectFit='contain'
                        alt='' />
                </div>
                <p className='font-xs italic'>
                    This is not a REAL app, it is built for educational purposes only
                </p>

                <div className='mt-40'>
                    {providers ? (Object.values(providers).map((provider, i) => {
                        if (provider.id !== 'email') {
                            return (
                                <div key={provider.name}>
                                    <button
                                        className='p-3 bg-blue-500 rounded-lg text-white'
                                        onClick={() => signIn(provider.id, { callbackUrl: '/' })}
                                    >
                                        Sign in with {provider.name}
                                    </button>
                                </div>

                            )
                        }
                    })) : []}
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps() {
    const providers = await getProviders();

    return {
        props: { providers },
    };
}

export default SignIn
