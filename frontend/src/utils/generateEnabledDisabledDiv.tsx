export const generateEnabledDisabledDiv = (enabled: boolean, value: string) => {
  return (
    <div style={{ background: `${enabled ? "green" : "red"}` }}>{value}</div>
  );
};
