import Hls from "hls.js";
import React, { useEffect, useRef, useState } from "react";
import { FaPause, FaPlay } from "react-icons/fa";

export type HiddenVideoProps = {
  videoSourceUrl: string;
  videoId?: string;
  onVideoSize?: (width: number, height: number) => void;
};

export const HiddenVideo = (props: HiddenVideoProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [userInteracted, setUserInteracted] = React.useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const hls = useRef<Hls | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !userInteracted) return;

    if (hls.current) {
      hls.current.destroy();
    }

    const handleMetadataLoaded = () => {
      const width = video.videoWidth;
      const height = video.videoHeight;
      console.debug("handleMetadataLoaded: " + width + " x " + height);
      props.onVideoSize?.(width, height);
    };

    console.debug(
      "Browser:hls",
      Hls.isSupported(),
      ", ",
      video.canPlayType("application/vnd.apple.mpegurl"),
    );

    video.addEventListener("canplaythrough", handleMetadataLoaded);

    const userAgent = window.navigator.userAgent.toLowerCase();
    let isSafari = false;
    console.debug("!!! userAgent");
    if (userAgent.indexOf("msie") != -1 || userAgent.indexOf("trident") != -1) {
      console.debug("browser: Internet Explorer");
    } else if (userAgent.indexOf("edge") != -1) {
      console.debug("browser: Edge");
    } else if (userAgent.indexOf("chrome") != -1) {
      console.debug("browser: Google Chrome");
    } else if (userAgent.indexOf("safari") != -1) {
      console.debug("browser: Safari");
      isSafari = true;
    }
    let isMobile = false;
    if (userAgent.indexOf("iphone") != -1) {
      console.debug("device: iPhone");
      isMobile = true;
    } else if (userAgent.indexOf("ipad") != -1) {
      console.debug("device: iPad");
    } else if (userAgent.indexOf("android") != -1) {
      if (userAgent.indexOf("mobile") != -1) {
        console.debug("device: android");
        isMobile = true;
      } else {
        console.debug("device: android Tablet");
      }
    }
    const isSafariNoMobile = isSafari && !isMobile;

    if (!isSafariNoMobile && Hls.isSupported()) {
      hls.current = new Hls();
      hls.current.loadSource(props.videoSourceUrl);
      hls.current.attachMedia(video);
      video.load();
      hls.current.on(Hls.Events.MANIFEST_PARSED, function () {
        video.play().catch((error) => {
          console.error("Video play failed:", error);
        });
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      hls.current.on(Hls.Events.ERROR, function (_: any, data: any) {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // try to recover network error
              console.error("Fatal network error encountered, try to recover.");
              hls.current!.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Fatal media error encountered, try to recover.");
              hls.current!.recoverMediaError();
              break;
            default:
              // cannot recover
              console.error("Unrecoverable error encountered.");
              hls.current!.destroy();
              break;
          }
        }
      });
    } else if ("maybe" === video.canPlayType("application/vnd.apple.mpegurl")) {
      console.debug(
        "Safari: ",
        video.canPlayType("application/vnd.apple.mpegurl"),
      );
      video.src = props.videoSourceUrl;
      video.load();
      console.debug(
        "video size: " + video.videoWidth + " x " + video.videoHeight,
      );
      video.play().catch((error) => {
        console.error("Video play failed:", error);
      });
    } else {
      console.debug("!!! video not played automatically");
    }
    if (video && video.style) {
      video.style.opacity = "0";
      video.style.zIndex = "-1";
      video.style.position = "absolute";
    }

    return () => {
      video.removeEventListener("canplaythrough", handleMetadataLoaded);
      if (hls.current) {
        hls.current.destroy();
      }
    };
  }, [props.videoSourceUrl, userInteracted]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const uiZIndex = "2";

  return (
    <div>
      <video
        id={props.videoId || "video"}
        ref={videoRef}
        crossOrigin="anonymous"
        width="100"
        height="100"
        playsInline
        autoPlay
        muted
        preload="auto"
        loop
        style={{ opacity: 0, position: "absolute", zIndex: -1 }}
      />
      <div>
        {!userInteracted ? (
          <FaPlay
            onClick={() => {
              setUserInteracted(true);
              setIsPlaying(true);
            }}
            style={{
              position: "absolute",
              top: "90%",
              left: "90%",
              transform: "translate(-50%, -50%)",
              zIndex: uiZIndex,
              color: "lightgreen",
            }}
          />
        ) : (
          <div
            onClick={togglePlayPause}
            style={{
              position: "absolute",
              top: "90%",
              left: "90%",
              transform: "translate(-50%, -50%)",
              zIndex: uiZIndex,
              color: "lightgreen",
            }}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </div>
        )}
      </div>
    </div>
  );
};
