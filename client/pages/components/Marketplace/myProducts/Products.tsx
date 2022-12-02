import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
// import ABI from '../../../../../artifacts/contracts/Ecommarce.sol/Ecommarce.json';
import ABI from '../../../../utils/Ecommarce.json';
import { ethers } from 'ethers';
import { GetServerSideProps, GetStaticProps } from 'next';
import RefreshIcon from '@mui/icons-material/Refresh';

// export const getServerSideProps: GetServerSideProps = async(contex) => {
//   return {
//     props: {
//       data: {
//         img: "https://www.domusweb.it/content/dam/domusweb/en/news/2021/05/13/how-to-mint-your-own-nft-in-5-simple-steps/nft.jpg.foto.rbig.jpg",
//         productId: 1,
//         delevered: false,
//         deliveryStart: "",
//         deliveryEnd: ""
//       }
//     }
//   }
// }
export const getStaticProps: GetStaticProps = async(contex) => {
  return {
    revalidate: 5,
    props: {
      data: {
        img: "https://www.domusweb.it/content/dam/domusweb/en/news/2021/05/13/how-to-mint-your-own-nft-in-5-simple-steps/nft.jpg.foto.rbig.jpg",
        productId: 1,
        delevered: false,
        deliveryStart: "",
        deliveryEnd: ""
      }
    }
  }
}

export default function Products(props: any) {

  const deployAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

  const [click, setClick] = useState(true)
  const [delevered, setDelevered] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const delivered = async () => {
    setClick(true)
    try {
      if(typeof window !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployAddress, ABI.abi, signer)
        let orderIds = await contract.showAllMyOrderIds()
        let currentIndex = props.Ids.indexOf(props.data)
        let transaction = await contract.completeDelivery(orderIds[currentIndex], props.data.productId)
        await transaction.wait()
        alert('Your Order is delivered to you!!!')
        window.location.replace('/components/Marketplace/HomePage')
      }
        
    } catch (error) {
      console.log(error)
    }
  }

  const CancellOrder = async () => {
    setClick(true)
    try {
      if(typeof window !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployAddress, ABI.abi, signer)
        let orderIds = await contract.showAllMyOrderIds()
        let currentIndex = props.Ids.indexOf(props.data)
        let transaction = await contract.cancellOrder(orderIds[currentIndex], props.data.productId)
        await transaction.wait()
        alert('Your current order got cancelled Successfully!!!')
        window.location.replace('/components/Marketplace/HomePage')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fatchedData = async() => {
    try {
      if(typeof window !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployAddress, ABI.abi, signer)
        const currentAddress = await signer.getAddress()
        let orderIds = await contract.showAllMyOrderIds()
        let currentIndex = props.Ids.indexOf(props.data)
        let deliveryStatus = await contract.delivery(orderIds[currentIndex], props.data.productId, currentAddress)
        let cancellStatus = await contract.orderCancel(orderIds[currentIndex], props.data.productId, currentAddress)
        setCancelled(cancellStatus)
        console.log("deliveryStatus: ", deliveryStatus)
        console.log("cancellStatus: ", cancellStatus)
        setDelevered(deliveryStatus)
        setClick(false)

      }

    } catch (error) {
      console.log(error)
    }
  }

  setTimeout(() => {
    fatchedData()
  }, 1500);


  const styles = {
    productBox: `w-full h-48 flex justify-around items-center mb-5 `,
    imgBox: `w-48 h-48 rounded-xl`,
    rightBox: `w-96 h-48 mr-8 flex justify-center items-center`,
  }

  return (
    <div className={styles.productBox}>
      <div className={styles.imgBox}>
        <img src={typeof props.data.img !== 'undefined' && props.data.img} className='w-full h-full rounded-xl' />
      </div>
      {!delevered ? <span className='text-2xl text-black font-bold w-72'>
        {props.data.title}
      </span> : <span className='text-xl text-black font-bold'>Thank you for shopping with us😊</span>}
      <div className={styles.rightBox}>
        <div className="w-full flex justify-between items-center">

        {/* <Button variant="contained" onClick={fatchedData} className="bg-blue-700">
          <RefreshIcon />
        </Button> */}
          

          {
            !delevered && !cancelled ? 
            <div className="w-96 flex justify-between">
              <Button variant="contained" disabled={click} onClick={delivered} className='w-5/12 bg-green-700' color="success">
                <span className='normal-case'>Got my order</span>
              </Button> 
              <Button variant="contained" disabled={click} onClick={CancellOrder} className='w-5/12 bg-red-700' color="error">
                <span className='normal-case'>Cencell Order</span>
              </Button> 
            </div> :
            cancelled ? 
            <span className='text-black text-xl font-bold'>This Order got Cancelled⛔</span>
            :
            <span className='text-black text-xl font-bold'>You have recived your product✅</span>
          }
          
        </div>
      </div>
    </div>
  )
}
