import { AvatarCircles } from "./avatar-circles";

const ProfilePicture = () => {
  return (
    <AvatarCircles
      className="pb-0"
      avatarUrls={[
        {
          imageUrl: "/assets/profilepictures/my-avatar.JPG",
          hoverUrl: "/assets/profilepictures/my-avatar-hover.JPG",
          profileUrl: "https://github.com/YaseenKannemeyer",
          showFlag: true,
        },
      ]}
      sizeClass="h-32 w-32"
    />
  );
};

export default ProfilePicture;
