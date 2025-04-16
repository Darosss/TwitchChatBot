import { Error, Loading } from "@components/axiosHelper";
import { useGetDiscordInviteUrl } from "@services";

export default function DiscordInviteButton() {
  const { data: discordInviteUrl, error, isLoading } = useGetDiscordInviteUrl();

  if (!discordInviteUrl) return null;
  if (error) return <Error error={error} />;
  if (isLoading) return <Loading />;
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
