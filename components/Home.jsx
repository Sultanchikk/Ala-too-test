import Link from 'next/link';
import { useUser } from '../lib/hooks';
import AfterLogin from '../components/AfterLogin';
import { useState } from 'react';

export default function Home() {
    const [user, { mutate }] = useUser();
    const [loading, isLoading] = useState(false);
    const handleLogout = async () => {
        isLoading(true);
        await fetch('/api/auth', {
            method: 'DELETE',
        });
        // set the user state to null
        mutate(null);
        isLoading(false);
    };
    return (
        <>
            <div class="card">
                <div class="">
                    <div class="col-md-7 w-100">
                        <div class="card-body h-100 text-center">
                            <div className='row h-100' style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div className='col-sm-12'>
                                    {!user ? (<>
                                    </>) : (<AfterLogin />)}
                                </div>
                                <div className='col-sm-12' style={{ alignSelf: 'end' }}>
                                    {!user ? (
                                        <>
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Link href="/login">
                                                    <a className="btn btn-primary">Войти</a>
                                                </Link>
                                                <Link href="/signup">
                                                    <a className="btn btn-primary">Зарегаться</a>
                                                </Link>
                                            </div>
                                        </>
                                    ) : (
                                        <>

                                            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                                <Link href="/user/[userId]" as={`/user/${user._id}`}>
                                                    <a className="btn btn-primary">Профиль</a>
                                                </Link>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
