interface PlayerOptionsProps {
  audioMonitor: boolean;
  onChangeAudioMonitor: (value: boolean) => void;
}

export default function PlayerOptions(props: PlayerOptionsProps) {
  return (
    <div>
      <label> Audio monitor</label>
      <input
        type="checkbox"
        checked={props.audioMonitor}
        onChange={(e) => props.onChangeAudioMonitor(e.target.checked)}
      />
    </div>
  );
}
