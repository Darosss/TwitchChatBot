export const generateEnabledDisabledDiv = (enabled: boolean, value: string) => {
  return <div className={`${enabled ? "enabled" : "disabled"}`}>{value}</div>;
};
