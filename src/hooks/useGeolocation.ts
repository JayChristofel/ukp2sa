"use client";

import { useState, useCallback } from "react";
import { Geolocation, PermissionStatus } from "@capacitor/geolocation";

export const useGeolocation = () => {
  const [coords, setCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentLocation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Check permissions
      const permission: PermissionStatus = await Geolocation.checkPermissions();
      
      if (permission.location !== 'granted') {
        const request: PermissionStatus = await Geolocation.requestPermissions();
        if (request.location !== 'granted') {
          throw new Error("Izin lokasi ditolak oleh pengguna");
        }
      }

      // 2. Get coordinates
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000
      });

      const newCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      setCoords(newCoords);
      return newCoords;

    } catch (err: any) {
      const msg = err.message || "Gagal mendapatkan lokasi";
      setError(msg);
      console.error("Geolocation Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { coords, loading, error, getCurrentLocation };
};
