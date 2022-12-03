import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
// import ABI from '../../../../../artifacts/contracts/Ecommarce.sol/Ecommarce.json';
import ABI from '../../../utils/Ecommarce.json';
import { ethers } from 'ethers';
import Swal from 'sweetalert2'
import { GetStaticProps } from 'next';

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

  const deployAddress = "0xaeBf6b98F358aE5449fABe2Bcb83f1754eE40FdD"

  const [delevered, setDeleverd] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [buyerAddress, setBuyerAddress] = useState("")
  const [location, setLocation] = useState("")
  const [number, setNumber] = useState("")


  const showAddress = async (orderId: any) => {

    try {
      if(typeof window !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployAddress, ABI.abi, signer)
        // console.log(props.id)
        // console.log("orderId: ", orderId)
        let address = await contract.ShowMyCustomersByOrderId(orderId, props.id)
        let deliveryLocation = await contract.deliveryLocation(props.id, address, orderId)
        let productsNumber = await contract.productsNumber(address, props.id, orderId)
        setLocation(deliveryLocation)
        setNumber(productsNumber.toString())
        
        Swal.fire({
          title: `Number of items: ${productsNumber}`,
          text: `Delivery Location: ${deliveryLocation}`,
          backdrop: `rgba(0,0,123,0.4)`,
          color: "rgb(225, 225, 225)",
          background: "#000000",
          imageWidth: 450,
          imageHeight: 450,
          imageAlt: 'Custom image',
        })
        // console.log("location: ", location)
        // console.log("number: ", number)
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
        // console.log("address: ", address)
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