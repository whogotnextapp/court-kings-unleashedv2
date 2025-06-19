
/// <reference types="vite/client" />

// Apple MapKit JS types
declare global {
  interface Window {
    mapkit?: {
      init: (options: any) => void;
      Map: new (element: HTMLElement, options?: any) => any;
      Search: new (options: any) => {
        search: (query: string) => Promise<{
          places: Array<{
            name: string;
            formattedAddress: string;
            coordinate: {
              latitude: number;
              longitude: number;
            };
          }>;
        }>;
      };
      CoordinateRegion: new (coordinate: any, span: any) => any;
      Coordinate: new (latitude: number, longitude: number) => any;
      CoordinateSpan: new (latitudeDelta: number, longitudeDelta: number) => any;
    };
    MusicKit?: {
      configure: (options: any) => Promise<any>;
      getInstance: () => {
        isAuthorized: boolean;
        authorize: () => Promise<any>;
        api: {
          search: (query: string, options: any) => Promise<any>;
        };
        setQueue: (options: any) => Promise<any>;
        play: () => Promise<any>;
      };
    };
  }
}

export {};
