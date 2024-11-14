import { MapContainer } from "react-leaflet";
import { TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Address } from "../../types/addressTypes";
import CustomNoCoordinatesBlock from "../ui/CustomNoCoordinatesBlock";

type Props = {
  position: number[] | null;
  address: Address;
};

const InteractiveMap = ({ position, address }: Props) => {
  return (
    <>
      {position === null ? (
        <CustomNoCoordinatesBlock />
      ) : (
        <MapContainer
          center={[position[0], position[1]]}
          zoom={13}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[position[0], position[1]]}>
            <Popup>
              {address.streetAddress}, {address.city}, {address.country}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  );
};
export default InteractiveMap;
