import React, { useEffect, useState } from 'react';
import { Marker, GoogleApiWrapper } from "google-maps-react";
const Map = require('google-maps-react').Map
import { GetStaticProps } from 'next'

export const getStaticProps: GetStaticProps = async(contex) => {
  return {
    revalidate: 5,
    props: {
      locations: null,
      google: null,
      setHighLight: null,
    }
  }
}

function LocationMap(props: any) {

  const [center, setCenter] = useState({ lat: 0, lng: 0 })

  useEffect(() => {
    let arr = Object.keys(props.locations)
    let getLat = (key: any) => props.locations[key]["lat"]
    let avgLat = arr.reduce((a, c) => a + Number(getLat(c)), 0) / arr.length

    let getLng = (key: any) => props.locations[key]["lng"]
    let avgLng = arr.reduce((a, c) => a + Number(getLng(c)), 0) / arr.length

    setCenter({ lat: avgLat, lng: avgLng })

  }, [props.locations])

  return (
    <div>
      {
        center && (
          <Map
            google={props.google}
            containerStyle={{
              width: "35.79vw",
              height: "53vh",
              setZoom: 13
            }}
            center={center}
            initialCenter={props.locations[0]}
            disableDefault={true}
          >
            {
              props.locations.map((coords: any, i: any) => (
                <Marker position={coords} onClick={() => props.setHighLight(i)} />
                // <Marker onClick={() => props.setHighLight(i)} />
              ))
            }
          </Map>
        )
      }
    </div>
  )
}

export default GoogleApiWrapper({apiKey: ""}) (LocationMap)