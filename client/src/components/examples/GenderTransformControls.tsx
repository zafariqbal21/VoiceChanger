import GenderTransformControls from '../GenderTransformControls';

export default function GenderTransformControlsExample() {
  return (
    <div className="p-8">
      <GenderTransformControls onTransform={(value) => console.log('Transform:', value)} />
    </div>
  );
}
