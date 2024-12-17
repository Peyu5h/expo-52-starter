import { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import * as Location from 'expo-location';
import SearchBox from '~/components/SearchBox';

const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN;

export default function LocationScreen() {
  const [source, setSource] = useState({
    lat: 37.78825,
    lng: -122.4324,
    shouldFly: true,
  });

  const [location, setLocation] = useState({
    latitude: source.lat,
    longitude: source.lng,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef<MapView | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (source.shouldFly && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: source.lat,
          longitude: source.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      );
    }
  }, [source]);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      handleLocationSelect(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.error('Error getting current location:', error);
    }
  };

  const handleLocationSelect = (lat: number, lng: number) => {
    setSource({
      lat,
      lng,
      shouldFly: true,
    });

    setLocation({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBox
          onLocationSelect={handleLocationSelect}
          MAPBOX_ACCESS_TOKEN={MAPBOX_ACCESS_TOKEN || ''}
        />
      </View>

      <MapView ref={mapRef} style={styles.map} initialRegion={location}>
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  searchContainer: {
    position: 'absolute',
    width: '90%',
    alignSelf: 'center',
    top: 20,
    zIndex: 1,
  },
});
