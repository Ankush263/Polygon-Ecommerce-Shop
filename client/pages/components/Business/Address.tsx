import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
// import ABI from '../../../../../artifacts/contracts/Ecommarce.sol/Ecommarce.json';
import ABI from '../../../utils/Ecommarce.json';
import { ethers } from 'ethers';
import swal from 'sweetalert';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { GetServerSideProps, GetStaticProps } from 'next';


// export const getServerSideProps: GetServerSideProps = async(contex) => {

//   return {
//     props: {
//       id: 1,
//       data: null,
//     }
//   }

// }

export const getStaticProps: GetStaticProps = async(contex) => {

  return {
    revalidate: 5,
    props: {
      id: 1,
      data: null,
    }
  }

}


export default function Address(props: any) {

  const [delevered, setDeleverd] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const [buyerAddress, setBuyerAddress] = useState("")

  const deployAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const showAddress = async (orderId: any) => {

    try {
      if(typeof window !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployAddress, ABI.abi, signer)
        console.log(props.id)
        console.log("orderId: ", orderId)
        let address = await contract.ShowMyCustomersByOrderId(orderId, props.id)
        let deliveryLocation = await contract.deliveryLocation(props.id, address, orderId)
        let productsNumber = await contract.productsNumber(address, props.id, orderId)
        swal(deliveryLocation, productsNumber.toString())
        console.log("deliveryLocation: ", deliveryLocation)
        console.log("productsNumber: ", productsNumber.toString())
      }

    } catch (error) {
      console.log(error)
    }
  }

  const fetch = async (addr: any) => {

    try {
      if(typeof window !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployAddress, ABI.abi, signer)
        let address = await contract.ShowMyCustomersByOrderId(props.data, props.id)
        console.log("address: ", address)
        setBuyerAddress(address)
        let deleveryStatus = await contract.delivery(props.data, props.id, address)
        let cancellStatus = await contract.orderCancel(props.data, props.id, address)
        setDeleverd(deleveryStatus)
        setCancelled(cancellStatus)
      }
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(() => {
    fetch(props.data)
  }, [])


  return (
    <div className='mb-10 w-8/12 flex justify-between'>
      <span>{buyerAddress}</span>
      {
        delevered ? 
        <img src="/images/delivered.png" className="w-12" /> : 
        cancelled ? 
        <img src="/images/cancelled.png" className="w-12" /> :

        <img src="/images/deliver.png" className="w-12" />
      }
      <Button onClick={() => showAddress(props.data)} variant="contained" className='bg-orange-500'>Show Details</Button>
    </div>
  )
}