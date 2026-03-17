import { AvatarCircles } from "./avatar-circles";


const ProfilePicture = () => {
  return (
    <AvatarCircles className="mt-25 pb-0"
      avatarUrls={[
        {
          imageUrl: "/assets/profilepictures/my-avatar.JPG",        // default image
          hoverUrl: "/assets/profilepictures/my-avatar-hover.JPG", // hover image
          profileUrl: "https://github.com/YaseenKannemeyer",
          showFlag: true, // ZA flag
        },
      ]}
      sizeClass="h-20 w-20 md:h-20 md:w-20 lg:h-32 lg:w-32"
    />
  );
};

export default ProfilePicture;
