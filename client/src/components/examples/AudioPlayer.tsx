import AudioPlayer from '../AudioPlayer';

export default function AudioPlayerExample() {
  return (
    <div className="p-8 space-y-4">
      <AudioPlayer label="Original Audio" />
      <AudioPlayer label="Transformed Audio" />
    </div>
  );
}
