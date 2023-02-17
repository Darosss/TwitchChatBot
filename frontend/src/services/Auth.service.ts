import useAxiosCustom from "./Api.service";

export interface IAuth {
  _id: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  obtainmentTimestamp: number;
  scope: string[];
}

export interface IAuthLink {
  data: string;
}

const getAuthorizeUrl = () => {
  return useAxiosCustom<IAuthLink>({
    url: `/auth/authorize-url`,
  });
};

export default { getAuthorizeUrl };
