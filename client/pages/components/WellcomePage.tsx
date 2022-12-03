import React, { useState, useEffect } from 'react'
import Button from '@mui/material/Button';
import '../../tailwind.config'
import Link from 'next/link';
import { ethers } from 'ethers';


function WellcomePage() {

  const [logedIn, setLogedIn] = useState(false)


  // Connect Wallet functionality-------------------------------------------

  const Connect = async () => {

    try {
      if (typeof window !== 'undefined') {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' })
        if(chainId != '0x13881') {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x13881' }],
          })
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' })
        setLogedIn(true)
        // window.location.replace(location.pathname)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    window.ethereum.on('accountsChanged', (account: any) => {
      window.location.replace(location.pathname)
    })
  }, [])


  const styles = {
    screen: `w-screen h-screen flex justify-center items-center`,
    second: `bg-[url('/images/cart.png')] h-screen w-screen flex flex-col justify-center items-center bg-no-repeat`,
    wallet: `bg-slate-300/[.2] shadow-2xl border-white-900/75 w-60 h-40 rounded-3xl flex flex-col justify-center items-center mb-10`,
    pages: `bg-slate-300/[.2] shadow-2xl border-white-900/75 w-6/12 h-60 rounded-3xl flex gap-20 justify-center items-center`,

  }

  return (
    <div className={styles.screen}>
      <div className={styles.second}>
        <div className={styles.wallet}>
          <span className='font-bold text-slate-50 text-lg'>Connect to the Metamask</span>
            <Button variant="contained" onClick={Connect} className='bg-gradient-to-r from-sky-500 to-indigo-500'>
              <img src="/images/Metamask.png" className='w-10' />
              {logedIn ? <span>Connected</span> : <span>Connect</span>}
            </Button>
          </div>
          <div className={styles.pages}>
            <Link href="/components/Business/Home">
              <Button variant="contained" className='bg-gradient-to-r from-sky-500 to-indigo-500' disabled={!logedIn}>
                <span>Go For Business</span>
                <img src="/images/car_loading.PNG" className='w-20' />
              </Button>
            </Link>
            <Link href="/components/Marketplace/HomePage">
              <Button variant="contained" className='bg-gradient-to-r from-sky-500 to-indigo-500' disabled={!logedIn}>
                <span>Let Shopping</span>
                <img src="/images/shopping.PNG" className='w-20' />
              </Button>
            </Link>
          </div>
      </div>
    </div>
  )
}

export default WellcomePage
