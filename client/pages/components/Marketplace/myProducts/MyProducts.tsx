import React, { useState, useEffect } from 'react';
// import ABI from '../../../../../artifacts/contracts/Ecommarce.sol/Ecommarce.json';
import ABI from '../../../../utils/Ecommarce.json';
import { ethers } from 'ethers';
import Products from './Products';

function MyProducts() {

  const sampleData = [
    {
      "img": "https://www.domusweb.it/content/dam/domusweb/en/news/2021/05/13/how-to-mint-your-own-nft-in-5-simple-steps/nft.jpg.foto.rbig.jpg",
      "title": "Demo1",
      "price": "1000",
      "tokenId": "01",
    },
    {
      "img": "https://www.domusweb.it/content/dam/domusweb/en/news/2021/05/13/how-to-mint-your-own-nft-in-5-simple-steps/nft.jpg.foto.rbig.jpg",
      "title": "Demo2",
      "price": "1000",
      "tokenId": "02",
    },
  ]

  const sampleIds = [-1, -1]


  const deployAddress = "0xaeBf6b98F358aE5449fABe2Bcb83f1754eE40FdD"
  const [data, setData] = useState(sampleData)
  const [fatch, setFatch] = useState(false)
  const [Ids, storeIds] = useState(sampleIds)
  const [itemId, setItemId] = useState()


  const fatchedData = async() => {
    try {
      if(typeof window !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(deployAddress, ABI.abi, signer)
        let allMyProducts = await contract.getMyAllProduct();

        const items: any = await Promise.all(allMyProducts.map(async (i: any) => {

          let item = {
            price: i.price,
            productId: i.productId,
            seller: i.seller,
            buyer: i.buyer,
            title: i.title,
            desc: i.desc,
            stocks: i.stocks,
            img: i.img,
          }
          return item
        }))
        items.map(async (i: any) => {
          storeIds(await contract.showOrderId(i.productId, signer.getAddress()))
          setItemId(i.productId)
        })
        setData(items)
        setFatch(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  if(!fatch) {
    fatchedData()
  }

  const styles = {
    page: `w-screen min-h-screen flex justify-center items-center`,
    box: `w-10/12 min-h-96 bg-slate-300/[.3] shadow-2xl border-stone-900 rounded-xl p-3`,
  }

  return (
    <div className={styles.page}>
      <div className={styles.box}>
        <div>
          {data.map((value, index) => {
            return <Products data={value} Ids={data} key={index} />
          })}
        </div>
      </div>
    </div>
  )
}

export default MyProducts