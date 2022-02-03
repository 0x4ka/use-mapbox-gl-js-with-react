import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import {MapboxLayer} from '@deck.gl/mapbox'
import {Tile3DLayer} from '@deck.gl/geo-layers';
import {Tiles3DLoader} from '@loaders.gl/3d-tiles';

mapboxgl.accessToken = 'pk.eyJ1IjoiaW4ydHdhbiIsImEiOiJja3l6bjJ0ZWIwY2d0Mm5yemZ3NWFmOWhjIn0._B39LsH99PmOk74938_tUg'
const tileChiyoda = 'https://s3-ap-northeast-1.amazonaws.com/3dimension.jp/13000_tokyo-egm96/13101_chiyoda-ku_notexture/tileset.json';

export default function App() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lat, setLat] = useState(35.68836671417561);
  const [lng, setLng] = useState(139.75643914212702);
  const [zoom, setZoom] = useState(14);

  const tile3dLayer = new MapboxLayer({
    id: 'tile3dlayer',
    type: Tile3DLayer,
    pointSize: 1,
    data: tileChiyoda,
    opacity: 0.9,
    pickable: true,
    loader: Tiles3DLoader,
    onTileLoad: (tileHeader) => tileHeader.content.cartographicOrigin.z -= 40,
    onHover: (Tile3DLayer, event) => console.log('Hovered:', Tile3DLayer, event)
  });

  const nav = new mapboxgl.NavigationControl();

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/in2twan/ckyzn794b000t14s81978v83n',
      center: [lng, lat],
      zoom: zoom,
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    });
  });

  useEffect(() => {
    map.current.on('load', () => {
      map.current.addLayer(tile3dLayer);
      map.current.addControl(nav, 'bottom-right');
    });
  });

  return (
    <div>
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container"/>
    </div>
  );
};