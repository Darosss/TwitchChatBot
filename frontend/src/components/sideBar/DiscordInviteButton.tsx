import { AxiosError, Loading } from "@components/axiosHelper";
import { useGetDiscordInviteUrl } from "@services";

export default function DiscordInviteButton() {
  const { data: discordInviteUrl, error, loading } = useGetDiscordInviteUrl();

  if (!discordInviteUrl) return null;
  if (error) return <AxiosError error={error} />;
  if (loading) return <Loading />;
  return (
    <a
      className="common-button tertiary-button"
      href={discordInviteUrl.data}
      target="_blank"
      rel="noreferrer"
    >
      Invite to discord
    </a>
  );
}
