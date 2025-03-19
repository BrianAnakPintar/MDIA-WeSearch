import H5AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { FaDownload } from "react-icons/fa";

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  return (
    <H5AudioPlayer
      src={src}
      autoPlay={false}
      showJumpControls={false}
      showDownloadProgress={false}
      customAdditionalControls={[
        <a key="download" href={src} download className="download-button">
          <FaDownload />
        </a>,
      ]}
    />
  );
};

export default AudioPlayer;
