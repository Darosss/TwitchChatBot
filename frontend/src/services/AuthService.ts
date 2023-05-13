import useAxiosCustom from "./ApiService";

export interface Auth {
  _id: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  obtainmentTimestamp: number;
  scope: string[];
}

export interface AuthLink {
  data: string;
}

export const useGetAuthorizeUrl = () => {
  return useAxiosCustom<AuthLink>({
    url: `/auth/authorize-url`,
  });
};
