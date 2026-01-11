import Map, { Source, Layer, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useEffect, useRef, useMemo } from 'react';
import { useMapStore } from '../../store/map.store';
import { useItemStore } from '../../store/item.store';
import { ItemMarker } from './ItemMarker';
import { UserMarker } from './UserMarker';
import { calculateDistance } from '../../utils/locationUtils';

export const MapView = () => {
  const { latitude, longitude, zoom, setLocation, setZoom, selectedItemId, setAnimationComplete, mapStyle } = useMapStore();
  const { items, fetchNearby } = useItemStore();
  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();
  const mapRef = useRef<any>(null);

  const geojsonData = useMemo(() => ({
    type: 'FeatureCollection',
    features: items.map(item => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: item.location.coordinates,
      },
      properties: {
        id: item._id,
        category: item.category,
        type: item.type,
      },
    })),
  }), [items]);

  const routeData = useMemo(() => {
    if (!selectedItemId || !latitude || !longitude) return null;
    
    const selectedItem = items.find(item => item._id === selectedItemId);
    if (!selectedItem) return null;

    const distance = calculateDistance(
      latitude,
      longitude,
      selectedItem.location.coordinates[1],
      selectedItem.location.coordinates[0]
    );

    return {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [longitude, latitude],
          selectedItem.location.coordinates,
        ],
      },
      properties: {
        distance: distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`,
      },
    };
  }, [selectedItemId, latitude, longitude, items]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLocation(pos.coords.latitude, pos.coords.longitude);
    });
  }, [setLocation]);

  useEffect(() => {
    if (latitude && longitude) {
      fetchNearby(latitude, longitude, 5000);
    }
  }, [latitude, longitude, fetchNearby]);

  useEffect(() => {
    if (selectedItemId && mapRef.current) {
      const selectedItem = items.find(item => item._id === selectedItemId);
      if (selectedItem) {
        const map = mapRef.current.getMap();
        
        const onMoveEnd = () => {
          setAnimationComplete(true);
          map.off('moveend', onMoveEnd);
        };
        
        map.on('moveend', onMoveEnd);
        
        map.flyTo({
          center: [selectedItem.location.coordinates[0], selectedItem.location.coordinates[1]],
          zoom: 16,
          duration: 1500,
          essential: true,
        });
      }
    }
  }, [selectedItemId, items, setAnimationComplete]);

  const handleMapMove = (e: any) => {
    const { latitude: newLat, longitude: newLng, zoom: newZoom } = e.viewState;
    setZoom(newZoom);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchNearby(newLat, newLng, 5000);
    }, 1000);
  };

  const handleMapLoad = (e: any) => {
    const map = e.target;
    
    const layers = map.getStyle().layers;
    const labelLayerId = layers.find(
      (layer: any) => layer.type === 'symbol' && layer.layout['text-field']
    )?.id;

    map.addLayer(
      {
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 14,
        paint: {
          'fill-extrusion-color': '#888',
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['zoom'],
            14,
            0,
            14.5,
            ['get', 'height'],
          ],
          'fill-extrusion-base': [
            'interpolate',
            ['linear'],
            ['zoom'],
            14,
            0,
            14.5,
            ['get', 'min_height'],
          ],
          'fill-extrusion-opacity': 0.8,
        },
      },
      labelLayerId
    );
  };

  if (latitude === null || longitude === null) return null;

  const clusterLayer: any = {
    id: 'clusters',
    type: 'circle' as const,
    source: 'items',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': ['step', ['get', 'point_count'], '#3b82f6', 10, '#8b5cf6', 30, '#ec4899'],
      'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 30, 40],
      'circle-stroke-width': 2,
      'circle-stroke-color': '#fff',
    },
  };

  const clusterCountLayer = {
    id: 'cluster-count',
    type: 'symbol' as const,
    source: 'items',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{point_count_abbreviated}',
      'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
      'text-size': 14,
    },
    paint: {
      'text-color': '#ffffff',
    },
  };

  const handleClusterClick = (e: any) => {
    const feature = e.features[0];
    const clusterId = feature.properties.cluster_id;
    const mapboxSource = mapRef.current?.getMap().getSource('items');

    mapboxSource.getClusterExpansionZoom(clusterId, (err: any, zoom: number) => {
      if (err) return;

      mapRef.current?.getMap().easeTo({
        center: feature.geometry.coordinates,
        zoom,
        duration: 500,
      });
    });
  };

  return (
    <Map
      ref={mapRef}
      mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      initialViewState={{
        latitude,
        longitude,
        zoom,
      }}
      mapStyle={mapStyle === 'dark' ? 'mapbox://styles/mapbox/dark-v11' : 'mapbox://styles/mapbox/satellite-streets-v12'}
      onMove={handleMapMove}
      onLoad={handleMapLoad}
      collectResourceTiming={false}
      interactiveLayerIds={['clusters']}
      onClick={(e) => {
        if (e.features && e.features.length > 0 && e.features[0]?.layer?.id === 'clusters') {
          handleClusterClick(e);
        }
      }}
    >
      <NavigationControl position="bottom-left" showCompass={true} showZoom={true} />
      
      <UserMarker lat={latitude} lng={longitude} />

      {routeData && (
        <Source id="route" type="geojson" data={routeData as any}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              'line-color': '#f59e0b',
              'line-width': 5,
              'line-opacity': 0.9,
            }}
          />
          <Layer
            id="route-label"
            type="symbol"
            layout={{
              'text-field': ['get', 'distance'],
              'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
              'text-size': 14,
              'symbol-placement': 'line-center',
            }}
            paint={{
              'text-color': '#ffffff',
              'text-halo-color': '#f59e0b',
              'text-halo-width': 2,
            }}
          />
        </Source>
      )}

      <Source
        id="items"
        type="geojson"
        data={geojsonData as any}
        cluster={true}
        clusterMaxZoom={14}
        clusterRadius={50}
      >
        <Layer {...clusterLayer} />
        <Layer {...clusterCountLayer} />
      </Source>

      {zoom > 14 && items.map((item) => (
        <ItemMarker key={item._id} item={item} />
      ))}
    </Map>
  );
};


