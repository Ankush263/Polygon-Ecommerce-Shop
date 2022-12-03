import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Button from '@mui/material/Button';
import { ethers } from 'ethers';
// import ABI from '../../../../artifacts/contracts/Ecommarce.sol/Ecommarce.json';
import ABI from '../../../utils/Ecommarce.json';
import LocationMap from './LocationMap';
import Swal from 'sweetalert2';

function Buy() {

  const deployAddress = "0xaeBf6b98F358aE5449fABe2Bcb83f1754eE40FdD"
  const [address, setAddress] = useState('')
  const [numberItems, setNumberItems] = useState(1)
  const [total, setTotal] = useState(1)
  const [click, setClick] = useState(false)
  const [highLight, setHighLight] = useState()


  const [returnData, setReturnData] = useState(0)

  const router = useRouter()
  const data = router.query

  useEffect(() => {
    setTotal(Number(data.price) * numberItems)
  },[numberItems])

  const buy = async () => {
    setClick(true)
    try {
      if(typeof window !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployAddress, ABI.abi, signer)

        const amount = ((Number(data.price) * numberItems)).toString()

        // console.log(amount)

        let transaction = await contract.buy(
          Number(data.id),
          address,
          Number(numberItems),
          { value: ethers.utils.parseUnits(amount, 'ether') })
        await transaction.wait()
        setReturnData(transaction)
        // console.log(transaction)
        // console.log("returnData: ", returnData)
        Swal.fire(
          'Order Successfull😃',
          `Successfully buy the ${data.title}!!!`,
          'success'
        )
        setAddress('')
        setNumberItems(1)
        setTotal(1)
        window.location.replace('/components/Marketplace/myProducts/MyProducts')
        setClick(false)
      }

    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: '⛔Oops...',
        text: `${error.reason.substr(78)} 😐`,
      })
      console.log("The reason is: ", error.reason.substr(78))
      window.location.replace('/components/Marketplace/HomePage')
    }
  }

  const rentalsList = [
    {
      attributes: {
        city: "New York",
        unoDescription: "3 Guests • 2 Beds • 2 Rooms",
        dosDescription: "Wifi • Kitchen • Living Area",
        imgUrl:
          "https://ipfs.moralis.io:2053/ipfs/QmS3gdXVcjM72JSGH82ZEvu4D7nS6sYhbi5YyCw8u8z4pE/media/3",
        lat: "40.716862",
        long: "-73.999005",
        name: "Apartment in China Town",
        pricePerDay: "3",
      },
    },
  ];

  let cords: any[] = []
  rentalsList.forEach((e) => {
    cords.push({ lat: e.attributes.lat, lng: e.attributes.long })
  })

  const styles = {
    page: `w-screen h-screen flex justify-center items-center`,
    box: `w-10/12 h-full flex items-center bg-slate-300/[.3] shadow-2xl border-stone-900 rounded-xl p-2 border-orange-500 border-2`,
    left: `h-full w-4/12 flex flex-col justify-center items-center bg-slate-300/[.3] shadow-2xl border-stone-900 rounded-xl border-orange-500 border-2`,
    imgBox: `w-9/12 h-3/6 bg-slate-300/[.3] shadow-2xl border-stone-900 rounded-xl border-orange-500 border-2`,
    priceBox: `min-h-10 w-44 mt-5 bg-slate-900 shadow-2xl border-stone-900 rounded-xl pt-1 pl-2 pb-2 border-orange-500 border-2 text-sm flex flex-col`,
    right: `h-full ml-2 w-8/12 flex flex-col justify-around items-center border-2 border-orange-600 rounded-xl`,
    input1: `w-4/12 h-10 shadow-2xl border-stone-900 rounded-xl`,
    input2: `w-8/12 h-40 bg-slate-300/[.3] shadow-2xl border-stone-900 rounded-xl`,
  }

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <div className={styles.left}>
          <div className={styles.imgBox}>
            <img src={`${data.img}`} className='w-full h-full rounded-xl' />
          </div>
          <div className={styles.priceBox}>
            <span>Price: {data.price} & Total: {total} eth</span>
            <span>Only {data.stocks} products left</span>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.input1}>
          <input
            type="number"
            placeholder='enter number of Items'
            onChange={(e: any) => setNumberItems(e.target.value)}
            value={numberItems}
            className='w-full h-full rounded-xl p-3 text-xl'
          />
          </div>
          <div className="w-8/12 h-96">
            <LocationMap locations={cords} setHighLight={setHighLight} />
          </div>
          <div className={styles.input2}>
            <textarea
              cols={40}
              rows={4}
              placeholder='Enter delivery address'
              onChange={(e: any) => setAddress(e.target.value)}
              value={address}
              className='w-full h-full rounded-xl p-3 text-xl'
            ></textarea>
          </div>
          <Button disabled={click} variant='contained' onClick={buy} className='w-6/12 bg-sky-600'>Buy</Button>
        </div>
      </div>
    </div>
  )
}

export default Buy