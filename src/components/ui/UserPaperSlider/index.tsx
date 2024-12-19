import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "./UserPaperSlider.scss";
import { User } from "../../../types/userTypes";
import { IconButton, Skeleton } from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { useState } from "react";
import FullPhotoModal from "../../modals/FullPhotoModal";
import { Photo } from "../../../types/photoTypes";

type Props = {
  user: User;
  loading: boolean;
};

const UserPaperSlider = ({ user, loading }: Props) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
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

              <IconButton
                onClick={() => {
                  setSelectedPhoto(photo);
                  setOpenModal(true);
                }}
                sx={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  border: "1px solid rgba(0, 0, 0, 0.12)",
                  borderRadius: "50%",
                  padding: "8px",
                  transition: "all 0.3s ease-in-out",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <FullscreenIcon sx={{ color: "white" }} />
              </IconButton>
            </SwiperSlide>
          ))}
        </Swiper>
      )}

      {openModal && (
        <FullPhotoModal
          open={openModal}
          handleClose={() => setOpenModal(false)}
          photo={selectedPhoto!}
        />
      )}
    </>
  );
};
export default UserPaperSlider;
