import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
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
          center={position}
          zoom={15}
          scrollWheelZoom={true}
          zoomAnimation={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>
              Адреса: {address.streetAddress} {address.houseNumber}{" "}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </>
  );
};
export default InteractiveMap;
