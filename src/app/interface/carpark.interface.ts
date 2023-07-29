
export interface CarPark {
    items: Item[];
  }
  
  export  interface Item {
    timestamp: string;
    carpark_data: CarparkDaum[];
  }
  
  export interface CarparkDaum {
    carpark_info: CarparkInfo[];
    carpark_number: string;
    update_datetime: string;
  }
  
  export interface CarparkInfo {
    total_lots: string;
    lot_type: string;
    lots_available: string;
  }

  export interface  CarparkInfoSummary {
    totalLots: number;
    carparks: CarparkDaum[];
  }