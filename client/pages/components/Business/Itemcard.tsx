import { ethers } from 'ethers'
import Link from 'next/link'
import React from 'react'
import { GetStaticProps } from 'next';

export const getStaticProps: GetStaticProps = async(contex) => {
  return {
    revalidate: 5,
    props: {
      data: {
        img: "https://www.domusweb.it/content/dam/domusweb/en/news/2021/05/13/how-to-mint-your-own-nft-in-5-simple-steps/nft.jpg.foto.rbig.jpg",
        title: "",
        seller: "",
        buyer: "",
        id: 1,
        delevered: false,
        price: 0,
        stocks: 0
      }
    }
  }
}

export default function ItemCard(props: any) {

  const stocks = () => {
    // console.log("listed product info: ", props.data)
  }

  const data = {
    img: props.data.img,
    title: props.data.title,
    seller: props.data.seller,
    buyer: props.data.buyer,
    id: props.data.productId,
  }

  const styles = {
    cardBox: `w-36 h-56 flex flex-col justify-between items-center`,
    imgBox: `w-full h-44 bg-slate-300/[.5] shadow-2xl border-white-900/75 rounded-xl`,
    img: `w-full h-full border-4 border-orange-600 rounded-xl`,
  }

  return (
    <div className={styles.cardBox}>
      <div className={styles.imgBox}>
        <Link 
          href={{
            pathname: `/components/Business/items/${props.data.productId}`,
            query: data
          }}
        >
          <img src={props.data.img} onClick={stocks} className={styles.img} />
        </Link>
      </div>
      <div className="flex w-full justify-between">
        <span className='text-black text-sm font-bold'>{props.data.title}</span>
        <span className='text-black text-sm font-bold'>Stocks: {props.data.stocks ? (props.data.stocks).toString() : ""}</span>
      </div>
      <div className="w-full flex justify-between items-center">
        <div className="flex justify-start">
          <span className='text-black text-sm font-semibold'>{props.data.price}</span>
          <img src="/images/polygon.png" className='w-6 ml-2 p-0' />
        </div>
        <span className='font-bold text-black'> - </span>
        <div className="flex justify-end">
          <span className='text-black text-sm font-semibold'>{(props.data.price * 0.92).toString().slice(0, 6)}</span>
          <img src="/images/doller.png" className='w-4 ml-2 p-0' />
        </div>
      </div>
    </div>
  )
}
