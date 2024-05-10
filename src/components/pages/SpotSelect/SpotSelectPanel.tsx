import SpotCard from "./SpotCard";
import styles from "./SpotSelectPanel.module.css";

const SpotSelectPanel = () => {
  const spots = [
    {
      id: "ayutthaya1",
      name: "Ayutthaya",
      description:
        "The Ayutthaya Kingdom or the Empire of Ayutthaya was a Siamese kingdom that existed in Southeast Asia from 1351 to 1767, centered around the city of Ayutthaya, in Siam, or present-day Thailand.",
      thumbnailImageUrl: "./images/ayutthaya1-2d.png",
      sphericalImageUrl: "./images/ayutthaya1-3d.png",
      sphericalVideoUrl: "./videos/ayutthaya/ayutthaya1.m3u8",
    },
    {
      id: "ayutthaya2",
      name: "Ayutthaya Part II",
      description:
        "Ayutthaya is a historical city in Thailand, known for its majestic ruins, which include ancient temples, palaces, and statues. Once a prosperous Siamese capital, it is now a UNESCO World Heritage Site, attracting visitors with its rich history and architectural beauty.",
      thumbnailImageUrl: "./images/ayutthaya2-2d.png",
      sphericalImageUrl: "./images/ayutthaya2-3d.png",
      sphericalVideoUrl: "./videos/ayutthaya/ayutthaya1.m3u8",
    },
    {
      id: "ayutthaya3",
      name: "Ayutthaya Part III",
      description:
        "The Ayutthaya Historical Park houses the remnants of the old city of Ayutthaya, showcasing a blend of Siamese, Khmer, Sri Lankan, and Persian influences. Its ruins, characterized by prang (reliquary towers) and gigantic monasteries, offer a glimpse into Thailand's glorious past.",
      thumbnailImageUrl: "./images/ayutthaya3-2d.png",
      sphericalImageUrl: "./images/ayutthaya3-3d.png",
      sphericalVideoUrl: "",
    },
    {
      id: "toyosu1",
      name: "Toyosu Part I",
      description:
        "Toyosu is a district in Tokyo, Japan, known for its modern waterfront development. It's home to the Toyosu Market, the world's largest wholesale fish market, which replaced the historic Tsukiji Market. The area also features residential towers, commercial spaces, and parks, making it a vibrant part of Tokyo's bay area",
      thumbnailImageUrl: "./images/toyosu1-2d.png",
      sphericalImageUrl: "./images/toyosu1-3d.png",
      sphericalVideoUrl: "./videos/toyosu1/toyosu1.m3u8",
    },
    {
      id: "toyosu2",
      name: "Toyosu Part II",
      description:
        "Toyosu is a district in the Koto Ward of Tokyo, Japan, known for its modern waterfront developments, including luxury high-rise apartments, commercial facilities, and parks. It is also famous for the Toyosu Market, one of the largest wholesale seafood and produce markets in the world, which replaced the historic Tsukiji Market in October 2018.",
      thumbnailImageUrl: "./images/toyosu2-2d.png",
      sphericalImageUrl: "./images/toyosu2-3d.png",
      sphericalVideoUrl: "./videos/toyosu2/toyosu2.m3u8",
    },
    {
      id: "toyosu3",
      name: "Toyosu Part III",
      description:
        "Toyosu, located in Tokyo, Japan, gained fame with the 2018 relocation of Tsukiji fish market to Toyosu Market. Known for its modern architecture, it combines a bustling market, residential areas, and waterfront parks, showcasing Tokyo's blend of innovation and tradition.",
      thumbnailImageUrl: "./images/toyosu2-2d.png",
      sphericalImageUrl: "./images/toyosu2-3d.png",
      sphericalVideoUrl: "",
    },
  ];
  return (
    <>
      <div className={styles.content}>
        {spots.map((spot) => (
          <SpotCard key={spot.id} spot={spot} />
        ))}
      </div>
    </>
  );
};

export default SpotSelectPanel;
