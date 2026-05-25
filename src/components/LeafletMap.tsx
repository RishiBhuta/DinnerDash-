import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Restaurant } from '../types';

interface LeafletMapProps {
  restaurants: Restaurant[];
  winner: Restaurant | null;
  selectedOnMap: Restaurant | null;
  setSelectedOnMap: (res: Restaurant | null) => void;
}

export default function LeafletMap({
  restaurants,
  winner,
  selectedOnMap,
  setSelectedOnMap
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Reset Leaflet icon default paths (resolves image loading bugs in Vite)
    // We will use standard L.divIcon which does not rely on image requests,
    // but this is standard safety practice for Leaflet in bundlers.
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    });

    // Initialize Leaflet map if it hasn't been already
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current, {
        center: [19.03, 72.84],
        zoom: 11,
        zoomControl: true,
        attributionControl: true
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clean up old markers
    Object.keys(markersRef.current).forEach((key) => {
      markersRef.current[key].remove();
    });
    markersRef.current = {};

    // Plot restaurants
    restaurants.forEach((res) => {
      if (!res.latitude || !res.longitude) return;

      const isWinner = winner && winner.id === res.id;
      const isSelected = selectedOnMap && selectedOnMap.id === res.id;

      // Select border color and marker color theme based on status
      let pinColor = '#F43F5E'; // Red primary theme
      let shadowColor = 'rgba(244, 63, 94, 0.4)';
      let labelText = '';

      if (isWinner) {
        pinColor = '#10B981'; // Green for winner
        shadowColor = 'rgba(16, 185, 129, 0.5)';
        labelText = '👑';
      } else if (res.favorite) {
        pinColor = '#F59E0B'; // Gold for favorites
        shadowColor = 'rgba(245, 158, 11, 0.4)';
        labelText = '⭐';
      }

      // High-Contrast Retro style marker pin matching our UI
      const icon = L.divIcon({
        className: 'custom-map-marker',
        html: `
          <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
            ${isWinner || isSelected ? `
              <div class="animate-ping" style="
                position: absolute;
                width: 28px;
                height: 28px;
                border-radius: 50%;
                background-color: ${pinColor};
                opacity: 0.4;
              "></div>
            ` : ''}
            <div style="
              width: 24px;
              height: 24px;
              border-radius: 50% 50% 50% 0;
              background-color: ${pinColor};
              border: 2px solid #1F2937;
              transform: rotate(-45deg);
              display: flex;
              align-items: center;
              justify-content: center;
              box-shadow: 2px 2px 0px #1F2937;
            ">
              <div style="
                width: 12px;
                height: 12px;
                border-radius: 50%;
                background-color: white;
                border: 1.5px solid #1F2937;
                transform: rotate(45deg);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                font-weight: bold;
              ">
                ${labelText}
              </div>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 28],
        popupAnchor: [0, -28]
      });

      const marker = L.marker([res.latitude, res.longitude], { icon })
        .addTo(map)
        .on('click', () => {
          setSelectedOnMap(res);
        });

      // Bind dynamic high-contrast retro popup
      marker.bindPopup(`
        <div style="
          font-family: 'Inter', system-ui, sans-serif;
          color: #1F2937;
          font-size: 11px;
          line-height: 1.4;
          padding: 2px;
          min-width: 150px;
        ">
          <div style="font-weight: 800; font-size: 13px; margin-bottom: 3px; color: #1F2937;">
            ${res.name}
          </div>
          <div style="color: #F59E0B; font-weight: 800; font-size: 10px; margin-bottom: 2px;">
            ${res.category || 'Munch Spot'} • ${res.ambience || 'Cafe'}
          </div>
          <div style="font-weight: 700; color: #4B5563; margin-bottom: 4px;">
            Ambience: ${res.ambience} • Price: ${res.priceRange || '₹₹'}
          </div>
          ${res.rating ? `
            <div style="display: flex; align-items: center; gap: 4px; font-weight: 800; color: #059669; background: #ECFDF5; border: 1.5px solid #A7F3D0; padding: 2px 6px; border-radius: 6px; width: fit-content; margin-top: 4px;">
              <span>⭐ ${res.rating} rating</span>
            </div>
          ` : ''}
        </div>
      `, {
        closeButton: true,
        className: 'custom-map-popup'
      });

      markersRef.current[res.id] = marker;
    });

  }, [restaurants, winner, selectedOnMap]);

  // Handle zooming/panning transitions to selectedOnMap or winner
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const targetCoord = selectedOnMap || winner;
    if (targetCoord && targetCoord.latitude && targetCoord.longitude) {
      map.setView([targetCoord.latitude, targetCoord.longitude], 14, {
        animate: true,
        duration: 1.0
      });

      // Find marker and open its popup automatically
      const marker = markersRef.current[targetCoord.id];
      if (marker) {
        // Slight delay to allow map view transition to finish smoothly
        const timeout = setTimeout(() => {
          marker.openPopup();
        }, 350);
        return () => clearTimeout(timeout);
      }
    }
  }, [selectedOnMap, winner]);

  // Resize listener to prevent silent map initialization collapses
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    resizeObserver.observe(mapContainerRef.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div 
      ref={mapContainerRef} 
      className="w-full h-full"
      style={{ minHeight: '100%' }}
    />
  );
}
