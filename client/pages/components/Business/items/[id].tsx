import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Button from '@mui/material/Button';
import { ethers } from 'ethers';
import Address from '../Address';
// import ABI from '../../../../../artifacts/contracts/Ecommarce.sol/Ecommarce.json';
import ABI from '../../../../utils/Ecommarce.json';

function Id() {

  const router = useRouter()
  const data = router.query

  let AllOrderIds: any[] = []
  const [myCustomers, setMyCustomers] = useState(AllOrderIds)
  const [allOrderIds, setAllOrderIds] = useState([])
  const [disable, setDisable] = useState(false)
  const [id, setId] = useState(null)

  const deployAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const customers = async () => {
    setDisable(true)
    try {
      if(typeof window !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployAddress, ABI.abi, signer)
        let allMyCustomers = await contract.ShowMyCustomersById(data.id)
        let allMyOrderIds = await contract.ShowCustomersOrderIdById(data.id)
        setMyCustomers(allMyCustomers)
        setAllOrderIds(allMyOrderIds)
        console.log(allMyOrderIds)
        console.log("data: ", data)
        let ID: any = data.id
        console.log("ID: ", ID)
        setId(ID)
      }

    } catch (error) {
      console.log(error)
    }
  }

  const handleClick = async () => {
    try {
      if(typeof window !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployAddress, ABI.abi, signer)
        let allOrderIds = await contract.ShowCustomersOrderIdById(data.id)
        console.log("allOrderIds: ", allOrderIds)
        allOrderIds.map(async(i: any) => {
          AllOrderIds.push(i.toString())
        })
        setMyCustomers(AllOrderIds)
        let ID: any = data.id
        console.log("ID: ", ID)
        setId(ID)
        console.log("myCustomers: ", AllOrderIds)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const styles = {
    page: `w-screen min-h-screen flex justify-center items-center`,
    box: `w-11/12 h-5/6 bg-slate-300/[.5] shadow-2xl mt-20 mb-10 border-white-900/75 rounded-xl p-4 flex flex-col justify-center items-center`,
  }

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <img src={`${data.img}`} className='w-96 rounded-xl border-4 border-orange-600' onClick={handleClick} />
        <div className="w-full mt-10 flex justify-center items-center">
          <span className='text-3xl text-orange-600 font-bold'>My Customers</span>
        </div>
        <div className="mt-4 w-full min-h-5/6 flex flex-col justify-between items-center">

          <div className="text-black text-2xl flex flex-col justify-center items-center mb-10 w-full">
            <Button disabled={disable} onClick={handleClick} variant="contained" className='mb-5 bg-orange-500'>Show My Customers</Button>
            {
              myCustomers.map((data, index) => {
                return <Address data={data} id={id} key={index} />
              })
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Id