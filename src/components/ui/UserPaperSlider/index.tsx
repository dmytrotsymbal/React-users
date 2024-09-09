import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./UserPaperSlider.scss";
import { User } from "../../../types/userTypes";
import { Skeleton } from "@mui/material";

type Props = {
  user: User;
  loading: boolean;
};

const UserPaperSlider = ({ user, loading }: Props) => {
  return (
    <>
      {loading ? (
        <Skeleton
          variant="rectangular"
          width="300px"
          height="250px"
          sx={{ borderRadius: "4px" }}
        />
      ) : (
        <Swiper
          style={{
            width: "auto",
            maxWidth: "300px",
            height: "250px",
          }}
          slidesPerView={1}
          scrollbar={{ draggable: true }}
          modules={[Navigation, Pagination, Scrollbar, A11y]}
        >
          {user.photos.map((photo) => (
            <SwiperSlide key={photo.imageID}>
              <img
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "4px",
                }}
                src={photo.imageURL}
                alt={photo.altText}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </>
  );
};
export default UserPaperSlider;
